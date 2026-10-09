"use client";

import { FormEvent, useState } from "react";
import { MessageCircle } from "lucide-react";
import { biharDistricts } from "@/lib/biharDistricts";
import { useSiteConfig } from "@/providers/SiteConfigProvider";

export default function BuyerRequirementForm({ brands }: { brands: string[] }) {
  const siteConfig = useSiteConfig();
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [budget, setBudget] = useState("");
  const [city, setCity] = useState("");

  function submitRequirement(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const message = [
      "Hello Old Bikes Hub, I am looking for a second hand bike.",
      `Brand: ${brand || "Any brand"}`,
      `Model: ${model.trim() || "Any model"}`,
      `Budget: ${budget || "Not decided"}`,
      `City: ${city || "Bihar"}`,
      "Please share matching available bikes.",
    ].join("\n");
    window.open(`https://wa.me/${siteConfig.whatsapp}?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
  }

  return (
    <section className="mx-auto mt-6 max-w-7xl rounded-3xl border border-orange-100 bg-orange-50 p-5 shadow-sm sm:p-6" aria-labelledby="buyer-requirement-heading">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-xl">
          <p className="text-sm font-bold uppercase tracking-wide text-orange-600">Need help finding a bike?</p>
          <h2 id="buyer-requirement-heading" className="mt-1 text-2xl font-black text-gray-900">Tell us your bike requirement</h2>
          <p className="mt-2 text-sm leading-6 text-gray-600">Share your preference and we&apos;ll help you find matching used bikes in Bihar.</p>
        </div>
        <form onSubmit={submitRequirement} className="grid w-full gap-3 sm:grid-cols-2 lg:max-w-3xl lg:grid-cols-5">
          <select value={brand} onChange={(event) => setBrand(event.target.value)} className="rounded-xl border border-orange-200 bg-white px-3 py-3 text-sm font-medium text-gray-800">
            <option value="">Any brand</option>
            {brands.filter((item) => item !== "All").map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
          <input value={model} onChange={(event) => setModel(event.target.value)} placeholder="Model (optional)" className="rounded-xl border border-orange-200 bg-white px-3 py-3 text-sm font-medium text-gray-800" />
          <select value={budget} onChange={(event) => setBudget(event.target.value)} className="rounded-xl border border-orange-200 bg-white px-3 py-3 text-sm font-medium text-gray-800">
            <option value="">Your budget</option>
            <option value="Under ₹50,000">Under ₹50,000</option>
            <option value="₹50,000–₹1 lakh">₹50,000–₹1 lakh</option>
            <option value="₹1–₹2 lakh">₹1–₹2 lakh</option>
            <option value="Above ₹2 lakh">Above ₹2 lakh</option>
          </select>
          <select value={city} onChange={(event) => setCity(event.target.value)} className="rounded-xl border border-orange-200 bg-white px-3 py-3 text-sm font-medium text-gray-800">
            <option value="">Your Bihar city</option>
            {biharDistricts.map((district) => <option key={district} value={district}>{district}</option>)}
          </select>
          <button type="submit" className="flex items-center justify-center gap-2 rounded-xl bg-green-500 px-4 py-3 text-sm font-black text-white transition hover:bg-green-600"><MessageCircle size={18} />Get matching bikes</button>
        </form>
      </div>
    </section>
  );
}
