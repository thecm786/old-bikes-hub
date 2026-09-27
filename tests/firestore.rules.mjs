import assert from "node:assert/strict";
import { before, beforeEach, after, test } from "node:test";
import { readFile } from "node:fs/promises";
import { initializeTestEnvironment, assertFails, assertSucceeds } from "@firebase/rules-unit-testing";
import { collection, doc, getDoc, getDocs, setDoc, updateDoc, writeBatch, serverTimestamp, setLogLevel } from "firebase/firestore";
import { decideSellRequest } from "../lib/sellRequestDecision.ts";

// This suite can only use the local emulator and a demo project.
const projectId = "demo-old-bikes-hub";
let environment;
setLogLevel("silent");
before(async () => {
  environment = await initializeTestEnvironment({ projectId,
    firestore: { host: "127.0.0.1", port: 8080, rules: await readFile(new URL("../firestore.rules", import.meta.url), "utf8") },
  });
});
beforeEach(async () => environment.clearFirestore());
after(async () => environment?.cleanup());
const guest = () => environment.unauthenticatedContext().firestore();
const member = () => environment.authenticatedContext("member").firestore();
const admin = () => environment.authenticatedContext("admin", { admin: true }).firestore();
const photo = "https://res.cloudinary.com/w4eee6vd/image/upload/v1/photo.jpg";
const request = () => ({ name: "Test User", mobile: "9876543210", brand: "Honda", model: "Shine", year: "2022", km: "12000", price: "75000", location: "Patna", description: "Good condition", images: [photo], status: "Pending", createdAt: serverTimestamp() });
const publicSettings = { websiteName: "Test Shop", websiteDescription: "Used bikes", phone: "9876543210", whatsapp: "919876543210", email: "shop@example.com", address: "Test address", city: "Patna", state: "Bihar" };

test("visitors can browse listings/public settings but cannot read private records", async () => {
  const db = guest();
  await assertSucceeds(getDocs(collection(db, "bikes")));
  await assertSucceeds(getDoc(doc(db, "publicSettings", "site")));
  for (const path of ["settings/site", "sellRequests/request", "contactMessages/message", "unknown/document"]) {
    await assertFails(getDoc(doc(db, path)));
  }
});

test("members cannot change listings or settings; admins can", async () => {
  for (const db of [guest(), member()]) {
    await assertFails(setDoc(doc(db, "bikes", "bike"), { name: "Unauthorized" }));
    await assertFails(setDoc(doc(db, "settings", "site"), { adminEmail: "private@example.com" }));
    await assertFails(setDoc(doc(db, "publicSettings", "site"), publicSettings));
  }
  await assertSucceeds(setDoc(doc(admin(), "bikes", "bike"), { name: "Authorized" }));
});

test("admin settings and the public allowlist save atomically without leaking admin fields", async () => {
  const db = admin();
  const batch = writeBatch(db);
  batch.set(doc(db, "settings", "site"), { ...publicSettings, adminEmail: "private@example.com" });
  batch.set(doc(db, "publicSettings", "site"), publicSettings);
  await assertSucceeds(batch.commit());
  await assertSucceeds(getDoc(doc(db, "settings", "site")));
  const visible = await getDoc(doc(guest(), "publicSettings", "site"));
  assert.equal(visible.data().adminEmail, undefined);
  await assertFails(setDoc(doc(db, "publicSettings", "site"), { ...publicSettings, adminEmail: "private@example.com" }));
});

test("valid anonymous requests accept zero or eight photos and optional numbers", async () => {
  const db = guest();
  await assertSucceeds(setDoc(doc(db, "sellRequests", "normal"), request()));
  await assertSucceeds(setDoc(doc(db, "sellRequests", "optional"), { ...request(), year: "", km: "", price: "", images: [] }));
  await assertSucceeds(setDoc(doc(db, "sellRequests", "eight"), { ...request(), images: Array(8).fill(photo) }));
});

test("malformed or forged anonymous requests are rejected", async () => {
  const invalid = [{ name: "   " }, { name: "\t" }, { mobile: "123" }, { year: "1800" },
    { year: String(new Date().getFullYear() + 2) }, { km: "-1" }, { price: "1e9" },
    { images: ["https://example.com/photo.jpg"] }, { images: [123] }, { images: Array(9).fill(photo) },
    { status: "Approved" }, { createdAt: new Date(0) }, { injected: "extra" }, { description: "x".repeat(3001) }];
  for (const [index, change] of invalid.entries()) {
    await assertFails(setDoc(doc(guest(), "sellRequests", `invalid-${index}`), { ...request(), ...change }));
  }
  const missing = request(); delete missing.mobile;
  await assertFails(setDoc(doc(guest(), "sellRequests", "missing"), missing));
});

test("public users cannot update or list submitted requests", async () => {
  await setDoc(doc(guest(), "sellRequests", "request"), request());
  await assertFails(updateDoc(doc(guest(), "sellRequests", "request"), { status: "Approved" }));
  await assertFails(getDocs(collection(member(), "sellRequests")));
  await assertSucceeds(getDocs(collection(admin(), "sellRequests")));
});

test("contact submissions validate fields and remain private", async () => {
  const message = { name: "Test", email: "test@example.com", phone: "", subject: "Bike", message: "Availability?", status: "New", createdAt: serverTimestamp() };
  await assertSucceeds(setDoc(doc(guest(), "contactMessages", "valid"), message));
  for (const [index, change] of [{ email: "bad" }, { phone: "123" }, { status: "Read" }, { message: "" }, { extra: true }].entries()) {
    await assertFails(setDoc(doc(guest(), "contactMessages", `bad-${index}`), { ...message, ...change }));
  }
  await assertFails(getDoc(doc(guest(), "contactMessages", "valid")));
  await assertSucceeds(getDoc(doc(admin(), "contactMessages", "valid")));
});

test("concurrent admin approvals create exactly one listing with the real transaction engine", async () => {
  await setDoc(doc(guest(), "sellRequests", "request"), request());
  const db = admin();
  await Promise.all([decideSellRequest(db, "request", "Approved"), decideSellRequest(db, "request", "Approved")]);
  const listings = await getDocs(collection(db, "bikes"));
  assert.equal(listings.size, 1);
  const saved = await getDoc(doc(db, "sellRequests", "request"));
  assert.equal(saved.data().status, "Approved");
  assert.equal(saved.data().listingId, listings.docs[0].id);
});

test("non-admin approval fails without creating a partial listing", async () => {
  await setDoc(doc(guest(), "sellRequests", "request"), request());
  await assertFails(decideSellRequest(member(), "request", "Approved"));
  assert.equal((await getDocs(collection(admin(), "bikes"))).size, 0);
  assert.equal((await getDoc(doc(admin(), "sellRequests", "request"))).data().status, "Pending");
});
