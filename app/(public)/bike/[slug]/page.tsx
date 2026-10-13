import { notFound, permanentRedirect } from "next/navigation";
import RelatedBikes from "@/components/RelatedBikes";
import BikeDetailsClient from "./BikeDetailsClient";
import { getPublicBikeById, getPublicInventory, type PublicBike } from "@/lib/publicInventory";
import { bikePath, listingIdFromKey, resolveListing } from "@/lib/bikeUrls";
import { pageMetadata, jsonLd, SITE_URL } from "@/lib/seo";
import { bikeFullName } from "@/lib/bikeDisplay";
import { bikeListingContent, bikeListingFacts } from "@/lib/bikeListingSummary";
import { normalizeBikeBrand } from "@/lib/bikeBrands";
import { getRelatedBikes, isIndexableListing } from "@/lib/relatedBikes";

type Props = { params: Promise<{ slug: string }> };
export const revalidate = 3600;

async function loadBike(slug: string) {
  const id = listingIdFromKey(slug);
  if (id) return getPublicBikeById(id);
  return resolveListing(await getPublicInventory(), slug);
}

function priceLabel(bike: PublicBike) {
  const price = Number(String(bike.price).replace(/[^\d.]/g, ""));
  return price > 0 ? `₹${price.toLocaleString("en-IN")}` : "price on enquiry";
}

function listingLocation(bike: PublicBike) {
  return bike.location.trim() || "Bihar";
}

function listingTitle(bike: PublicBike) {
  const name = bikeFullName(bike.brand, bike.name);
  const year = bike.year ? `${bike.year} ` : "";
  const kilometres = bike.km ? ` – ${bike.km} km` : "";
  return `Used ${year}${name}${kilometres} – ${priceLabel(bike)} in ${listingLocation(bike)} | Old Bikes Hub`;
}

function listingDescription(bike: PublicBike) {
  return `${bikeListingFacts(bike)} See photos and contact Old Bikes Hub to confirm availability, documents and inspection.`;
}

function offerAvailability(status: string) {
  const value = status.trim().toLocaleLowerCase("en-IN");
  if (value === "available") return "https://schema.org/InStock";
  if (value === "sold") return "https://schema.org/SoldOut";
  return "https://schema.org/OutOfStock";
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const bike = await loadBike(slug);
  if (!bike) return { title: "Bike not found", robots: { index: false } };
  const metadata = pageMetadata(listingTitle(bike), listingDescription(bike), bikePath(bike), bike.images[0] || bike.image || "/icon.png");
  return isIndexableListing(bike)
    ? metadata
    : { ...metadata, robots: { index: false, follow: true } };
}

export default async function BikePage({ params }: Props) {
  const { slug } = await params;
  const [bike, inventory] = await Promise.all([loadBike(slug), getPublicInventory()]);
  if (!bike) notFound();
  const path = bikePath(bike);
  if (decodeURIComponent(path.slice(6)) !== slug) permanentRedirect(path);
  const price = Number(String(bike.price).replace(/[^\d.]/g, ""));
  const relatedBikes = getRelatedBikes(bike, inventory);
  const brand = normalizeBikeBrand(bike.brand);
  const product = {
    "@type": "Product",
    "@id": `${SITE_URL}${path}#product`,
    name: `${bikeFullName(bike.brand, bike.name)}${bike.year ? ` ${bike.year}` : ""}`, sku: bike.id,
    url: `${SITE_URL}${path}`,
    description: bikeListingContent(bike),
    image: Array.from(new Set([...bike.images, bike.image].filter(Boolean))),
    category: "Used motorcycle",
    brand: { "@type": "Brand", name: normalizeBikeBrand(bike.brand) },
    ...(price > 0 ? { offers: {
      "@type": "Offer", url: SITE_URL + path, priceCurrency: "INR", price,
      itemCondition: "https://schema.org/UsedCondition",
      availability: offerAvailability(bike.status),
      seller: { "@type": "Organization", name: "Old Bikes Hub" },
    } } : {}),
    additionalProperty: [
      bike.year && { "@type": "PropertyValue", name: "Model year", value: bike.year },
      bike.km && { "@type": "PropertyValue", name: "Kilometres driven", value: bike.km },
      bike.location && { "@type": "PropertyValue", name: "Location", value: bike.location },
    ].filter(Boolean),
  };
  const breadcrumbs = {
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Buy Used Bikes", item: `${SITE_URL}/buy-bikes` },
      { "@type": "ListItem", position: 3, name: bikeFullName(bike.brand, bike.name), item: `${SITE_URL}${path}` },
    ],
  };
  const schema = { "@context": "https://schema.org", "@graph": [product, breadcrumbs] };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(schema) }} />
      <BikeDetailsClient key={bike.id} bike={bike}>
        <RelatedBikes
          bikes={relatedBikes}
          heading={relatedBikes.length > 0 ? `More available used ${brand} bikes` : "Explore more available used bikes"}
        />
      </BikeDetailsClient>
    </>
  );
}
