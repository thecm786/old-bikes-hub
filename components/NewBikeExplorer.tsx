"use client";

import Link from "next/link";
import { Search, Sparkles } from "lucide-react";
import { useMemo, useState } from "react";
import NewBikeGuideImage from "@/components/NewBikeGuideImage";
import type { NewBikeGuide } from "@/lib/newBikeGuides";

type GuideWithImage = NewBikeGuide & { imageSrc?: string };

const isScooter = (guide: NewBikeGuide) => guide.category.toLowerCase().includes("scooter");

export default function NewBikeExplorer({ guides }: { guides: GuideWithImage[] }) {
  const [query, setQuery] = useState("");
  const [brand, setBrand] = useState("All brands");
  const [type, setType] = useState("All");
  const brands = [...new Set(guides.map((guide) => guide.brand))];
  const results = useMemo(() => guides.filter((guide) => {
    const matchesQuery = `${guide.brand} ${guide.model} ${guide.category}`.toLowerCase().includes(query.trim().toLowerCase());
    const matchesBrand = brand === "All brands" || guide.brand === brand;
    const matchesType = type === "All" || (type === "Scooters" ? isScooter(guide) : !isScooter(guide));
    return matchesQuery && matchesBrand && matchesType;
  }), [brand, guides, query, type]);

  return <>
    <section className="mt-8 overflow-hidden rounded-3xl bg-white shadow-lg">
      <div className="bg-gradient-to-r from-orange-600 via-orange-500 to-amber-400 px-6 py-7 text-white sm:px-8">
        <p className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-orange-100"><Sparkles className="h-4 w-4" /> Find your next bike</p>
        <h2 className="mt-2 text-2xl font-black">Search by model, brand or bike type</h2>
        <p className="mt-2 max-w-2xl text-sm text-orange-50">Compare popular new bikes, then check similar verified used-bike options available across Bihar.</p>
        <div className="mt-5 flex flex-col gap-3 rounded-2xl bg-white p-3 shadow-xl sm:flex-row">
          <label className="flex flex-1 items-center gap-3 rounded-xl bg-gray-100 px-4 py-3 text-gray-600">
            <Search className="h-5 w-5 shrink-0 text-orange-600" />
            <input value={query} onChange={(event) => setQuery(event.target.value)} className="w-full bg-transparent text-sm font-medium outline-none placeholder:text-gray-500" placeholder="Search Pulsar, Activa, Royal Enfield…" />
          </label>
          <select value={brand} onChange={(event) => setBrand(event.target.value)} className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-bold text-gray-800 outline-none">
            <option>All brands</option>
            {brands.map((item) => <option key={item}>{item}</option>)}
          </select>
        </div>
      </div>
      <div className="p-5 sm:p-6">
        <div className="flex flex-wrap gap-2">
          {["All", "Bikes", "Scooters"].map((item) => <button type="button" key={item} onClick={() => setType(item)} className={`rounded-full px-4 py-2 text-sm font-bold transition ${type === item ? "bg-black text-white" : "bg-gray-100 text-gray-700 hover:bg-orange-50 hover:text-orange-700"}`}>{item}</button>)}
        </div>
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
          <p className="font-bold text-gray-900"><span className="text-orange-600">{results.length}</span> model guides available</p>
          {(query || brand !== "All brands" || type !== "All") && <button type="button" onClick={() => { setQuery(""); setBrand("All brands"); setType("All"); }} className="text-sm font-bold text-orange-700 hover:underline">Clear filters</button>}
        </div>
      </div>
    </section>

    <section className="mt-8">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3"><div><p className="text-sm font-bold uppercase tracking-wide text-orange-700">Bikes in spotlight</p><h2 className="text-2xl font-black text-gray-950">Popular new bikes & scooters</h2></div><p className="text-sm text-gray-600">Official-reference guides with Bihar used-bike options</p></div>
      {results.length ? <div className="grid gap-6 md:grid-cols-2">{results.map((guide) => <article key={guide.slug} className="group overflow-hidden rounded-3xl bg-white shadow-lg transition hover:-translate-y-1 hover:shadow-xl">
        <NewBikeGuideImage src={guide.imageSrc} brand={guide.brand} model={guide.model} className="h-56 w-full p-4" />
        <div className="p-6"><div className="flex items-start justify-between gap-3"><div><p className="text-sm font-semibold text-orange-700">{guide.brand} · {guide.category}</p><h2 className="mt-1 text-xl font-black text-gray-950"><Link href={`/new-bikes-india/${guide.slug}`} className="hover:text-orange-700">{guide.model}</Link></h2></div><span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-bold text-orange-700">Guide</span></div>
          <p className="mt-3 text-gray-700">{guide.bestFor}</p><ul className="mt-4 space-y-1 text-sm text-gray-600">{guide.highlights.slice(0, 2).map((item) => <li key={item}>• {item}</li>)}</ul>
          <div className="mt-5 flex flex-wrap gap-3"><Link href={`/new-bikes-india/${guide.slug}`} className="rounded-xl bg-black px-4 py-2 font-bold text-white transition hover:bg-orange-500">View model guide</Link><Link href={guide.usedCollection} className="rounded-xl border border-gray-300 px-4 py-2 font-bold text-gray-800 transition hover:border-orange-400 hover:text-orange-700">View used options</Link></div>
        </div>
      </article>)}</div> : <div className="rounded-3xl bg-white p-10 text-center shadow-lg"><h2 className="text-xl font-black text-gray-900">No matching model yet</h2><p className="mt-2 text-gray-600">Try a different brand or clear the current filters.</p></div>}
    </section>
  </>;
}
