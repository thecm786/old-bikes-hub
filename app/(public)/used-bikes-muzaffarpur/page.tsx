import Link from "next/link";
import SiteImage from "@/components/SiteImage";
import { getPublicInventory } from "@/lib/publicInventory";
import { bikePath } from "@/lib/bikeUrls";
import { jsonLd, pageMetadata, SITE_URL } from "@/lib/seo";

export const dynamic = "force-dynamic";
export const metadata = pageMetadata("Second Hand Bikes in Muzaffarpur | Used Bikes for Sale", "Browse available second hand bikes in Muzaffarpur and across Bihar. View real prices, photos, kilometres and actual bike locations on Old Bikes Hub.", "/used-bikes-muzaffarpur");

export default async function UsedBikesMuzaffarpur() {
  const bikes = (await getPublicInventory()).filter((bike) => bike.status === "Available");
  const schema = {
    "@context": "https://schema.org", "@type": "AutoDealer", name: "Old Bikes Hub", url: SITE_URL,
    address: { "@type": "PostalAddress", addressLocality: "Muzaffarpur", addressRegion: "Bihar", addressCountry: "IN" },
    areaServed: { "@type": "AdministrativeArea", name: "Bihar, India" },
    description: "Used bike marketplace based in Muzaffarpur, serving buyers across Bihar.",
  };
  const faq = {
    "@context": "https://schema.org", "@type": "FAQPage", mainEntity: [
      { "@type": "Question", name: "Can I buy a second hand bike in Muzaffarpur through Old Bikes Hub?", acceptedAnswer: { "@type": "Answer", text: "Yes. Browse the available listings, then contact Old Bikes Hub to confirm availability, inspection and ownership-transfer arrangements before payment." } },
      { "@type": "Question", name: "Are all listed bikes physically located in Muzaffarpur?", acceptedAnswer: { "@type": "Answer", text: "No. Every listing shows its actual location. Buyers in Muzaffarpur can enquire about any available bike listed across Bihar." } },
      { "@type": "Question", name: "What should I check before buying a used bike?", acceptedAnswer: { "@type": "Answer", text: "Check the RC, insurance, chassis and engine numbers, condition, service history and ownership-transfer process before paying." } },
    ],
  };
  return <section className="mx-auto max-w-7xl px-4 py-10">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(schema) }} />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(faq) }} />
    <p className="text-sm font-semibold uppercase tracking-wide text-orange-700">Muzaffarpur, Bihar</p>
    <h1 className="mt-2 text-3xl font-black">Second Hand Bikes in Muzaffarpur</h1>
    <p className="mt-4 max-w-4xl text-gray-700">Old Bikes Hub is based in Muzaffarpur and helps buyers browse used bikes available across Bihar. Every listing has its actual bike location, price, photos and kilometres. You can enquire from Muzaffarpur about any available listing and confirm inspection, documents, ownership transfer and delivery before you buy.</p>
    <div className="mt-6 flex flex-wrap gap-3"><Link href="/buy-bikes" className="rounded-lg bg-orange-600 px-5 py-3 font-bold text-white">Browse all bikes</Link><Link href="/contact" className="rounded-lg border border-orange-300 px-5 py-3 font-bold text-orange-800">Contact Old Bikes Hub</Link></div>
    <h2 className="mt-10 text-2xl font-bold">Available used bikes for Muzaffarpur buyers</h2>
    <p className="mt-2 text-gray-700">{bikes.length} available listings. The location shown on each card is the bike&apos;s true location.</p>
    <div className="mt-5 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{bikes.map((bike) => <article key={bike.id} className="overflow-hidden rounded-xl border bg-white">
      <Link href={bikePath(bike)}><div className="relative h-56"><SiteImage src={bike.images[0] || bike.image || "/bike-placeholder.svg"} alt={`${bike.brand} ${bike.name} ${bike.year}`} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" className="object-cover" /></div>
        <div className="p-5"><h3 className="text-xl font-bold">{bike.brand} {bike.name} · {bike.year}</h3><p className="mt-2 font-semibold">{String(bike.price).includes("₹") ? bike.price : `₹${Number(bike.price).toLocaleString("en-IN")}`}</p><p>{bike.km} km · Location: {bike.location || "Confirm with seller"}</p><span className="mt-3 inline-block text-orange-700 underline">View bike details</span></div>
      </Link>
    </article>)}</div>
    {!bikes.length && <p className="mt-5">No available listings at the moment. Contact us for upcoming bikes.</p>}
    <section className="mt-12 max-w-4xl rounded-2xl border bg-gray-50 p-6"><h2 className="text-2xl font-bold">Buying a used bike in Muzaffarpur: quick checks</h2><ul className="mt-4 list-disc space-y-2 pl-5 text-gray-700"><li>Compare the year, kilometres, price and true bike location before travelling.</li><li>Inspect the motorcycle, test ride with permission and match chassis and engine numbers with the RC.</li><li>Check insurance, any active loan and the ownership-transfer plan before payment.</li></ul><Link href="/blog/used-bike-buying-checklist-bihar" className="mt-5 inline-block font-semibold text-orange-700 underline">Read the complete used-bike buying checklist</Link></section>
  </section>;
}
