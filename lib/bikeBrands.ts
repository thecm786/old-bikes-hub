export const BIKE_BRANDS = [
  "Ampere",
  "Aprilia",
  "Ather",
  "Bajaj",
  "Benelli",
  "BMW",
  "CFMoto",
  "Cleveland CycleWerks",
  "Ducati",
  "Evolet",
  "Harley-Davidson",
  "Hero",
  "Hero Electric",
  "Honda",
  "Husqvarna",
  "Indian",
  "Jawa",
  "Kawasaki",
  "Keeway",
  "Komaki",
  "KTM",
  "LML",
  "Mahindra",
  "Matter",
  "Moto Guzzi",
  "Motoroyale",
  "Ola Electric",
  "Okaya",
  "Revolt",
  "Royal Enfield",
  "Simple Energy",
  "Tork",
  "Suzuki",
  "TVS",
  "Triumph",
  "UM",
  "Vida",
  "Vespa",
  "Yamaha",
  "Yezdi",
] as const;

const brandLookup = new Map(
  BIKE_BRANDS.map((brand) => [brand.toLocaleLowerCase("en-IN"), brand])
);

// A few older listings stored a model name in the brand field. Keep those
// listings grouped under the manufacturer until the inventory is migrated.
const legacyBrandAliases = new Map<string, (typeof BIKE_BRANDS)[number]>([
  ["pulsar 150", "Bajaj"],
]);

/** Returns the official spelling for known brands, including legacy casing variants. */
export function normalizeBikeBrand(value: string) {
  const cleaned = value.trim().replace(/\s+/g, " ");
  const normalized = cleaned.toLocaleLowerCase("en-IN");
  return legacyBrandAliases.get(normalized) ?? brandLookup.get(normalized) ?? cleaned;
}

export function isSupportedBikeBrand(value: string) {
  return brandLookup.has(value.trim().replace(/\s+/g, " ").toLocaleLowerCase("en-IN"));
}
