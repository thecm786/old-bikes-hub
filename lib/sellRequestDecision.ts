import {
  collection, doc, runTransaction, serverTimestamp,
  type DocumentReference, type FieldValue, type Firestore, type Transaction,
} from "firebase/firestore";

type Decision = "Approved" | "Rejected";

// Keep the read and both writes in one transaction so retries and concurrent
// admins cannot create a second listing or leave a half-approved request.
export async function applySellRequestDecision(
  transaction: Pick<Transaction, "get" | "set" | "update">,
  requestRef: DocumentReference,
  listingRef: DocumentReference,
  decision: Decision,
  createdAt: FieldValue,
) {
  const snapshot = await transaction.get(requestRef);
  if (!snapshot.exists()) throw new Error("This sell request no longer exists.");
  const request = snapshot.data();
  if (request.status === decision) return decision;
  if (request.status !== "Pending") throw new Error("This request has already been processed. Refresh the page.");

  if (decision === "Approved") {
    const text = (key: string) => String(request[key] ?? "");
    const images = Array.isArray(request.images)
      ? request.images.filter((image): image is string => typeof image === "string" && image.length > 0)
      : [];
    transaction.set(listingRef, {
      name: `${text("brand")} ${text("model")}`.trim(),
      brand: text("brand"),
      slug: `${text("brand")}-${text("model")}-${requestRef.id}`.toLowerCase().replace(/\s+/g, "-"),
      price: request.price ?? "", year: text("year"), km: text("km"),
      location: text("location"), owner: text("name"), phone: text("mobile"),
      image: images[0] || "", images, description: text("description"),
      featured: false, verified: true, status: "Available", createdAt,
    });
    transaction.update(requestRef, { status: decision, listingId: listingRef.id });
  } else {
    transaction.update(requestRef, { status: decision });
  }
  return decision;
}

export function decideSellRequest(db: Firestore, requestId: string, decision: Decision) {
  const requestRef = doc(db, "sellRequests", requestId);
  const listingRef = doc(collection(db, "bikes"));
  return runTransaction(db, (transaction) =>
    applySellRequestDecision(transaction, requestRef, listingRef, decision, serverTimestamp()));
}
