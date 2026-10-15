import { NextRequest, NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { adminAuth, adminDb } from "@/lib/firebase-admin";

export const runtime = "nodejs";
const CALLING_TEAM_LOGIN_CODE = "OBH2026";

function normalizedPhone(value: string) {
  const digits = value.replace(/\D/g, "");
  const local = digits.length === 12 && digits.startsWith("91") ? digits.slice(2) : digits;
  return /^[6-9]\d{9}$/.test(local) ? { local, international: `+91${local}` } : null;
}

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
    if (!token) return NextResponse.json({ error: "Sign in again to add a caller." }, { status: 401 });
    const admin = await adminAuth.verifyIdToken(token);
    if (admin.admin !== true) return NextResponse.json({ error: "Only an admin can add callers." }, { status: 403 });
    const body = await request.json();
    const name = String(body.name || "").trim();
    const phone = normalizedPhone(String(body.phone || ""));
    if (!name || name.length > 100 || !phone) return NextResponse.json({ error: "Enter a name and valid 10-digit Indian mobile number." }, { status: 400 });

    let user;
    try { user = await adminAuth.getUserByPhoneNumber(phone.international); }
    catch { user = await adminAuth.createUser({ displayName: name, phoneNumber: phone.international, email: `crm-${phone.local}@oldbikeshub.com`, password: CALLING_TEAM_LOGIN_CODE }); }
    await adminAuth.updateUser(user.uid, { displayName: name, password: CALLING_TEAM_LOGIN_CODE });
    await adminAuth.setCustomUserClaims(user.uid, { ...(user.customClaims || {}), crmAgent: true });
    await adminDb.collection("crmUsers").doc(user.uid).set({ uid: user.uid, name, email: "", phone: phone.local, active: true, createdAt: FieldValue.serverTimestamp(), updatedAt: FieldValue.serverTimestamp() }, { merge: true });
    return NextResponse.json({ uid: user.uid, name, phone: phone.local });
  } catch (error) {
    console.error("CRM caller creation failed", error);
    return NextResponse.json({ error: error instanceof Error ? error.message : "Caller could not be added." }, { status: 500 });
  }
}
