const { cert, initializeApp } = require("firebase-admin/app");
const { getAuth } = require("firebase-admin/auth");
const serviceAccount = require("../service-account.json");

const uid = process.argv[2];

if (!uid) {
  throw new Error("UID missing. Run: node scripts/make-admin.cjs YOUR_UID");
}

initializeApp({
  credential: cert(serviceAccount),
});

getAuth().setCustomUserClaims(uid, { admin: true })
  .then(() => console.log("Admin access enabled successfully."))
  .catch((error) => {
    console.error("Could not set the admin claim:", error);
    process.exitCode = 1;
  });
