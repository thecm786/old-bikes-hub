import Link from "next/link";
import SiteImage from "@/components/SiteImage";
import { getPublicInventory } from "@/lib/publicInventory";
import { bikePath } from "@/lib/bikeUrls";
import { pageMetadata } from "@/lib/seo";

const collections = [
  ["royal-enfield", "Used Royal Enfield Bikes"], ["tvs", "Used TVS Bikes"],
  ["hero", "Used Hero Bikes"], ["yamaha", "Used Yamaha Bikes"],
  ["honda", "Used Honda Bikes"], ["bajaj", "Used Bajaj Bikes"],
  ["bikes-under-50000", "Bikes Under ₹50,000"], ["bikes-under-100000", "Bikes Under ₹1 Lakh"],
];

export const dynamic = "force-dynamic";
export const metadata = pageMetadata("Second Hand Bikes for Sale Across Bihar", "Browse available used bikes across Bihar with actual prices, photos, kilometres and locations. Enquire from any Bihar city with Old Bikes Hub.", "/used-bikes-bihar");

export default async function BiharInventory() {
  const bikes = (await getPublicInventory()).filter(bike => bike.status === "Available");
  return <section className="mx-auto max-w-7xl px-4 py-10">
    <h1 className="text-3xl font-black">Second Hand Bikes for Sale Across Bihar</h1>
    <p className="mt-4 text-gray-700">Buyers from every city in Bihar can enquire about any listed bike. Each listing shows the bike’s actual location. Contact Old Bikes Hub to confirm availability, documents, inspection and transport arrangements before purchase.</p>
    <p className="mt-3 text-gray-700">Whether you are in Patna, Motihari, Gaya, Darbhanga, Bhagalpur, Purnia or another Bihar city, you can browse the same complete available inventory here.</p>
    <Link href="/buy-bikes" className="mt-4 inline-block font-semibold text-orange-700 underline">Filter bikes by brand, model and budget</Link>
    <nav className="mt-5 flex flex-wrap gap-3" aria-label="Popular used bike collections">
      {collections.map(([slug, label]) => <Link key={slug} href={`/used-bikes-bihar/${slug}`} className="rounded-full border border-orange-200 bg-orange-50 px-4 py-2 font-semibold text-orange-800">{label}</Link>)}
    </nav>
    <h2 className="mt-8 text-2xl font-bold">{bikes.length} available bikes</h2>
    <div className="mt-5 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {bikes.map(bike => <article key={bike.id} className="overflow-hidden rounded-xl border bg-white">
        <Link href={bikePath(bike)}>
          <div className="relative h-56"><SiteImage src={bike.images[0] || bike.image || "/bike-placeholder.svg"} alt={`${bike.brand} ${bike.name} ${bike.year}`} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" className="object-cover" /></div>
          <div className="p-5"><h3 className="text-xl font-bold">{bike.brand} {bike.name} · {bike.year}</h3>
            <p className="mt-2 font-semibold">{String(bike.price).includes("₹") ? bike.price : `₹${Number(bike.price).toLocaleString("en-IN")}`}</p>
            <p>{bike.km} km · Location: {bike.location || "Confirm with seller"}</p>
            <p className="mt-2 text-sm text-gray-600">Enquiries welcome from every Bihar city</p>
            <span className="mt-3 inline-block text-orange-700 underline">View bike details</span>
          </div>
        </Link>
      </article>)}
    </div>
    {!bikes.length && <p className="mt-5">No available listings at the moment. Contact us for upcoming bikes.</p>}
    <Link href="/contact" className="mt-8 inline-block rounded-lg bg-orange-600 px-5 py-3 font-bold text-white">Contact Old Bikes Hub</Link>
  </section>;
}
