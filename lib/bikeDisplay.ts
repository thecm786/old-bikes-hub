import { normalizeBikeBrand } from "@/lib/bikeBrands";

export function bikeDisplayName(brand: string, name: string) {
  const cleanBrand = normalizeBikeBrand(brand);
  const cleanName = name.trim().replace(/\s+/g, " ");
  const brandPrefix = `${cleanBrand} `.toLocaleLowerCase("en-IN");

  return cleanName.toLocaleLowerCase("en-IN").startsWith(brandPrefix)
    ? cleanName.slice(cleanBrand.length).trim()
    : cleanName;
}

export function bikeFullName(brand: string, name: string) {
  const cleanBrand = normalizeBikeBrand(brand);
  return `${cleanBrand} ${bikeDisplayName(cleanBrand, name)}`.trim();
}
