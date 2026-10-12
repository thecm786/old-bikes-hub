import { cache } from "react";

type Value = { stringValue?: string; integerValue?: string; doubleValue?: number; booleanValue?: boolean; timestampValue?: string; arrayValue?: { values?: Value[] } };
type Document = { name: string; fields?: Record<string, Value>; updateTime?: string };
export type PublicBike = {
  id: string; slug: string; name: string; brand: string; price: string | number;
  year: string; km: string; location: string; owner: string; description: string;
  images: string[]; image: string; status: string; verified: boolean; featured: boolean;
  updatedAt?: string; createdAt: string;
};

function toPublicBike(doc: Document): PublicBike | undefined {
  const f = doc.fields ?? {};
  const text = (key: string) => f[key]?.stringValue ?? f[key]?.integerValue ?? "";
  const id = doc.name.split("/").at(-1);
  if (!id || !text("name") || !text("slug")) return undefined;

  return {
    id, slug: text("slug"), name: text("name"), brand: text("brand"),
    price: f.price?.doubleValue ?? text("price"), year: text("year"), km: text("km"),
    location: text("location"), owner: text("owner"), description: text("description"),
    image: text("image"), images: (f.images?.arrayValue?.values ?? []).map(value => value.stringValue ?? "").filter(Boolean),
    status: text("status") || "Available", verified: f.verified?.booleanValue ?? false,
    featured: f.featured?.booleanValue ?? false, updatedAt: doc.updateTime,
    createdAt: f.createdAt?.timestampValue ?? "",
  };
}

// Detail pages load one public document instead of reading the whole inventory.
export const getPublicBikeById = cache(async (id: string): Promise<PublicBike | undefined> => {
  if (!/^[A-Za-z0-9_-]{10,}$/.test(id)) return undefined;
  const url = `https://firestore.googleapis.com/v1/projects/old-bikes-hub/databases/(default)/documents/bikes/${encodeURIComponent(id)}`;
  try {
    const response = await fetch(url, { next: { revalidate: 3600 }, signal: AbortSignal.timeout(15000) });
    if (!response.ok) return undefined;
    return toPublicBike(await response.json() as Document);
  } catch {
    return undefined;
  }
});

// Uses public Firestore read rules; no admin credentials or private collections.
export const getPublicInventory = cache(async (): Promise<PublicBike[]> => {
  const bikes: PublicBike[] = [];
  let token = "";
  do {
    const url = new URL("https://firestore.googleapis.com/v1/projects/old-bikes-hub/databases/(default)/documents/bikes");
    url.searchParams.set("pageSize", "300");
    if (token) url.searchParams.set("pageToken", token);
    let response: Response;
    try {
      response = await fetch(url, { next: { revalidate: 3600 }, signal: AbortSignal.timeout(15000) });
    } catch {
      return bikes;
    }
    if (!response.ok) return bikes;
    const page: { documents?: Document[]; nextPageToken?: string } = await response.json();
    for (const doc of page.documents ?? []) {
      const bike = toPublicBike(doc);
      if (bike) bikes.push(bike);
    }
    token = page.nextPageToken ?? "";
  } while (token);
  return bikes.sort((a, b) => b.createdAt.localeCompare(a.createdAt) || b.id.localeCompare(a.id));
});
