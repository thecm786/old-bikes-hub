export type SellRequestForm = {
  name: string; mobile: string; brand: string; model: string;
  year: string; km: string; price: string; location: string; description: string;
};

export function validateSellRequest(form: SellRequestForm, images: string[], currentYear = new Date().getFullYear()) {
  if (!form.name.trim() || form.name.trim().length > 100) return "Enter your name (up to 100 characters).";
  if (!/^\+?[0-9]{10,15}$/.test(form.mobile.trim())) return "Enter a valid phone number with 10–15 digits.";
  if (!form.brand.trim() || form.brand.trim().length > 60) return "Enter a bike brand (up to 60 characters).";
  if (!form.model.trim() || form.model.trim().length > 100) return "Enter a model (up to 100 characters).";
  if (form.year && (!/^\d{4}$/.test(form.year) || Number(form.year) < 1900 || Number(form.year) > currentYear + 1)) return "Enter a valid manufacturing year.";
  if (form.km && !/^\d{1,7}$/.test(form.km)) return "Enter kilometres as a non-negative whole number (up to 7 digits).";
  if (form.price && !/^\d{1,9}$/.test(form.price)) return "Enter price as a non-negative whole number (up to 9 digits).";
  if (form.location.length > 150 || form.description.length > 3000) return "Keep the city under 150 characters and description under 3,000 characters.";
  if (images.length > 8 || images.some((url) => typeof url !== "string" || url.length > 2048 || !url.startsWith("https://res.cloudinary.com/w4eee6vd/image/upload/"))) return "Please remove invalid photos and upload them again.";
  return null;
}
