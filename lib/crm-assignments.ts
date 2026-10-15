
import { Timestamp } from "firebase-admin/firestore";

export const AUTO_ASSIGN_LIMIT = 100;

export const AUTO_ASSIGN_COOLDOWN_MS =
  24 * 60 * 60 * 1000;

export const ASSIGNMENT_EXPIRY_MS =
  10 * 24 * 60 * 60 * 1000;

export const PROTECTED_OUTCOMES = [
  "Interested",
  "Details Shared",
  "Visit Scheduled",
] as const;

export type ProtectedOutcome =
  (typeof PROTECTED_OUTCOMES)[number];

export type AssignmentOutcome =
  | "New"
  | "No Answer"
  | "Contacted"
  | "Follow-up"
  | "Qualified"
  | "Won"
  | "Lost"
  | ProtectedOutcome;

export type AssignmentSource =
  | "auto"
  | "manual"
  | "migration";

export type CrmLeadAssignment = {
  leadId: string;
  agentUid: string;
  agentName: string;

  active: boolean;
  source: AssignmentSource;

  outcome: AssignmentOutcome;
  protected: boolean;

  assignedAt: Timestamp;
  expiresAt: Timestamp | null;

  updatedAt: Timestamp;
};

export function assignmentId(
  leadId: string,
  agentUid: string
): string {
  if (!leadId || !agentUid) {
    throw new Error(
      "Lead ID and caller UID are required."
    );
  }

  return `${leadId}_${agentUid}`;
}

export function isProtectedOutcome(
  outcome: string
): outcome is ProtectedOutcome {
  return PROTECTED_OUTCOMES.some(
    (item) => item === outcome
  );
}

export function getAssignmentExpiry(
  assignedAt: Date
): Timestamp {
  return Timestamp.fromMillis(
    assignedAt.getTime() + ASSIGNMENT_EXPIRY_MS
  );
}

export function canAutoAssign(
  lastAutoAssignedAt: Timestamp | null | undefined,
  now: Date = new Date()
): boolean {
  if (!lastAutoAssignedAt) {
    return true;
  }

  return (
    now.getTime() -
      lastAutoAssignedAt.toMillis() >=
    AUTO_ASSIGN_COOLDOWN_MS
  );
}

export function isAssignmentExpired(
  assignment: CrmLeadAssignment,
  now: Date = new Date()
): boolean {
  if (!assignment.active) {
    return false;
  }

  if (assignment.protected) {
    return false;
  }

  if (!assignment.expiresAt) {
    return false;
  }

  return (
    assignment.expiresAt.toMillis() <=
    now.getTime()
  );
}

export function createAssignmentData({
  leadId,
  agentUid,
  agentName,
  source,
  assignedAt = new Date(),
}: {
  leadId: string;
  agentUid: string;
  agentName: string;
  source: AssignmentSource;
  assignedAt?: Date;
}): CrmLeadAssignment {
  const timestamp = Timestamp.fromDate(assignedAt);

  return {
    leadId,
    agentUid,
    agentName,

    active: true,
    source,

    outcome: "New",
    protected: false,

    assignedAt: timestamp,
    expiresAt: getAssignmentExpiry(assignedAt),

    updatedAt: timestamp,
  };
}
