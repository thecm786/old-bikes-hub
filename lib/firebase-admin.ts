import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

function credentials() {
  const configured = process.env.FIREBASE_SERVICE_ACCOUNT;
  if (configured) return JSON.parse(configured);
  // Keep the production credential in an environment variable. The second
  // local filename supports the existing private development file as well.
  const localPaths = ["service-account.json", "service-account.json.json"];
  for (const filename of localPaths) {
    const localPath = join(process.cwd(), filename);
    if (existsSync(localPath)) return JSON.parse(readFileSync(localPath, "utf8"));
  }
  throw new Error("Firebase admin credentials are not configured.");
}

const adminApp = getApps()[0] ?? initializeApp({ credential: cert(credentials()) });
export const adminAuth = getAuth(adminApp);
export const adminDb = getFirestore(adminApp);
