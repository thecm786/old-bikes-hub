import assert from "node:assert/strict";
import { test } from "node:test";
import { applySellRequestDecision } from "../lib/sellRequestDecision.ts";

const requestRef = { id: "request-123" };
const listingRef = { id: "listing-456" };
const timestamp = { testServerTimestamp: true };

function fixture(initial) {
  let request = initial;
  const writes = [];
  return {
    writes,
    transaction: {
      async get(ref) {
        assert.equal(ref, requestRef);
        return { exists: () => request !== undefined, data: () => request };
      },
      set(ref, data) { writes.push({ kind: "set", ref, data }); },
      update(ref, data) {
        assert.equal(ref, requestRef);
        writes.push({ kind: "update", ref, data });
        request = { ...request, ...data };
      },
    },
  };
}

test("approval stages the listing and request status in the same transaction", async () => {
  const { transaction, writes } = fixture({ status: "Pending", brand: "Honda", model: "Shine", mobile: "9876543210", price: "75000", images: ["https://legacy.example/bike.jpg"] });
  assert.equal(await applySellRequestDecision(transaction, requestRef, listingRef, "Approved", timestamp), "Approved");
  assert.equal(writes.length, 2);
  assert.equal(writes[0].ref, listingRef);
  assert.equal(writes[0].data.createdAt, timestamp);
  assert.equal(writes[0].data.slug, "honda-shine-request-123");
  assert.deepEqual(writes[0].data.images, ["https://legacy.example/bike.jpg"]);
  assert.deepEqual(writes[1].data, { status: "Approved", listingId: "listing-456" });
});

test("a retried approval observes the processed request and creates no duplicate", async () => {
  const { transaction, writes } = fixture({ status: "Pending", brand: "Honda", model: "Shine" });
  await applySellRequestDecision(transaction, requestRef, listingRef, "Approved", timestamp);
  await applySellRequestDecision(transaction, requestRef, { id: "another-listing" }, "Approved", timestamp);
  assert.equal(writes.filter((write) => write.kind === "set").length, 1);
  assert.equal(writes.length, 2);
});

test("old approved requests without a listingId stay untouched", async () => {
  const { transaction, writes } = fixture({ status: "Approved" });
  await applySellRequestDecision(transaction, requestRef, listingRef, "Approved", timestamp);
  assert.equal(writes.length, 0);
});

test("rejecting a pending request does not create a listing", async () => {
  const { transaction, writes } = fixture({ status: "Pending" });
  await applySellRequestDecision(transaction, requestRef, listingRef, "Rejected", timestamp);
  assert.deepEqual(writes, [{ kind: "update", ref: requestRef, data: { status: "Rejected" } }]);
});

test("a stale approve or reject action cannot reverse a completed decision", async () => {
  for (const [status, decision] of [["Rejected", "Approved"], ["Approved", "Rejected"]]) {
    const { transaction, writes } = fixture({ status });
    await assert.rejects(applySellRequestDecision(transaction, requestRef, listingRef, decision, timestamp), /already been processed/);
    assert.equal(writes.length, 0);
  }
});

test("missing requests and read failures do not stage writes", async () => {
  const { transaction, writes } = fixture(undefined);
  await assert.rejects(applySellRequestDecision(transaction, requestRef, listingRef, "Approved", timestamp), /no longer exists/);
  transaction.get = async () => { throw new Error("permission-denied"); };
  await assert.rejects(applySellRequestDecision(transaction, requestRef, listingRef, "Approved", timestamp), /permission-denied/);
  assert.equal(writes.length, 0);
});
