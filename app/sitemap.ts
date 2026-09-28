import type { MetadataRoute } from "next";
import { getPublicInventory } from "@/lib/publicInventory";
import { bikePath } from "@/lib/bikeUrls";
const baseUrl = "https://www.oldbikeshub.com";
export const dynamic = "force-dynamic";
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const bikes = await getPublicInventory();
  const pages: MetadataRoute.Sitemap = ["", "/buy-bikes", "/used-bikes-bihar", "/sell-bike", "/contact"].map(path => ({
    url: `${baseUrl}${path}`,
    changeFrequency: path === "" || path === "/buy-bikes" ? "daily" : "weekly",
    priority: path === "" ? 1 : 0.8,
  }));
  return [...pages, ...bikes.filter(bike => bike.status === "Available").map(bike => ({
    url: baseUrl + bikePath(bike), lastModified: bike.updatedAt,
    changeFrequency: "weekly" as const, priority: 0.7,
  }))];
}
