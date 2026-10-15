import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

function credentials() {
  const configured = process.env.FIREBASE_SERVICE_ACCOUNT;
  if (configured) return JSON.parse(configured);
  const localPath = join(process.cwd(), "service-account.json");
  if (existsSync(localPath)) return JSON.parse(readFileSync(localPath, "utf8"));
  throw new Error("Firebase admin credentials are not configured.");
}

const adminApp = getApps()[0] ?? initializeApp({ credential: cert(credentials()) });
export const adminAuth = getAuth(adminApp);
export const adminDb = getFirestore(adminApp);