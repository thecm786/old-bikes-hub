import Link from "next/link";
import { newBikeGuides } from "@/lib/newBikeGuides";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("New Bike Guides India | Models, Features and Used-Bike Checks", "Independent guides to popular new bikes in India, their official specifications and what to check when buying a used model in Bihar.", "/new-bikes-india");

export default function NewBikesIndiaPage() {
  return <section className="mx-auto max-w-5xl px-4 py-10">
    <p className="text-sm font-semibold uppercase tracking-wide text-orange-700">India motorcycle guides</p>
    <h1 className="mt-2 text-3xl font-black">New Bike Guides for India</h1>
    <p className="mt-4 max-w-3xl text-gray-700">Explore popular Indian motorcycles using official manufacturer specifications. Every guide also explains what to inspect when you compare a used bike in Bihar.</p>
    <div className="mt-8 grid gap-6 md:grid-cols-2">{newBikeGuides.map((guide) => <article key={guide.slug} className="rounded-2xl border bg-white p-6 shadow-sm">
      <p className="text-sm font-semibold text-orange-700">{guide.brand} · {guide.category}</p>
      <h2 className="mt-2 text-xl font-bold"><Link href={`/new-bikes-india/${guide.slug}`} className="hover:text-orange-700">{guide.model}</Link></h2>
      <p className="mt-3 text-gray-700">{guide.bestFor}</p>
      <ul className="mt-4 space-y-1 text-sm text-gray-600">{guide.highlights.slice(0, 2).map((item) => <li key={item}>• {item}</li>)}</ul>
      <Link href={`/new-bikes-india/${guide.slug}`} className="mt-5 inline-block font-semibold text-orange-700 underline">Read model guide</Link>
    </article>)}</div>
  </section>;
}
