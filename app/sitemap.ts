import type { MetadataRoute } from "next";
import { getPublicInventory } from "@/lib/publicInventory";
import { bikePath } from "@/lib/bikeUrls";
const baseUrl = "https://www.oldbikeshub.com";
const seoCollections = [
  "royal-enfield", "tvs", "hero", "yamaha", "honda", "bajaj",
  "bikes-under-50000", "bikes-under-100000",
];
export const dynamic = "force-dynamic";
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const bikes = await getPublicInventory();
  const pages: MetadataRoute.Sitemap = ["", "/buy-bikes", "/used-bikes-bihar", "/sell-bike", "/contact"].map(path => ({
    url: `${baseUrl}${path}`,
    changeFrequency: path === "" || path === "/buy-bikes" ? "daily" : "weekly",
    priority: path === "" ? 1 : 0.8,
  }));
  const collectionPages = seoCollections.map(slug => ({
    url: `${baseUrl}/used-bikes-bihar/${slug}`,
    changeFrequency: "daily" as const, priority: 0.75,
  }));
  return [...pages, ...collectionPages, ...bikes.filter(bike => bike.status === "Available").map(bike => ({
    url: baseUrl + bikePath(bike), lastModified: bike.updatedAt,
    changeFrequency: "weekly" as const, priority: 0.7,
  }))];
}
