import Link from "next/link";
import SiteImage from "@/components/SiteImage";
import { getPublicInventory } from "@/lib/publicInventory";
import { bikePath } from "@/lib/bikeUrls";
import { jsonLd, pageMetadata, SITE_URL } from "@/lib/seo";
import { bikeFullName } from "@/lib/bikeDisplay";
import { biharDistricts, districtSlug } from "@/lib/biharDistricts";

const collections = [
  ["royal-enfield", "Used Royal Enfield Bikes"], ["tvs", "Used TVS Bikes"],
  ["hero", "Used Hero Bikes"], ["yamaha", "Used Yamaha Bikes"],
  ["honda", "Used Honda Bikes"], ["bajaj", "Used Bajaj Bikes"],
  ["bikes-under-50000", "Bikes Under ₹50,000"], ["bikes-under-100000", "Bikes Under ₹1 Lakh"],
];

export const dynamic = "force-dynamic";
export const metadata = pageMetadata("Used Bikes Across Bihar | Second Hand Bike Prices & Photos", "Browse available used bikes and second hand bikes across Bihar. Compare real prices, photos, year, kilometres and location, then enquire with Old Bikes Hub.", "/used-bikes-bihar");

export default async function BiharInventory() {
  const bikes = (await getPublicInventory()).filter(bike => bike.status === "Available");
  const schema = { "@context": "https://schema.org", "@graph": [
    { "@type": "CollectionPage", name: "Used Bikes and Second Hand Bikes for Sale Across Bihar", url: SITE_URL + "/used-bikes-bihar", description: "Available used motorcycles and scooters for buyers across Bihar." },
    { "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: SITE_URL }, { "@type": "ListItem", position: 2, name: "Used Bikes Bihar", item: SITE_URL + "/used-bikes-bihar" }] },
  ] };
  return <section className="bg-gray-100 py-10"><div className="mx-auto max-w-7xl px-4">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(schema) }} />
    <div className="relative overflow-hidden rounded-3xl bg-black px-6 py-10 shadow-xl sm:px-10"><div className="pointer-events-none absolute -right-16 -top-16 h-52 w-52 rounded-full bg-orange-500/20 blur-3xl" /><h1 className="relative text-3xl font-black text-white sm:text-4xl">Second Hand Bikes for Sale Across Bihar</h1>
    <p className="relative mt-4 text-gray-300">Buyers from every city in Bihar can enquire about any listed bike. Each listing shows the bike’s actual location. Contact Old Bikes Hub to confirm availability, documents, inspection and transport arrangements before purchase.</p>
    <p className="relative mt-3 text-gray-300">Whether you are in Patna, Motihari, Gaya, Darbhanga, Bhagalpur, Purnia or another Bihar city, you can browse the same complete available inventory here.</p>
    <Link href="/buy-bikes" className="relative mt-5 inline-block rounded-xl bg-orange-500 px-5 py-3 font-bold text-white">Filter bikes by brand, model and budget</Link>
    <Link href="/used-bikes-muzaffarpur" className="relative ml-3 mt-5 inline-block rounded-xl border border-white/30 px-5 py-3 font-bold text-white">Second hand bikes in Muzaffarpur</Link></div>
    <nav className="mt-5 flex flex-wrap gap-3" aria-label="Popular used bike collections">
      {collections.map(([slug, label]) => <Link key={slug} href={`/used-bikes-bihar/${slug}`} className="rounded-full border border-orange-200 bg-orange-50 px-4 py-2 font-semibold text-orange-800">{label}</Link>)}
    </nav>
    <section className="mt-8 rounded-3xl bg-white p-6 shadow-lg" aria-labelledby="district-links-heading">
      <h2 id="district-links-heading" className="text-2xl font-black text-gray-900">Browse used bikes for every Bihar district</h2>
      <p className="mt-3 max-w-4xl leading-7 text-gray-700">Choose your district to view available second hand bikes and practical buying guidance. Every card shows the bike&apos;s actual location, so confirm inspection and collection details before travelling.</p>
      <div className="mt-5 flex flex-wrap gap-x-4 gap-y-3">
        {biharDistricts.map((district) => <Link key={district} href={`/used-bikes-bihar/${districtSlug(district)}`} className="font-semibold text-orange-700 underline underline-offset-4">Used bikes in {district}</Link>)}
      </div>
    </section>
    <h2 className="mt-8 text-2xl font-black text-gray-900">{bikes.length} available bikes</h2>
    <div className="mt-5 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {bikes.map(bike => <article key={bike.id} className="group overflow-hidden rounded-3xl bg-white shadow-lg transition hover:-translate-y-1 hover:shadow-xl">
        <Link href={bikePath(bike)}>
          <div className="relative h-56"><SiteImage src={bike.images[0] || bike.image || "/bike-placeholder.svg"} alt={`${bikeFullName(bike.brand, bike.name)} ${bike.year}`} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" className="object-cover" /></div>
          <div className="p-5"><h3 className="text-xl font-black text-gray-900">{bikeFullName(bike.brand, bike.name)} · {bike.year}</h3>
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
