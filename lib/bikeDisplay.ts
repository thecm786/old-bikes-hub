export function bikeDisplayName(brand: string, name: string) {
  const cleanBrand = brand.trim();
  const cleanName = name.trim().replace(/\s+/g, " ");
  const brandPrefix = `${cleanBrand} `.toLocaleLowerCase("en-IN");

  return cleanName.toLocaleLowerCase("en-IN").startsWith(brandPrefix)
    ? cleanName.slice(cleanBrand.length).trim()
    : cleanName;
}

export function bikeFullName(brand: string, name: string) {
  return `${brand.trim()} ${bikeDisplayName(brand, name)}`.trim();
}
