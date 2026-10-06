import NewBikeExplorer from "@/components/NewBikeExplorer";
import { getNewBikeGuideImage, newBikeGuides } from "@/lib/newBikeGuides";
import { jsonLd, pageMetadata, SITE_URL } from "@/lib/seo";

export const metadata = {
  ...pageMetadata("New Bikes in India | Popular Bikes & Scooters Guide", "Explore popular new bikes and scooters in India by brand and type. Compare model features, official specifications and matching used-bike options in Bihar.", "/new-bikes-india"),
  keywords: ["new bikes in India", "new scooters in India", "popular bikes India", "bike model guides", "new bikes Bihar", "new scooters Bihar", "used bikes Bihar"],
};

export default function NewBikesIndiaPage() {
  const brands = [...new Set(newBikeGuides.map((guide) => guide.brand))];
  const guides = newBikeGuides.map((guide) => ({ ...guide, imageSrc: getNewBikeGuideImage(guide) }));
  const collectionSchema = { "@context": "https://schema.org", "@graph": [
    { "@type": "CollectionPage", "@id": `${SITE_URL}/new-bikes-india#webpage`, name: "New Bikes in India", description: "New bike and scooter model guides, official-reference specifications and used-bike buying advice from Old Bikes Hub.", url: `${SITE_URL}/new-bikes-india`, isPartOf: { "@type": "WebSite", name: "Old Bikes Hub", url: SITE_URL }, mainEntity: { "@id": `${SITE_URL}/new-bikes-india#models` } },
    { "@type": "ItemList", "@id": `${SITE_URL}/new-bikes-india#models`, name: "Popular new bike and scooter guides", numberOfItems: newBikeGuides.length, itemListElement: newBikeGuides.map((guide, index) => ({ "@type": "ListItem", position: index + 1, url: `${SITE_URL}/new-bikes-india/${guide.slug}`, name: `${guide.brand} ${guide.model}` })) },
    { "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: SITE_URL }, { "@type": "ListItem", position: 2, name: "New Bikes India", item: `${SITE_URL}/new-bikes-india` }] },
  ] };
  return <section className="bg-gray-100 py-10"><div className="mx-auto max-w-7xl px-4">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(collectionSchema) }} />
    <div className="rounded-3xl bg-black px-6 py-10 shadow-xl sm:px-10"><p className="text-sm font-bold uppercase tracking-wide text-orange-400">India motorcycle guides</p><h1 className="mt-2 text-3xl font-black text-white sm:text-4xl">New Bikes India</h1><p className="mt-4 max-w-3xl text-gray-300">Discover popular bikes and scooters, compare key details and find matching used-bike options that Old Bikes Hub can help you buy anywhere in Bihar.</p><div className="mt-6 flex flex-wrap gap-2">{brands.map((brand) => <span key={brand} className="rounded-full border border-white/20 px-3 py-1 text-sm font-semibold text-gray-200">{brand}</span>)}</div></div>
    <NewBikeExplorer guides={guides} />
    <section className="mt-10 rounded-3xl bg-white p-6 shadow-lg sm:p-8"><h2 className="text-2xl font-black text-gray-950">Research new bikes and scooters before you buy</h2><div className="mt-4 space-y-4 text-gray-700"><p>Use this New Bikes India hub to explore popular commuter motorcycles, street bikes, retro roadsters and family scooters. Each model guide summarises important official-reference details, useful highlights and practical checks for riders also considering a pre-owned bike.</p><p>Old Bikes Hub serves buyers across Bihar. If a new-bike model suits your needs, use the related used options to check available listings and enquire from Muzaffarpur, Patna, Gaya, Motihari or any other Bihar city.</p><p>Specifications, features and prices can differ by variant, city and model year. Always confirm the current details with the manufacturer or an authorised dealer before deciding.</p></div></section>
  </div></section>;
}
