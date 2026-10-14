import { normalizeBikeBrand } from "./bikeBrands";

type BikeForCollection = {
  brand: string;
  price: string | number;
  status: string;
};

type UsedBikeCollection = {
  title: string;
  brand?: string;
  maxPrice?: number;
};

export const usedBikeCollections = {
  "royal-enfield": { brand: "Royal Enfield", title: "Used Royal Enfield Bikes for Sale in Bihar" },
  tvs: { brand: "TVS", title: "Used TVS Bikes for Sale in Bihar" },
  hero: { brand: "Hero", title: "Used Hero Bikes for Sale in Bihar" },
  yamaha: { brand: "Yamaha", title: "Used Yamaha Bikes for Sale in Bihar" },
  honda: { brand: "Honda", title: "Used Honda Bikes for Sale in Bihar" },
  bajaj: { brand: "Bajaj", title: "Used Bajaj Bikes for Sale in Bihar" },
  "bikes-under-50000": { maxPrice: 50000, title: "Used Bikes Under ₹50,000 in Bihar" },
  "bikes-under-100000": { maxPrice: 100000, title: "Used Bikes Under ₹1 Lakh in Bihar" },
} as const satisfies Record<string, UsedBikeCollection>;

export type UsedBikeCollectionSlug = keyof typeof usedBikeCollections;

export const usedBikeCollectionSlugs = Object.keys(usedBikeCollections) as UsedBikeCollectionSlug[];

export function getUsedBikeCollection(slug: string) {
  return usedBikeCollections[slug as UsedBikeCollectionSlug];
}

function priceNumber(value: string | number) {
  return Number(String(value).replace(/[^\d.]/g, ""));
}

export function matchesUsedBikeCollection(bike: BikeForCollection, collection: UsedBikeCollection) {
  if (bike.status !== "Available") return false;
  if (collection.brand) return normalizeBikeBrand(bike.brand) === collection.brand;

  const maxPrice = collection.maxPrice;
  return maxPrice !== undefined && priceNumber(bike.price) > 0 && priceNumber(bike.price) <= maxPrice;
}

/** Sends high-intent brand links to their content-rich, canonical collection when one exists. */
export function usedBikeBrandCollectionPath(brand: string) {
  const normalizedBrand = normalizeBikeBrand(brand);
  const matchedCollection = usedBikeCollectionSlugs.find((slug) => {
    const collection: UsedBikeCollection = usedBikeCollections[slug];
    return collection.brand === normalizedBrand;
  });

  return matchedCollection
    ? `/used-bikes-bihar/${matchedCollection}`
    : normalizedBrand
      ? `/buy-bikes?brand=${encodeURIComponent(normalizedBrand)}`
      : "/buy-bikes";
}
