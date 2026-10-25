import Link from "next/link";
import SiteImage from "@/components/SiteImage";
import { getPublicInventory } from "@/lib/publicInventory";
import { bikePath } from "@/lib/bikeUrls";
import { jsonLd, pageMetadata, SITE_URL } from "@/lib/seo";
import { bikeFullName } from "@/lib/bikeDisplay";
import { locationMatchesDistrict } from "@/lib/biharDistricts";

export const revalidate = 3600;
export const metadata = pageMetadata("Second Hand Bikes in Muzaffarpur | Used Bike Prices & Photos", "Find used and second hand bikes in Muzaffarpur, Bihar. Compare current prices, photos, kilometres, model years and verified local availability before you enquire with Old Bikes Hub.", "/used-bikes-muzaffarpur");

export default async function UsedBikesMuzaffarpur() {
  const bikes = (await getPublicInventory()).filter((bike) => bike.status === "Available" && locationMatchesDistrict(bike.location, "Muzaffarpur"));
  const schema = {
    "@context": "https://schema.org", "@type": "AutoDealer", name: "Old Bikes Hub", url: SITE_URL,
    telephone: "+918789192394", email: "admin@oldbikeshub.com",
    address: { "@type": "PostalAddress", streetAddress: "Pakri Chowk, Rewa Road", addressLocality: "Muzaffarpur", postalCode: "843113", addressRegion: "Bihar", addressCountry: "IN" },
    areaServed: { "@type": "AdministrativeArea", name: "Bihar, India" },
    description: "Used bike marketplace based in Muzaffarpur, serving buyers across Bihar.",
  };
  const faq = {
    "@context": "https://schema.org", "@type": "FAQPage", mainEntity: [
      { "@type": "Question", name: "Can I buy a second hand bike in Muzaffarpur through Old Bikes Hub?", acceptedAnswer: { "@type": "Answer", text: "Yes. Browse the available listings, then contact Old Bikes Hub to confirm availability, inspection and ownership-transfer arrangements before payment." } },
      { "@type": "Question", name: "Are these bikes physically located in Muzaffarpur?", acceptedAnswer: { "@type": "Answer", text: "Yes. This page only shows currently available listings verified as located in Muzaffarpur. Browse the Bihar-wide inventory to see availability in other locations." } },
      { "@type": "Question", name: "What should I check before buying a used bike?", acceptedAnswer: { "@type": "Answer", text: "Check the RC, insurance, chassis and engine numbers, condition, service history and ownership-transfer process before paying." } },
      { "@type": "Question", name: "Can I sell my old bike in Muzaffarpur?", acceptedAnswer: { "@type": "Answer", text: "Yes. Share your bike details with Old Bikes Hub to discuss an inspection and a selling enquiry." } },
    ],
  };
  return <section className="bg-gray-100 py-10"><div className="mx-auto max-w-7xl px-4">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(schema) }} />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(faq) }} />
    <div className="relative overflow-hidden rounded-3xl bg-black px-6 py-10 shadow-xl sm:px-10"><div className="pointer-events-none absolute -right-16 -top-16 h-52 w-52 rounded-full bg-orange-500/20 blur-3xl" />
    <p className="relative text-sm font-bold uppercase tracking-wide text-orange-400">Muzaffarpur, Bihar</p>
    <h1 className="relative mt-2 text-3xl font-black text-white sm:text-4xl">Second Hand Bikes in Muzaffarpur</h1>
    <p className="relative mt-4 max-w-4xl leading-7 text-gray-300">Looking for a second hand bike in Muzaffarpur? Old Bikes Hub is based in Muzaffarpur and this page shows currently available motorcycles and scooters verified as located here. Compare real price, photos, kilometres and model year, then confirm inspection, documents, ownership transfer and delivery before you buy.</p>
    <div className="relative mt-6 flex flex-wrap gap-3"><Link href="/buy-bikes" className="rounded-xl bg-orange-500 px-5 py-3 font-bold text-white shadow-lg shadow-orange-500/20 hover:bg-orange-600">Browse all bikes</Link><Link href="/contact" className="rounded-xl border border-white/30 px-5 py-3 font-bold text-white hover:bg-white/10">Contact Old Bikes Hub</Link></div></div>
    <h2 className="mt-10 text-2xl font-black text-gray-900">Available used bikes in Muzaffarpur</h2>
    <p className="mt-2 text-gray-700">{bikes.length} verified local listings. The location shown on each card is the bike&apos;s true location.</p>
    <div className="mt-5 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{bikes.map((bike) => <article key={bike.id} className="group overflow-hidden rounded-3xl bg-white shadow-lg transition hover:-translate-y-1 hover:shadow-xl">
      <Link href={bikePath(bike)}><div className="relative h-56"><SiteImage src={bike.images[0] || bike.image || "/bike-placeholder.svg"} alt={`${bikeFullName(bike.brand, bike.name)} ${bike.year}`} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" className="object-cover" /></div>
        <div className="p-5"><h3 className="text-xl font-black text-gray-900">{bikeFullName(bike.brand, bike.name)} · {bike.year}</h3><p className="mt-2 text-xl font-black text-orange-500">{String(bike.price).includes("₹") ? bike.price : `₹${Number(bike.price).toLocaleString("en-IN")}`}</p><p className="mt-2 text-gray-600">{bike.km} km · Location: {bike.location || "Confirm with seller"}</p><span className="mt-4 inline-block rounded-xl bg-black px-4 py-2 font-bold text-white transition group-hover:bg-orange-500">View bike details</span></div>
      </Link>
    </article>)}</div>
    {!bikes.length && <p className="mt-5">No available listings at the moment. Contact us for upcoming bikes.</p>}
    <section className="mt-12 max-w-4xl rounded-3xl bg-white p-6 shadow-lg"><h2 className="text-2xl font-black text-gray-900">Buying a used bike in Muzaffarpur: quick checks</h2><ul className="mt-4 list-disc space-y-2 pl-5 text-gray-700"><li>Compare the year, kilometres, price and true bike location before travelling.</li><li>Inspect the motorcycle, test ride with permission and match chassis and engine numbers with the RC.</li><li>Check insurance, any active loan and the ownership-transfer plan before payment.</li></ul><Link href="/blog/used-bike-buying-checklist-bihar" className="mt-5 inline-block font-semibold text-orange-700 underline">Read the complete used-bike buying checklist</Link></section>
    <section className="mt-6 max-w-4xl rounded-3xl bg-white p-6 shadow-lg"><h2 className="text-2xl font-black text-gray-900">Used bike and second hand bike options in Muzaffarpur</h2><p className="mt-3 leading-7 text-gray-700">Browse verified Muzaffarpur commuter bikes, street motorcycles, Royal Enfield models and scooters in one inventory. Each card shows its true location, price and kilometres so you can arrange inspection with confidence.</p><div className="mt-5 flex flex-wrap gap-3"><Link href="/used-royal-enfield-muzaffarpur" className="font-semibold text-orange-700 underline">Second hand Royal Enfield bikes in Muzaffarpur</Link><Link href="/used-bikes-bihar/royal-enfield" className="font-semibold text-orange-700 underline">Used Royal Enfield bikes across Bihar</Link><Link href="/used-bikes-bihar/honda" className="font-semibold text-orange-700 underline">Used Honda bikes</Link><Link href="/used-bikes-bihar/bikes-under-50000" className="font-semibold text-orange-700 underline">Second hand bikes under ₹50,000</Link><Link href="/used-bikes-bihar" className="font-semibold text-orange-700 underline">Browse Bihar-wide bikes</Link><Link href="/sell-bike" className="font-semibold text-orange-700 underline">Sell your old bike</Link></div></section>
  </div></section>;
}
