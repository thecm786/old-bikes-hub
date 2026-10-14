import { BIKE_BRANDS, normalizeBikeBrand } from "./bikeBrands";

const knownBrandKeys = new Set(BIKE_BRANDS.map((brand) => brand.toLowerCase()));

export function trackBuyerEvent(eventName: string, parameters: Record<string, string | number> = {}) {
  if (typeof window === "undefined" || !window.gtag) return;
  window.gtag("event", eventName, parameters);
}

type ListingEnquiryContext = {
  id: string;
  slug: string;
  brand: string;
  status: string;
};

function safeListingParameters(listing?: ListingEnquiryContext) {
  if (!listing) return {};

  const id = listing.id.trim();
  const slug = listing.slug.trim().toLowerCase();
  const brand = listing.brand.trim();
  const status = listing.status.trim().toLowerCase();
  const normalizedBrand = normalizeBikeBrand(brand);

  return {
    ...(id && /^[A-Za-z0-9_-]{1,64}$/.test(id) ? { listing_id: id } : {}),
    ...(slug && /^[a-z0-9-]{1,100}$/.test(slug) ? { listing_slug: slug } : {}),
    listing_brand: knownBrandKeys.has(normalizedBrand.toLowerCase()) ? normalizedBrand : "other",
    listing_status: ["available", "pending", "sold"].includes(status) ? status : "other",
  };
}

export function trackBuyerEnquiry(
  contactMethod: "whatsapp" | "phone",
  enquirySource?: string,
  listing?: ListingEnquiryContext,
) {
  const parameters = {
    contact_method: contactMethod,
    ...(enquirySource && /^[a-z0-9_]{1,64}$/.test(enquirySource) ? { enquiry_source: enquirySource } : {}),
    ...safeListingParameters(listing),
  };
  trackBuyerEvent("used_bike_enquiry", parameters);
  trackBuyerEvent("generate_lead", parameters);
}
