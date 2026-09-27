import assert from "node:assert/strict";
import test from "node:test";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { Gaxios } = require("gaxios");

test("patched UUID dependency preserves Firebase HTTP multipart requests", async () => {
  let capturedBody;
  let capturedType;
  const client = new Gaxios();
  await client.request({
    url: "https://example.invalid/upload",
    method: "POST",
    multipart: [{ headers: { "Content-Type": "text/plain" }, content: "local-test-payload" }],
    adapter: async (options) => {
      capturedType = options.headers["Content-Type"];
      const chunks = [];
      for await (const chunk of options.body) chunks.push(Buffer.from(chunk));
      capturedBody = Buffer.concat(chunks).toString();
      return { status: 200, statusText: "OK", headers: {}, data: {}, config: options };
    },
  });
  const boundary = capturedType.split("boundary=")[1];
  assert.match(boundary, /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
  assert.ok(capturedBody.includes(`--${boundary}`));
  assert.ok(capturedBody.includes("local-test-payload"));
  assert.ok(capturedBody.includes(`--${boundary}--`));
});
