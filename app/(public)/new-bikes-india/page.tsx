import Link from "next/link";
import { newBikeGuides } from "@/lib/newBikeGuides";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("New Bike Guides India | Models, Features and Used-Bike Checks", "Independent guides to popular new bikes in India, their official specifications and what to check when buying a used model in Bihar.", "/new-bikes-india");

export default function NewBikesIndiaPage() {
  return <section className="bg-gray-100 py-10"><div className="mx-auto max-w-5xl px-4">
    <div className="rounded-3xl bg-black px-6 py-10 shadow-xl sm:px-10"><p className="text-sm font-bold uppercase tracking-wide text-orange-400">India motorcycle guides</p><h1 className="mt-2 text-3xl font-black text-white">New Bike Guides for India</h1><p className="mt-4 max-w-3xl text-gray-300">Explore popular Indian motorcycles using official manufacturer specifications. Every guide also explains what to inspect when you compare a used bike in Bihar.</p></div>
    <div className="mt-8 grid gap-6 md:grid-cols-2">{newBikeGuides.map((guide) => <article key={guide.slug} className="overflow-hidden rounded-3xl bg-white shadow-lg">
      <img src={guide.image} alt={`${guide.brand} ${guide.model}`} className="h-56 w-full bg-gray-100 object-contain p-4" />
      <div className="p-6">
      <p className="text-sm font-semibold text-orange-700">{guide.brand} · {guide.category}</p>
      <h2 className="mt-2 text-xl font-bold"><Link href={`/new-bikes-india/${guide.slug}`} className="hover:text-orange-700">{guide.model}</Link></h2>
      <p className="mt-3 text-gray-700">{guide.bestFor}</p>
      <ul className="mt-4 space-y-1 text-sm text-gray-600">{guide.highlights.slice(0, 2).map((item) => <li key={item}>• {item}</li>)}</ul>
      <Link href={`/new-bikes-india/${guide.slug}`} className="mt-5 inline-block rounded-xl bg-black px-4 py-2 font-bold text-white hover:bg-orange-500">Read model guide</Link>
      </div>
    </article>)}</div>
  </div></section>;
}
