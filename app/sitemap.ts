import type { MetadataRoute } from "next";
import { getPublicInventory } from "@/lib/publicInventory";
import { bikePath } from "@/lib/bikeUrls";
import { newBikeGuides } from "@/lib/newBikeGuides";
import { biharDistricts, districtSlug } from "@/lib/biharDistricts";
const baseUrl = "https://www.oldbikeshub.com";
const seoCollections = [
  "royal-enfield", "tvs", "hero", "yamaha", "honda", "bajaj",
  "bikes-under-50000", "bikes-under-100000",
];
export const dynamic = "force-dynamic";
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const bikes = await getPublicInventory();
  const pages: MetadataRoute.Sitemap = ["", "/buy-bikes", "/used-bikes-bihar", "/used-bikes-muzaffarpur", "/new-bikes-india", "/blog", "/sell-bike", "/contact"].map(path => ({
    url: `${baseUrl}${path}`,
    changeFrequency: path === "" || path === "/buy-bikes" ? "daily" : "weekly",
    priority: path === "" ? 1 : 0.8,
  }));
  const collectionPages = seoCollections.map(slug => ({
    url: `${baseUrl}/used-bikes-bihar/${slug}`,
    changeFrequency: "daily" as const, priority: 0.75,
  }));
  const blogPages = ["used-bike-buying-checklist-bihar", "best-used-bikes-under-50000-bihar", "used-royal-enfield-classic-350-buying-guide", "used-bike-ownership-transfer-documents-india"].map(slug => ({ url: `${baseUrl}/blog/${slug}`, changeFrequency: "monthly" as const, priority: 0.65 }));
  const newBikePages = newBikeGuides.map(guide => ({ url: `${baseUrl}/new-bikes-india/${guide.slug}`, changeFrequency: "monthly" as const, priority: 0.65 }));
  const districtPages = biharDistricts.map(district => ({ url: `${baseUrl}/used-bikes-bihar/${districtSlug(district)}`, changeFrequency: "weekly" as const, priority: 0.6 }));
  return [...pages, ...collectionPages, ...blogPages, ...newBikePages, ...districtPages, ...bikes.filter(bike => bike.status === "Available").map(bike => ({
    url: baseUrl + bikePath(bike), lastModified: bike.updatedAt,
    changeFrequency: "weekly" as const, priority: 0.7,
  }))];
}
