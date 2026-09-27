export const siteConfig = {
  name: "Old Bikes Hub",

  tagline: "India's Trusted Used Bike Marketplace",

  description:
    "Buy, sell and exchange verified second hand bikes across India. Find your dream bike at the best price.",

  phone: "+918789192394",

  email: "admin@oldbikeshub.com",

  location: "Muzaffarpur, Bihar, India",

  whatsapp: "918789192394",
};

export function resolveSiteConfig(data?: Record<string, unknown>) {
  const text = (key: string, fallback: string) =>
    typeof data?.[key] === "string" && data[key].trim() ? data[key].trim() : fallback;
  const location = ["address", "city", "state"]
    .map((key) => text(key, "")).filter(Boolean).join(", ");
  return {
    ...siteConfig,
    name: text("websiteName", siteConfig.name),
    description: text("websiteDescription", siteConfig.description),
    phone: text("phone", siteConfig.phone),
    whatsapp: text("whatsapp", siteConfig.whatsapp).replace(/\D/g, ""),
    email: text("email", siteConfig.email),
    location: location || siteConfig.location,
  };
}

// Explicit allowlist: never publish adminName or adminEmail.
export function publicSiteSettings(settings: Record<string, unknown>) {
  const keys = ["websiteName", "websiteDescription", "phone", "whatsapp", "email", "address", "city", "state"];
  return Object.fromEntries(keys.map((key) => [key, typeof settings[key] === "string" ? settings[key].trim() : ""]));
}
