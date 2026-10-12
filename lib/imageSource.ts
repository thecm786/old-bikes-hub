export const IMAGE_PLACEHOLDER = "/bike-placeholder.svg";

export function imageSource(value?: string) {
  const source = value?.trim();
  if (!source) return { src: IMAGE_PLACEHOLDER, unoptimized: false };
  if (source.startsWith("/") && !source.startsWith("//")) return { src: source, unoptimized: false };
  if (source.startsWith("blob:") || source.startsWith("data:image/")) return { src: source, unoptimized: true };
  try {
    const url = new URL(source.startsWith("//") ? `https:${source}` : source);
    if (!["https:", "http:"].includes(url.protocol)) throw new Error("Unsupported image URL");
    const optimized = url.protocol === "https:" && !url.port &&
      url.hostname === "images.unsplash.com";
    // Cloudinary generates the card-sized image itself, so bypass Vercel's
    // per-request optimizer. Older listings may also use other direct hosts.
    return { src: url.href, unoptimized: !optimized };
  } catch {
    return { src: IMAGE_PLACEHOLDER, unoptimized: false };
  }
}
