const { cert, initializeApp } = require("firebase-admin/app");
const { getAuth } = require("firebase-admin/auth");
const { getFirestore, FieldValue } = require("firebase-admin/firestore");
const serviceAccount = require("../service-account.json");

const uid = process.argv[2];

if (!uid) {
  throw new Error("UID missing. Run: node scripts/make-crm-agent.cjs YOUR_UID");
}

initializeApp({ credential: cert(serviceAccount) });

async function enableCrmAgent() {
  const user = await getAuth().getUser(uid);
  await getAuth().setCustomUserClaims(uid, {
    ...(user.customClaims || {}),
    crmAgent: true,
  });
  await getFirestore().collection("crmUsers").doc(uid).set({
    uid,
    name: user.displayName || user.email || "Calling team",
    email: user.email || "",
    active: true,
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
  }, { merge: true });
  console.log("CRM access enabled successfully. Ask the team member to sign out and sign in again.");
}

enableCrmAgent().catch((error) => {
  console.error("Could not enable CRM access:", error);
  process.exitCode = 1;
});
