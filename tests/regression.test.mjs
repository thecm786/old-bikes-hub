import assert from "node:assert/strict";
import { test } from "node:test";
import { publicSiteSettings, resolveSiteConfig, siteConfig } from "../lib/siteConfig.ts";
import { validateSellRequest } from "../lib/sellRequest.ts";
import { MAX_IMAGE_BYTES, validateImageFiles, uploadCloudinaryImage } from "../lib/cloudinary.ts";

const form = { name: "Buyer", mobile: "9876543210", brand: "Honda", model: "Shine", year: "2022", km: "12000", price: "75000", location: "Patna", description: "Good condition" };
const imageUrl = "https://res.cloudinary.com/w4eee6vd/image/upload/v1/bike.jpg";
const file = new File(["photo"], "bike.jpg", { type: "image/jpeg" });

test("public settings exclude admin data and honor saved contact values", () => {
  const published = publicSiteSettings({ adminName: "Private", adminEmail: "private@example.com", websiteName: " New Name ", phone: "+919876543210", whatsapp: "+91 98765 43210", email: "shop@example.com", city: "Patna", state: "Bihar" });
  assert.equal("adminName" in published, false);
  assert.equal("adminEmail" in published, false);
  assert.deepEqual(Object.keys(published).sort(), ["websiteName", "websiteDescription", "phone", "whatsapp", "email", "address", "city", "state"].sort());
  const resolved = resolveSiteConfig(published);
  assert.equal(resolved.name, "New Name");
  assert.equal(resolved.whatsapp, "919876543210");
  assert.equal(resolved.email, "shop@example.com");
  assert.equal(resolved.location, "Patna, Bihar");
});

test("missing or malformed settings retain usable defaults", () => {
  assert.deepEqual(resolveSiteConfig(), siteConfig);
  assert.equal(resolveSiteConfig({ phone: 123, email: " " }).phone, siteConfig.phone);
  assert.equal(resolveSiteConfig({ email: " " }).email, siteConfig.email);
});

test("valid sell requests and optional fields are accepted", () => {
  assert.equal(validateSellRequest(form, [imageUrl], 2026), null);
  assert.equal(validateSellRequest({ ...form, year: "", price: "", km: "" }, [], 2026), null);
});

test("invalid phone, future year, negative values and excessive text are rejected", () => {
  for (const invalid of [{ name: "   " }, { mobile: "abc" }, { mobile: "12345" }, { year: "2028" }, { year: "1899" }, { km: "-1" }, { price: "1e9" }, { brand: "" }, { model: "" }, { location: "x".repeat(151) }, { description: "x".repeat(3001) }]) {
    assert.ok(validateSellRequest({ ...form, ...invalid }, [], 2026), JSON.stringify(invalid));
  }
});

test("invalid images cannot become Firestore request data", () => {
  assert.ok(validateSellRequest(form, [undefined], 2026));
  assert.ok(validateSellRequest(form, ["https://example.com/photo.jpg"], 2026));
  assert.ok(validateSellRequest(form, Array(9).fill(imageUrl), 2026));
});

test("upload limits reject unsafe types, empty, large and excessive files", () => {
  assert.doesNotThrow(() => validateImageFiles([file], 7));
  assert.throws(() => validateImageFiles([file], 8));
  assert.throws(() => validateImageFiles([new File(["<svg/>"], "x.svg", { type: "image/svg+xml" })]));
  assert.throws(() => validateImageFiles([new File([], "x.jpg", { type: "image/jpeg" })]));
  assert.throws(() => validateImageFiles([new File([new Uint8Array(MAX_IMAGE_BYTES + 1)], "x.jpg", { type: "image/jpeg" })]));
});

test("uploads reject HTTP failures, malformed responses and missing URLs", async (t) => {
  for (const [status, body] of [[400, { secure_url: imageUrl }], [200, {}], [200, { secure_url: 123 }], [200, { secure_url: "https://example.com/image.jpg" }]]) {
    t.mock.method(globalThis, "fetch", async () => new Response(JSON.stringify(body), { status }));
    await assert.rejects(uploadCloudinaryImage(file), /upload failed/);
    t.mock.restoreAll();
  }
  t.mock.method(globalThis, "fetch", async () => new Response("not json", { status: 502 }));
  await assert.rejects(uploadCloudinaryImage(file));
});

test("successful uploads return only the validated image URL", async (t) => {
  t.mock.method(globalThis, "fetch", async (_url, options) => {
    assert.equal(options.method, "POST");
    assert.equal(options.body.get("upload_preset"), "old-bikes-hub");
    return new Response(JSON.stringify({ secure_url: imageUrl }));
  });
  assert.equal(await uploadCloudinaryImage(file), imageUrl);
});
