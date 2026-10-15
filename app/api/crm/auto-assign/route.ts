
import { NextRequest, NextResponse } from "next/server";
import {
  FieldValue,
  Timestamp,
  type Transaction,
} from "firebase-admin/firestore";
import { adminAuth, adminDb } from "@/lib/firebase-admin";
import {
  AUTO_ASSIGN_LIMIT,
  AUTO_ASSIGN_COOLDOWN_MS,
  assignmentId,
  createAssignmentData,
} from "@/lib/crm-assignments";

export const runtime = "nodejs";

const LOCK_DURATION_MS = 5 * 60 * 1000;
const CANDIDATE_PAGE_SIZE = 500;
const MAX_CANDIDATES_TO_SCAN = 10000;

type CallerProfile = {
  name?: string;
  active?: boolean;
  lastAutoAssignedAt?: Timestamp | null;
  autoAssignLockUntil?: Timestamp | null;
  autoAssignLockId?: string | null;
};

function apiError(
  message: string,
  status: number
) {
  return NextResponse.json(
    { success: false, error: message },
    { status }
  );
}

function randomLockId() {
  return [
    Date.now().toString(36),
    Math.random().toString(36).slice(2),
  ].join("-");
}

async function authenticateCaller(
  request: NextRequest
) {
  const header = request.headers.get("authorization");

  const token = header?.match(/^Bearer\s+(.+)$/i)?.[1];

  if (!token) {
    throw new Error("UNAUTHORIZED");
  }

  const decoded = await adminAuth.verifyIdToken(
    token,
    true
  );

  if (decoded.crmAgent !== true) {
    throw new Error("FORBIDDEN");
  }

  const userRecord = await adminAuth.getUser(
    decoded.uid
  );

  if (userRecord.disabled) {
    throw new Error("FORBIDDEN");
  }

  const callerRef = adminDb
    .collection("crmUsers")
    .doc(decoded.uid);

  const callerSnap = await callerRef.get();

  if (
    !callerSnap.exists ||
    callerSnap.data()?.active !== true
  ) {
    throw new Error("INACTIVE_CALLER");
  }

  return {
    uid: decoded.uid,
    name:
      String(callerSnap.data()?.name || "").trim() ||
      userRecord.displayName ||
      "Caller",
    callerRef,
  };
}

async function acquireLock(
  callerRef: FirebaseFirestore.DocumentReference,
  lockId: string
) {
  const now = Date.now();

  return adminDb.runTransaction(async (tx) => {
    const snapshot = await tx.get(callerRef);

    if (!snapshot.exists) {
      return { acquired: false, reason: "inactive" };
    }

    const caller =
      snapshot.data() as CallerProfile;

    if (caller.active !== true) {
      return { acquired: false, reason: "inactive" };
    }

    const lastAssignment =
      caller.lastAutoAssignedAt;

    if (
      lastAssignment instanceof Timestamp &&
      now - lastAssignment.toMillis() <
        AUTO_ASSIGN_COOLDOWN_MS
    ) {
      return {
        acquired: false,
        reason: "cooldown",
        nextEligibleAt: new Date(
          lastAssignment.toMillis() +
            AUTO_ASSIGN_COOLDOWN_MS
        ).toISOString(),
      };
    }

    const lockUntil = caller.autoAssignLockUntil;

    if (
      lockUntil instanceof Timestamp &&
      lockUntil.toMillis() > now
    ) {
      return {
        acquired: false,
        reason: "processing",
      };
    }

    tx.update(callerRef, {
      autoAssignLockId: lockId,
      autoAssignLockUntil: Timestamp.fromMillis(
        now + LOCK_DURATION_MS
      ),
    });

    return { acquired: true, reason: "ok" };
  });
}

async function releaseLock(
  callerRef: FirebaseFirestore.DocumentReference,
  lockId: string
) {
  await adminDb.runTransaction(async (tx) => {
    const snapshot = await tx.get(callerRef);

    if (
      snapshot.data()?.autoAssignLockId !== lockId
    ) {
      return;
    }

    tx.update(callerRef, {
      autoAssignLockId: FieldValue.delete(),
      autoAssignLockUntil: FieldValue.delete(),
    });
  });
}

async function getEligibleLeadIds(
  agentUid: string
): Promise<string[]> {
  const eligible: string[] = [];
  let cursor:
    | FirebaseFirestore.QueryDocumentSnapshot
    | undefined;

  let scanned = 0;

  while (
    eligible.length < AUTO_ASSIGN_LIMIT &&
    scanned < MAX_CANDIDATES_TO_SCAN
  ) {
    let query = adminDb
      .collection("crmLeads")
      .orderBy(
        "__name__",
        "asc"
      )
      .limit(CANDIDATE_PAGE_SIZE);

    if (cursor) {
      query = query.startAfter(cursor);
    }

    const snapshot = await query.get();

    if (snapshot.empty) {
      break;
    }

    cursor = snapshot.docs[
      snapshot.docs.length - 1
    ];

    scanned += snapshot.size;

    const candidates = snapshot.docs.filter(
      (doc) => {
        const data = doc.data();

        return (
          data.status !== "Won" &&
          data.status !== "Lost"
        );
      }
    );

    if (candidates.length === 0) {
      if (
        snapshot.size < CANDIDATE_PAGE_SIZE
      ) {
        break;
      }

      continue;
    }

    const refs = candidates.map((doc) =>
      adminDb
        .collection("crmLeadAssignments")
        .doc(
          assignmentId(doc.id, agentUid)
        )
    );

    const existing = await adminDb.getAll(
      ...refs
    );

    for (let index = 0; index < candidates.length; index++) {
      const lead = candidates[index];
      const previous = existing[index];

      // A caller must never receive the same lead twice.
      if (previous.exists) {
        continue;
      }

      // Respect legacy single-caller assignments.
      const legacyAssignedTo =
        lead.data().assignedTo;

      if (
        typeof legacyAssignedTo === "string" &&
        legacyAssignedTo.length > 0 &&
        legacyAssignedTo !== agentUid
      ) {
        continue;
      }

      eligible.push(lead.id);

      if (
        eligible.length >= AUTO_ASSIGN_LIMIT
      ) {
        break;
      }
    }

    if (
      snapshot.size < CANDIDATE_PAGE_SIZE
    ) {
      break;
    }
  }

  return eligible;
}

async function commitAssignments(
  agentUid: string,
  agentName: string,
  callerRef: FirebaseFirestore.DocumentReference,
  lockId: string,
  leadIds: string[]
) {
  const now = new Date();
  const timestamp = Timestamp.fromDate(now);

  return adminDb.runTransaction(
    async (tx: Transaction) => {
      const callerSnap = await tx.get(
        callerRef
      );

      const caller =
        callerSnap.data() as
          | CallerProfile
          | undefined;

      if (
        !caller ||
        caller.active !== true ||
        caller.autoAssignLockId !== lockId
      ) {
        throw new Error("LOCK_LOST");
      }

      const previous =
        caller.lastAutoAssignedAt;

      if (
        previous instanceof Timestamp &&
        now.getTime() -
          previous.toMillis() <
          AUTO_ASSIGN_COOLDOWN_MS
      ) {
        throw new Error("COOLDOWN");
      }

      const assignmentRefs = leadIds.map(
        (leadId) =>
          adminDb
            .collection("crmLeadAssignments")
            .doc(
              assignmentId(
                leadId,
                agentUid
              )
            )
      );

      // Firestore requires transaction reads
      // to finish before writes begin.
      const assignmentSnaps =
        assignmentRefs.length > 0
          ? await tx.getAll(
              ...assignmentRefs
            )
          : [];

      const leadRefs = leadIds.map(
        (leadId) =>
          adminDb
            .collection("crmLeads")
            .doc(leadId)
      );

      const leadSnaps =
        leadRefs.length > 0
          ? await tx.getAll(
              ...leadRefs
            )
          : [];

      let assigned = 0;

      for (
        let index = 0;
        index < leadIds.length;
        index++
      ) {
        if (
          assignmentSnaps[index].exists
        ) {
          continue;
        }

        const leadSnap =
          leadSnaps[index];

        if (!leadSnap.exists) {
          continue;
        }

        const leadData =
          leadSnap.data() || {};

        if (
          leadData.status === "Won" ||
          leadData.status === "Lost"
        ) {
          continue;
        }

        const legacyUid =
          leadData.assignedTo;

        if (
          typeof legacyUid === "string" &&
          legacyUid.length > 0 &&
          legacyUid !== agentUid
        ) {
          continue;
        }

        tx.create(
          assignmentRefs[index],
          createAssignmentData({
            leadId: leadIds[index],
            agentUid,
            agentName,
            source: "auto",
            assignedAt: now,
          })
        );

        assigned++;
      }

      // Cooldown starts after a successful
      // allocation attempt, including zero
      // eligible leads.
      tx.update(callerRef, {
        lastAutoAssignedAt: timestamp,
        lastAutoAssignedCount: assigned,
        autoAssignLockId: FieldValue.delete(),
        autoAssignLockUntil: FieldValue.delete(),
        updatedAt: timestamp,
      });

      return {
        assigned,
        nextEligibleAt: new Date(
          now.getTime() +
            AUTO_ASSIGN_COOLDOWN_MS
        ).toISOString(),
      };
    }
  );
}

export async function POST(
  request: NextRequest
) {
  let callerRef:
    | FirebaseFirestore.DocumentReference
    | undefined;

  let lockId: string | undefined;

  try {
    const caller =
      await authenticateCaller(request);

    callerRef = caller.callerRef;
    lockId = randomLockId();

    const lock = await acquireLock(
      callerRef,
      lockId
    );

    if (!lock.acquired) {
      if (lock.reason === "cooldown") {
        return NextResponse.json({
          success: true,
          assigned: 0,
          reason: "cooldown",
          nextEligibleAt:
            lock.nextEligibleAt,
        });
      }

      if (lock.reason === "processing") {
        return NextResponse.json(
          {
            success: false,
            assigned: 0,
            reason: "processing",
            message:
              "Lead assignment is already processing.",
          },
          { status: 409 }
        );
      }

      return apiError(
        "Caller account is inactive.",
        403
      );
    }

    const leadIds =
      await getEligibleLeadIds(
        caller.uid
      );

    const result =
      await commitAssignments(
        caller.uid,
        caller.name,
        callerRef,
        lockId,
        leadIds
      );

    return NextResponse.json({
      success: true,
      reason: "assigned",
      assigned: result.assigned,
      nextEligibleAt:
        result.nextEligibleAt,
    });
  } catch (error) {
    console.error(
      "CRM auto-assignment error:",
      error
    );

    const message =
      error instanceof Error
        ? error.message
        : "UNKNOWN";

    if (message === "UNAUTHORIZED") {
      return apiError(
        "Please sign in again.",
        401
      );
    }

    if (
      message === "FORBIDDEN" ||
      message === "INACTIVE_CALLER"
    ) {
      return apiError(
        "Calling-team access denied.",
        403
      );
    }

    if (
      message === "LOCK_LOST" ||
      message === "COOLDOWN"
    ) {
      return apiError(
        "Assignment state changed. Please retry.",
        409
      );
    }

    return apiError(
      "Could not assign leads.",
      500
    );
  } finally {
    if (callerRef && lockId) {
      try {
        await releaseLock(
          callerRef,
          lockId
        );
      } catch (error) {
        console.error(
          "CRM assignment lock cleanup failed:",
          error
        );
      }
    }
  }
}
