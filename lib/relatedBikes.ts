import { normalizeBikeBrand } from "@/lib/bikeBrands";
import type { PublicBike } from "@/lib/publicInventory";

export type RelatedBike = Pick<
  PublicBike,
  "id" | "slug" | "name" | "brand" | "price" | "year" | "km" | "location"
> & {
  image: string;
};

function normaliseLocation(location: string) {
  return location.trim().replace(/\s+/g, " ").toLocaleLowerCase("en-IN");
}

export function isAvailableForSale(bike: Pick<PublicBike, "status">) {
  return bike.status.trim().toLocaleLowerCase("en-IN") === "available";
}

export function isIndexableListing(
  bike: Pick<PublicBike, "status" | "price" | "year" | "km" | "location" | "image" | "images">
) {
  const price = Number(String(bike.price).replace(/[^\d.]/g, ""));
  return (
    isAvailableForSale(bike) &&
    price > 0 &&
    Boolean(bike.year.trim()) &&
    Boolean(bike.km.trim()) &&
    Boolean(bike.location.trim()) &&
    Boolean(bike.images[0] || bike.image)
  );
}

export function getRelatedBikes(
  currentBike: PublicBike,
  inventory: PublicBike[],
  limit = 3
): RelatedBike[] {
  const brand = normalizeBikeBrand(currentBike.brand);
  const location = normaliseLocation(currentBike.location);

  return inventory
    .filter(
      (bike) =>
        bike.id !== currentBike.id &&
        isAvailableForSale(bike) &&
        normalizeBikeBrand(bike.brand) === brand
    )
    .sort((left, right) => {
      const locationDifference = Number(normaliseLocation(right.location) === location) - Number(normaliseLocation(left.location) === location);
      if (locationDifference !== 0) return locationDifference;

      return (right.createdAt || right.updatedAt || "").localeCompare(left.createdAt || left.updatedAt || "");
    })
    .slice(0, limit)
    .map((bike) => ({
      id: bike.id,
      slug: bike.slug,
      name: bike.name,
      brand: bike.brand,
      price: bike.price,
      year: bike.year,
      km: bike.km,
      location: bike.location,
      image: bike.images[0] || bike.image,
    }));
}
