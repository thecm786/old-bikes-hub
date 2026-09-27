import type { Metadata } from "next";
export const SITE_URL = "https://www.oldbikeshub.com";
export function pageMetadata(title: string, description: string, path: string, image = "/icon.png"): Metadata {
  return { title, description, alternates: { canonical: path },
    openGraph: { title, description, url: path, type: "website", siteName: "Old Bikes Hub", locale: "en_IN", images: [{ url: image, alt: title }] },
    twitter: { card: "summary_large_image", title, description, images: [image] },
  };
}
export function jsonLd(value: unknown) { return JSON.stringify(value).replace(/</g, "\\u003c"); }
