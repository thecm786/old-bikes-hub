import { cache } from "react";

type Value = { stringValue?: string; integerValue?: string; doubleValue?: number; booleanValue?: boolean; timestampValue?: string; arrayValue?: { values?: Value[] } };
type Document = { name: string; fields?: Record<string, Value>; updateTime?: string };
export type PublicBike = {
  id: string; slug: string; name: string; brand: string; price: string | number;
  year: string; km: string; location: string; owner: string; description: string;
  images: string[]; image: string; status: string; verified: boolean; featured: boolean;
  updatedAt?: string; createdAt: string;
};

// Uses public Firestore read rules; no admin credentials or private collections.
export const getPublicInventory = cache(async (): Promise<PublicBike[]> => {
  const bikes: PublicBike[] = [];
  let token = "";
  do {
    const url = new URL("https://firestore.googleapis.com/v1/projects/old-bikes-hub/databases/(default)/documents/bikes");
    url.searchParams.set("pageSize", "300");
    if (token) url.searchParams.set("pageToken", token);
    const response = await fetch(url, { next: { revalidate: 300 }, signal: AbortSignal.timeout(15000) });
    if (!response.ok) throw new Error(`Public inventory unavailable (${response.status})`);
    const page: { documents?: Document[]; nextPageToken?: string } = await response.json();
    for (const doc of page.documents ?? []) {
      const f = doc.fields ?? {};
      const text = (key: string) => f[key]?.stringValue ?? f[key]?.integerValue ?? "";
      const id = doc.name.split("/").at(-1)!;
      if (!text("name") || !text("slug")) continue;
      bikes.push({
        id, slug: text("slug"), name: text("name"), brand: text("brand"),
        price: f.price?.doubleValue ?? text("price"), year: text("year"), km: text("km"),
        location: text("location"), owner: text("owner"), description: text("description"),
        image: text("image"), images: (f.images?.arrayValue?.values ?? []).map(v => v.stringValue ?? "").filter(Boolean),
        status: text("status") || "Available", verified: f.verified?.booleanValue ?? false,
        featured: f.featured?.booleanValue ?? false, updatedAt: doc.updateTime,
        createdAt: f.createdAt?.timestampValue ?? "",
      });
    }
    token = page.nextPageToken ?? "";
  } while (token);
  return bikes.sort((a, b) => b.createdAt.localeCompare(a.createdAt) || b.id.localeCompare(a.id));
});
