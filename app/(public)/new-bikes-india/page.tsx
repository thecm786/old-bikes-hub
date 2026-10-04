import Link from "next/link";
import { getNewBikeGuideImage, newBikeGuides } from "@/lib/newBikeGuides";
import { jsonLd, pageMetadata, SITE_URL } from "@/lib/seo";

export const metadata = pageMetadata("New Bike Guides India | Models, Features and Used-Bike Checks", "Independent guides to popular new bikes in India, their official specifications and what to check when buying a used model in Bihar.", "/new-bikes-india");

export default function NewBikesIndiaPage() {
  const brands = [...new Set(newBikeGuides.map((guide) => guide.brand))];
  const categories = [...new Set(newBikeGuides.map((guide) => guide.category))];
  const collectionSchema = { "@context": "https://schema.org", "@type": "CollectionPage", name: "New Bikes India", description: "New bike model guides, specifications and used-bike buying advice from Old Bikes Hub.", url: `${SITE_URL}/new-bikes-india`, mainEntity: { "@type": "ItemList", itemListElement: newBikeGuides.map((guide, index) => ({ "@type": "ListItem", position: index + 1, url: `${SITE_URL}/new-bikes-india/${guide.slug}`, name: `${guide.brand} ${guide.model}` })) } };
  return <section className="bg-gray-100 py-10"><div className="mx-auto max-w-5xl px-4">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(collectionSchema) }} />
    <div className="rounded-3xl bg-black px-6 py-10 shadow-xl sm:px-10"><p className="text-sm font-bold uppercase tracking-wide text-orange-400">India motorcycle guides</p><h1 className="mt-2 text-3xl font-black text-white">New Bikes India</h1><p className="mt-4 max-w-3xl text-gray-300">Compare popular new motorcycles, key specifications and buyer guidance. You can also explore matching used-bike options available through Old Bikes Hub in Bihar.</p><div className="mt-6 flex flex-wrap gap-2">{brands.map((brand) => <span key={brand} className="rounded-full border border-white/20 px-3 py-1 text-sm font-semibold text-gray-200">{brand}</span>)}</div></div>
    <section className="mt-8 rounded-3xl bg-white p-6 shadow-lg"><h2 className="text-xl font-black text-gray-900">Explore popular bike types</h2><div className="mt-4 flex flex-wrap gap-3">{categories.map((category) => <span key={category} className="rounded-xl bg-orange-50 px-4 py-2 text-sm font-bold text-orange-800">{category}</span>)}</div><p className="mt-4 text-gray-600">Every model guide has official-reference specifications, practical buying points and a direct route to comparable used bikes.</p></section>
    <div className="mt-8 grid gap-6 md:grid-cols-2">{newBikeGuides.map((guide) => { const image = getNewBikeGuideImage(guide); return <article key={guide.slug} className="overflow-hidden rounded-3xl bg-white shadow-lg">
      {image ? <img src={image} alt={`${guide.brand} ${guide.model}`} className="h-56 w-full bg-gray-100 object-contain p-4" /> : <div className="flex h-56 items-end bg-gradient-to-br from-gray-950 via-gray-800 to-orange-950 p-6"><p className="text-2xl font-black text-white">{guide.brand}<br />{guide.model}</p></div>}
      <div className="p-6">
      <p className="text-sm font-semibold text-orange-700">{guide.brand} · {guide.category}</p>
      <h2 className="mt-2 text-xl font-bold"><Link href={`/new-bikes-india/${guide.slug}`} className="hover:text-orange-700">{guide.model}</Link></h2>
      <p className="mt-3 text-gray-700">{guide.bestFor}</p>
      <ul className="mt-4 space-y-1 text-sm text-gray-600">{guide.highlights.slice(0, 2).map((item) => <li key={item}>• {item}</li>)}</ul>
      <Link href={`/new-bikes-india/${guide.slug}`} className="mt-5 inline-block rounded-xl bg-black px-4 py-2 font-bold text-white hover:bg-orange-500">Read model guide</Link>
      </div>
    </article>})}</div>
  </div></section>;
}
