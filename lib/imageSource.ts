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
      ["res.cloudinary.com", "images.unsplash.com"].includes(url.hostname);
    // Older listings may use other hosts or signed Firebase Storage URLs.
    // Preserve direct delivery for those instead of rejecting existing photos.
    return { src: url.href, unoptimized: !optimized };
  } catch {
    return { src: IMAGE_PLACEHOLDER, unoptimized: false };
  }
}
