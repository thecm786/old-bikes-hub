import type { MetadataRoute } from "next";
const baseUrl = "https://www.oldbikeshub.com";
export default function sitemap(): MetadataRoute.Sitemap {
  return ["", "/buy-bikes", "/sell-bike", "/contact"].map(path => ({
    url: `${baseUrl}${path}`,
    changeFrequency: path === "" || path === "/buy-bikes" ? "daily" : "weekly",
    priority: path === "" ? 1 : 0.8,
  }));
}
