import NewBikeExplorer from "@/components/NewBikeExplorer";
import { getNewBikeGuideImage, newBikeGuides } from "@/lib/newBikeGuides";
import { jsonLd, pageMetadata, SITE_URL } from "@/lib/seo";

export const metadata = {
  ...pageMetadata("New Bikes in India | Popular Bikes & Scooters Guide", "Explore popular new bikes and scooters in India by brand and type. Compare model features, official specifications and matching used-bike options in Bihar.", "/new-bikes-india"),
  keywords: ["new bikes in India", "new scooters in India", "popular bikes India", "bike model guides", "new bikes Bihar", "new scooters Bihar", "used bikes Bihar"],
};

export default function NewBikesIndiaPage() {
  const guides = newBikeGuides.map((guide) => ({ ...guide, imageSrc: getNewBikeGuideImage(guide) }));
  const collectionSchema = { "@context": "https://schema.org", "@graph": [
    { "@type": "CollectionPage", "@id": `${SITE_URL}/new-bikes-india#webpage`, name: "New Bikes in India", description: "New bike and scooter model guides, official-reference specifications and used-bike buying advice from Old Bikes Hub.", url: `${SITE_URL}/new-bikes-india`, isPartOf: { "@type": "WebSite", name: "Old Bikes Hub", url: SITE_URL }, mainEntity: { "@id": `${SITE_URL}/new-bikes-india#models` } },
    { "@type": "ItemList", "@id": `${SITE_URL}/new-bikes-india#models`, name: "Popular new bike and scooter guides", numberOfItems: newBikeGuides.length, itemListElement: newBikeGuides.map((guide, index) => ({ "@type": "ListItem", position: index + 1, url: `${SITE_URL}/new-bikes-india/${guide.slug}`, name: `${guide.brand} ${guide.model}` })) },
    { "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: SITE_URL }, { "@type": "ListItem", position: 2, name: "New Bikes India", item: `${SITE_URL}/new-bikes-india` }] },
  ] };
  return <section className="bg-gray-100 py-10"><div className="mx-auto max-w-7xl px-4">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(collectionSchema) }} />
    <h1 className="sr-only">New Bikes India</h1>
    <nav aria-label="New bikes navigation" className="overflow-x-auto rounded-xl border border-gray-200 bg-white px-3 shadow-sm"><div className="flex min-w-max items-center justify-between gap-1"><div className="flex items-center"><a href="#model-guides" className="px-3 py-4 text-sm font-bold text-gray-800 transition hover:text-orange-600">BIKES <span className="text-xs">⌄</span></a><a href="#model-guides" className="px-3 py-4 text-sm font-bold text-gray-800 transition hover:text-orange-600">SCOOTERS <span className="text-xs">⌄</span></a><a href="#model-guides" className="px-3 py-4 text-sm font-bold text-gray-800 transition hover:text-orange-600">ELECTRIC TWO WHEELERS <span className="text-xs">⌄</span></a><a href="#model-guides" className="px-3 py-4 text-sm font-bold text-gray-800 transition hover:text-orange-600">COMPARE</a><a href="#model-guides" className="px-3 py-4 text-sm font-bold text-gray-800 transition hover:text-orange-600">NEWS &amp; VIDEOS <span className="text-xs">⌄</span></a><a href="#model-guides" className="px-3 py-4 text-sm font-bold text-gray-800 transition hover:text-orange-600">TOOLS <span className="text-xs">⌄</span></a><a href="/buy-bikes" className="px-3 py-4 text-sm font-bold text-gray-800 transition hover:text-orange-600">USED BIKES <span className="text-xs">⌄</span></a></div><span className="px-3 py-4 text-sm font-medium text-gray-500">⌖ Select City <span className="text-xs">⌄</span></span></div></nav>
    <NewBikeExplorer guides={guides} />
    <section className="mt-10 rounded-3xl bg-white p-6 shadow-lg sm:p-8"><h2 className="text-2xl font-black text-gray-950">Research new bikes and scooters before you buy</h2><div className="mt-4 space-y-4 text-gray-700"><p>Use this New Bikes India hub to explore popular commuter motorcycles, street bikes, retro roadsters and family scooters. Each model guide summarises important official-reference details, useful highlights and practical checks for riders also considering a pre-owned bike.</p><p>Old Bikes Hub serves buyers across Bihar. If a new-bike model suits your needs, use the related used options to check available listings and enquire from Muzaffarpur, Patna, Gaya, Motihari or any other Bihar city.</p><p>Specifications, features and prices can differ by variant, city and model year. Always confirm the current details with the manufacturer or an authorised dealer before deciding.</p></div></section>
  </div></section>;
}
