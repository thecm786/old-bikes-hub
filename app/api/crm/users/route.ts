
import { NextRequest, NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { adminAuth, adminDb } from "@/lib/firebase-admin";

export const runtime = "nodejs";

const CALLING_TEAM_LOGIN_CODE = "OBH2026";

function normalizedPhone(value: string) {
  const digits = value.replace(/\D/g, "");
  const local =
    digits.length === 12 && digits.startsWith("91")
      ? digits.slice(2)
      : digits;

  return /^[6-9]\d{9}$/.test(local)
    ? { local, international: `+91${local}` }
    : null;
}

async function verifyAdmin(request: NextRequest) {
  const token = request.headers
    .get("authorization")
    ?.replace(/^Bearer\s+/i, "");

  if (!token) {
    throw new Error("UNAUTHORIZED");
  }

  const decoded = await adminAuth.verifyIdToken(token, true);

  if (decoded.admin !== true) {
    throw new Error("FORBIDDEN");
  }

  return decoded;
}

function errorResponse(error: unknown) {
  const message =
    error instanceof Error ? error.message : "Unknown error";

  if (message === "UNAUTHORIZED") {
    return NextResponse.json(
      { error: "Please sign in again." },
      { status: 401 }
    );
  }

  if (message === "FORBIDDEN") {
    return NextResponse.json(
      { error: "Only an admin can perform this action." },
      { status: 403 }
    );
  }

  console.error("CRM user API error:", error);

  return NextResponse.json(
    { error: "The operation could not be completed." },
    { status: 500 }
  );
}

export async function POST(request: NextRequest) {
  try {
    await verifyAdmin(request);

    const body = await request.json();

    const name = String(body.name || "").trim();
    const phone = normalizedPhone(
      String(body.phone || "")
    );

    if (!name || name.length > 100 || !phone) {
      return NextResponse.json(
        {
          error:
            "Enter a name and valid 10-digit Indian mobile number.",
        },
        { status: 400 }
      );
    }

    let user;

    try {
      user = await adminAuth.getUserByPhoneNumber(
        phone.international
      );

      const existingCrmUser = await adminDb
        .collection("crmUsers")
        .doc(user.uid)
        .get();

      if (!existingCrmUser.exists) {
        return NextResponse.json(
          {
            error:
              "This phone number belongs to an existing account outside the calling team.",
          },
          { status: 409 }
        );
      }

      if (user.customClaims?.admin === true) {
        return NextResponse.json(
          {
            error:
              "An administrator account cannot be converted into a caller.",
          },
          { status: 403 }
        );
      }

      await adminAuth.updateUser(user.uid, {
        displayName: name,
        disabled: false,
      });
    } catch (error) {
      if (
        error instanceof Error &&
        "code" in error &&
        error.code === "auth/user-not-found"
      ) {
        user = await adminAuth.createUser({
          displayName: name,
          phoneNumber: phone.international,
          email: `crm-${phone.local}@oldbikeshub.com`,
          password: CALLING_TEAM_LOGIN_CODE,
        });
      } else {
        throw error;
      }
    }

    await adminAuth.setCustomUserClaims(user.uid, {
      ...(user.customClaims || {}),
      crmAgent: true,
    });

    await adminDb
      .collection("crmUsers")
      .doc(user.uid)
      .set(
        {
          uid: user.uid,
          name,
          email: "",
          phone: phone.local,
          active: true,
          updatedAt: FieldValue.serverTimestamp(),
        },
        { merge: true }
      );

    return NextResponse.json({
      uid: user.uid,
      name,
      phone: phone.local,
    });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const admin = await verifyAdmin(request);

    const body = await request.json();
    const uid = String(body.uid || "").trim();

    if (!uid) {
      return NextResponse.json(
        { error: "User ID is required." },
        { status: 400 }
      );
    }

    if (uid === admin.uid) {
      return NextResponse.json(
        { error: "You cannot delete your own account." },
        { status: 403 }
      );
    }

    const callerRef = adminDb
      .collection("crmUsers")
      .doc(uid);

    const callerSnapshot = await callerRef.get();

    if (!callerSnapshot.exists) {
      return NextResponse.json(
        { error: "Calling team member not found." },
        { status: 404 }
      );
    }

    const targetUser = await adminAuth.getUser(uid);

    if (targetUser.customClaims?.admin === true) {
      return NextResponse.json(
        {
          error:
            "Administrator accounts cannot be deleted from CRM.",
        },
        { status: 403 }
      );
    }

    // Disable login first.
    await adminAuth.updateUser(uid, {
      disabled: true,
    });

    // Mark CRM member inactive.
    await callerRef.update({
      active: false,
      removedAt: FieldValue.serverTimestamp(),
      removedBy: admin.uid,
      updatedAt: FieldValue.serverTimestamp(),
    });

    // Remove Firebase Authentication account.
    await adminAuth.deleteUser(uid);

    // Existing leads and remarks remain untouched.
    return NextResponse.json({
      success: true,
      message: "Calling team member removed successfully.",
    });
  } catch (error) {
    return errorResponse(error);
  }
}
