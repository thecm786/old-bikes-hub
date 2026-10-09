import { bikeFullName } from "@/lib/bikeDisplay";

type ListingDetails = {
  brand: string;
  name: string;
  year: string;
  km: string;
  location?: string;
  price: string | number;
};

export function bikeListingSummary(bike: ListingDetails) {
  const amount = Number(String(bike.price).replace(/[^\d.]/g, ""));
  const price = amount > 0 ? `₹${amount.toLocaleString("en-IN")}` : "price on enquiry";
  const location = bike.location?.trim() || "Bihar";

  return `Used ${bikeFullName(bike.brand, bike.name)}, ${bike.year}, with ${bike.km} km. Listed at ${price} in ${location}. Contact Old Bikes Hub to confirm availability, inspection and documents before purchase.`;
}
