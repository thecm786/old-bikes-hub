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
  return <section className="bg-gray-100 py-10"><div className="mx-auto max-w-7xl px-4">
    <div className="relative overflow-hidden rounded-3xl bg-black px-6 py-10 shadow-xl sm:px-10"><div className="pointer-events-none absolute -right-16 -top-16 h-52 w-52 rounded-full bg-orange-500/20 blur-3xl" /><h1 className="relative text-3xl font-black text-white sm:text-4xl">Second Hand Bikes for Sale Across Bihar</h1>
    <p className="relative mt-4 text-gray-300">Buyers from every city in Bihar can enquire about any listed bike. Each listing shows the bike’s actual location. Contact Old Bikes Hub to confirm availability, documents, inspection and transport arrangements before purchase.</p>
    <p className="relative mt-3 text-gray-300">Whether you are in Patna, Motihari, Gaya, Darbhanga, Bhagalpur, Purnia or another Bihar city, you can browse the same complete available inventory here.</p>
    <Link href="/buy-bikes" className="relative mt-5 inline-block rounded-xl bg-orange-500 px-5 py-3 font-bold text-white">Filter bikes by brand, model and budget</Link>
    <Link href="/used-bikes-muzaffarpur" className="relative ml-3 mt-5 inline-block rounded-xl border border-white/30 px-5 py-3 font-bold text-white">Second hand bikes in Muzaffarpur</Link></div>
    <nav className="mt-5 flex flex-wrap gap-3" aria-label="Popular used bike collections">
      {collections.map(([slug, label]) => <Link key={slug} href={`/used-bikes-bihar/${slug}`} className="rounded-full border border-orange-200 bg-orange-50 px-4 py-2 font-semibold text-orange-800">{label}</Link>)}
    </nav>
    <h2 className="mt-8 text-2xl font-black text-gray-900">{bikes.length} available bikes</h2>
    <div className="mt-5 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {bikes.map(bike => <article key={bike.id} className="group overflow-hidden rounded-3xl bg-white shadow-lg transition hover:-translate-y-1 hover:shadow-xl">
        <Link href={bikePath(bike)}>
          <div className="relative h-56"><SiteImage src={bike.images[0] || bike.image || "/bike-placeholder.svg"} alt={`${bike.brand} ${bike.name} ${bike.year}`} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" className="object-cover" /></div>
          <div className="p-5"><h3 className="text-xl font-black text-gray-900">{bike.brand} {bike.name} · {bike.year}</h3>
            <p className="mt-2 text-xl font-black text-orange-500">{String(bike.price).includes("₹") ? bike.price : `₹${Number(bike.price).toLocaleString("en-IN")}`}</p>
            <p className="mt-2 text-gray-600">{bike.km} km · Location: {bike.location || "Confirm with seller"}</p>
            <p className="mt-2 text-sm text-gray-600">Enquiries welcome from every Bihar city</p>
            <span className="mt-4 inline-block rounded-xl bg-black px-4 py-2 font-bold text-white transition group-hover:bg-orange-500">View bike details</span>
          </div>
        </Link>
      </article>)}
    </div>
    {!bikes.length && <p className="mt-5">No available listings at the moment. Contact us for upcoming bikes.</p>}
    <Link href="/contact" className="mt-8 inline-block rounded-xl bg-orange-500 px-5 py-3 font-bold text-white">Contact Old Bikes Hub</Link>
  </div></section>;
}
