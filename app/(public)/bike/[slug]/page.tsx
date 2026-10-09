import { notFound, permanentRedirect } from "next/navigation";
import BikeDetailsClient from "./BikeDetailsClient";
import { getPublicInventory } from "@/lib/publicInventory";
import { bikePath, resolveListing } from "@/lib/bikeUrls";
import { pageMetadata, jsonLd, SITE_URL } from "@/lib/seo";
import { bikeFullName } from "@/lib/bikeDisplay";
import { bikeListingSummary } from "@/lib/bikeListingSummary";

type Props = { params: Promise<{ slug: string }> };
export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const bike = resolveListing(await getPublicInventory(), slug);
  if (!bike) return { title: "Bike not found", robots: { index: false } };
  return pageMetadata(
    `${bike.year} ${bikeFullName(bike.brand, bike.name)} | Used Bike in Bihar`,
    `${bikeFullName(bike.brand, bike.name)}, ${bike.year}, ${bike.km} km. Listed in ${bike.location || "Bihar"}. Buyers from all Bihar cities can enquire. Confirm price, availability and inspection.`,
    bikePath(bike), bike.images[0] || bike.image || "/icon.png"
  );
}

export default async function BikePage({ params }: Props) {
  const { slug } = await params;
  const inventory = await getPublicInventory();
  const bike = resolveListing(inventory, slug);
  if (!bike) notFound();
  const path = bikePath(bike);
  if (decodeURIComponent(path.slice(6)) !== slug) permanentRedirect(path);
  const price = Number(String(bike.price).replace(/[^\d.]/g, ""));
  const product = {
    "@context": "https://schema.org", "@type": "Product",
    name: `${bikeFullName(bike.brand, bike.name)} ${bike.year}`, sku: bike.id,
    description: bike.description || bikeListingSummary(bike),
    image: bike.images.length ? bike.images : bike.image ? [bike.image] : undefined,
    brand: { "@type": "Brand", name: bike.brand },
    ...(price > 0 ? { offers: {
      "@type": "Offer", url: SITE_URL + path, priceCurrency: "INR", price,
      itemCondition: "https://schema.org/UsedCondition",
      availability: bike.status === "Sold" ? "https://schema.org/SoldOut" : bike.status === "Available" ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      seller: { "@type": "Organization", name: "Old Bikes Hub" },
    } } : {}),
  };
  const relatedBikes = inventory.filter((listing) => listing.status === "Available" && listing.id !== bike.id && listing.brand.trim().toLowerCase() === bike.brand.trim().toLowerCase()).slice(0, 6);
  return <><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(product) }} /><BikeDetailsClient key={bike.id} bike={bike} relatedBikes={relatedBikes} /></>;
}
