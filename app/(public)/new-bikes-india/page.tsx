import NewBikeExplorer from "@/components/NewBikeExplorer";
import { getNewBikeGuideImage, newBikeGuides } from "@/lib/newBikeGuides";
import { jsonLd, pageMetadata, SITE_URL } from "@/lib/seo";

export const metadata = pageMetadata("New Bike Guides India | Models, Features and Used-Bike Checks", "Independent guides to popular new bikes in India, their official specifications and what to check when buying a used model in Bihar.", "/new-bikes-india");

export default function NewBikesIndiaPage() {
  const brands = [...new Set(newBikeGuides.map((guide) => guide.brand))];
  const guides = newBikeGuides.map((guide) => ({ ...guide, imageSrc: getNewBikeGuideImage(guide) }));
  const collectionSchema = { "@context": "https://schema.org", "@type": "CollectionPage", name: "New Bikes India", description: "New bike model guides, specifications and used-bike buying advice from Old Bikes Hub.", url: `${SITE_URL}/new-bikes-india`, mainEntity: { "@type": "ItemList", itemListElement: newBikeGuides.map((guide, index) => ({ "@type": "ListItem", position: index + 1, url: `${SITE_URL}/new-bikes-india/${guide.slug}`, name: `${guide.brand} ${guide.model}` })) } };
  return <section className="bg-gray-100 py-10"><div className="mx-auto max-w-5xl px-4">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(collectionSchema) }} />
    <div className="rounded-3xl bg-black px-6 py-10 shadow-xl sm:px-10"><p className="text-sm font-bold uppercase tracking-wide text-orange-400">India motorcycle guides</p><h1 className="mt-2 text-3xl font-black text-white sm:text-4xl">New Bikes India</h1><p className="mt-4 max-w-3xl text-gray-300">Discover popular bikes and scooters, compare key details and find matching used-bike options that Old Bikes Hub can help you buy anywhere in Bihar.</p><div className="mt-6 flex flex-wrap gap-2">{brands.map((brand) => <span key={brand} className="rounded-full border border-white/20 px-3 py-1 text-sm font-semibold text-gray-200">{brand}</span>)}</div></div>
    <NewBikeExplorer guides={guides} />
  </div></section>;
}
