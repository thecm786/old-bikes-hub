import type { MetadataRoute } from "next";
import { getPublicInventory } from "@/lib/publicInventory";
import { bikePath } from "@/lib/bikeUrls";
import { isIndexableListing } from "@/lib/relatedBikes";
import { newBikeGuides } from "@/lib/newBikeGuides";
import { blogPosts } from "@/lib/blogPosts";
import { biharDistricts, districtSlug, locationMatchesDistrict } from "@/lib/biharDistricts";
import { matchesUsedBikeCollection, usedBikeCollectionSlugs, usedBikeCollections } from "@/lib/usedBikeCollections";
const baseUrl = "https://www.oldbikeshub.com";
export const revalidate = 3600;
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const bikes = await getPublicInventory();
  const pages: MetadataRoute.Sitemap = ["", "/buy-bikes", "/used-bikes-bihar", "/used-bikes-muzaffarpur", "/used-royal-enfield-muzaffarpur", "/new-bikes-india", "/blog", "/sell-bike", "/contact", "/about", "/privacy-policy", "/terms"].map(path => ({
    url: `${baseUrl}${path}`,
    changeFrequency: path === "" || path === "/buy-bikes" ? "daily" : "weekly",
    priority: path === "" ? 1 : 0.8,
  }));
  const collectionPages = usedBikeCollectionSlugs
    .filter((slug) => bikes.some((bike) => matchesUsedBikeCollection(bike, usedBikeCollections[slug])))
    .map(slug => ({
    url: `${baseUrl}/used-bikes-bihar/${slug}`,
    changeFrequency: "daily" as const, priority: 0.75,
  }));
  const blogPages = blogPosts.map(post => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: "monthly" as const,
    priority: 0.65,
  }));
  const newBikePages = newBikeGuides.map(guide => ({ url: `${baseUrl}/new-bikes-india/${guide.slug}`, changeFrequency: "monthly" as const, priority: 0.65 }));
  // Submit a district URL only when it has real local inventory. The dedicated
  // Muzaffarpur route is already included above, so its duplicate route stays out.
  const districtPages = biharDistricts
    .filter(district => district !== "Muzaffarpur" && bikes.some(bike => bike.status === "Available" && locationMatchesDistrict(bike.location, district)))
    .map(district => ({ url: `${baseUrl}/used-bikes-bihar/${districtSlug(district)}`, changeFrequency: "weekly" as const, priority: 0.6 }));
  return [...pages, ...collectionPages, ...blogPages, ...newBikePages, ...districtPages, ...bikes.filter(isIndexableListing).map(bike => ({
    url: baseUrl + bikePath(bike), lastModified: bike.updatedAt,
    changeFrequency: "weekly" as const, priority: 0.7,
  }))];
}
