export const biharDistricts = [
  "Araria", "Arwal", "Aurangabad", "Banka", "Begusarai", "Bhagalpur", "Bhojpur", "Buxar", "Darbhanga", "East Champaran", "Gaya", "Gopalganj", "Jamui", "Jehanabad", "Khagaria", "Kishanganj", "Kaimur", "Katihar", "Lakhisarai", "Madhubani", "Madhepura", "Munger", "Muzaffarpur", "Nalanda", "Nawada", "Patna", "Purnia", "Rohtas", "Saharsa", "Samastipur", "Sheohar", "Sheikhpura", "Saran", "Sitamarhi", "Supaul", "Siwan", "Vaishali", "West Champaran",
] as const;

export function districtSlug(name: string) { return name.toLowerCase().replace(/\s+/g, "-"); }
export function getDistrict(slug: string) { return biharDistricts.find((district) => districtSlug(district) === slug); }
