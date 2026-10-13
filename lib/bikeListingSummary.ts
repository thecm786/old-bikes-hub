import { bikeFullName } from "@/lib/bikeDisplay";

type ListingDetails = {
  brand: string;
  name: string;
  year: string;
  km: string;
  location?: string;
  price: string | number;
  description?: string;
};

function priceLabel(bike: ListingDetails) {
  const amount = Number(String(bike.price).replace(/[^\d.]/g, ""));
  return amount > 0 ? `₹${amount.toLocaleString("en-IN")}` : "price on enquiry";
}

export function bikeListingFacts(bike: ListingDetails) {
  const name = bikeFullName(bike.brand, bike.name);
  const year = bike.year ? ` ${bike.year}` : "";
  const kilometres = bike.km ? ` with ${bike.km} km` : "";
  const location = bike.location?.trim() || "Bihar";
  return `Used ${name}${year}, listed for ${priceLabel(bike)}${kilometres} in ${location}.`;
}

export function bikeListingSummary(bike: ListingDetails) {
  return `${bikeListingFacts(bike)} Contact Old Bikes Hub to confirm availability, inspection and documents before purchase.`;
}

export function bikeListingContent(bike: ListingDetails) {
  const facts = bikeListingFacts(bike);
  const description = bike.description?.trim();
  if (!description || description.toLocaleLowerCase("en-IN") === facts.toLocaleLowerCase("en-IN")) {
    return bikeListingSummary(bike);
  }
  return `${facts}\n\n${description}`;
}
