import { notFound } from "next/navigation";
import Link from "next/link";
import SiteImage from "@/components/SiteImage";
import { getPublicInventory } from "@/lib/publicInventory";
import { bikePath } from "@/lib/bikeUrls";
import { pageMetadata } from "@/lib/seo";

const collections = {
  "royal-enfield": { brand: "Royal Enfield", title: "Used Royal Enfield Bikes for Sale in Bihar" },
  tvs: { brand: "TVS", title: "Used TVS Bikes for Sale in Bihar" },
  hero: { brand: "Hero", title: "Used Hero Bikes for Sale in Bihar" },
  yamaha: { brand: "Yamaha", title: "Used Yamaha Bikes for Sale in Bihar" },
  honda: { brand: "Honda", title: "Used Honda Bikes for Sale in Bihar" },
  bajaj: { brand: "Bajaj", title: "Used Bajaj Bikes for Sale in Bihar" },
  "bikes-under-50000": { maxPrice: 50000, title: "Used Bikes Under ₹50,000 in Bihar" },
  "bikes-under-100000": { maxPrice: 100000, title: "Used Bikes Under ₹1 Lakh in Bihar" },
} as const;

type Props = { params: Promise<{ collection: string }> };
export const dynamic = "force-dynamic";

function priceNumber(value: string | number) {
  return Number(String(value).replace(/[^\d.]/g, ""));
}

export async function generateMetadata({ params }: Props) {
  const { collection } = await params;
  const item = collections[collection as keyof typeof collections];
  if (!item) return { robots: { index: false } };
  return pageMetadata(item.title, `Browse live ${item.title.toLowerCase()}. View actual price, year, kilometres and location, then enquire from any Bihar city with Old Bikes Hub.`, `/used-bikes-bihar/${collection}`);
}

export default async function CollectionPage({ params }: Props) {
  const { collection } = await params;
  const item = collections[collection as keyof typeof collections];
  if (!item) notFound();
  const bikes = (await getPublicInventory()).filter(bike => bike.status === "Available" && (
    "brand" in item ? bike.brand.trim().toLowerCase() === item.brand.toLowerCase() : priceNumber(bike.price) > 0 && priceNumber(bike.price) <= item.maxPrice
  ));
  if (!bikes.length) notFound();
  return <section className="mx-auto max-w-7xl px-4 py-10">
    <nav aria-label="Breadcrumb" className="text-sm text-gray-600"><Link href="/used-bikes-bihar" className="underline">Used bikes across Bihar</Link> / {item.title}</nav>
    <h1 className="mt-4 text-3xl font-black">{item.title}</h1>
    <p className="mt-4 max-w-4xl text-gray-700">These are currently available listings from Old Bikes Hub. Buyers anywhere in Bihar can enquire about any bike. The card shows the bike’s actual location; contact us to confirm documents, inspection and transport arrangements.</p>
    <h2 className="mt-8 text-2xl font-bold">{bikes.length} live listings</h2>
    <div className="mt-5 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {bikes.map(bike => <article key={bike.id} className="overflow-hidden rounded-xl border bg-white">
        <Link href={bikePath(bike)}><div className="relative h-56"><SiteImage src={bike.images[0] || bike.image || "/bike-placeholder.svg"} alt={`${bike.brand} ${bike.name} ${bike.year}`} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" className="object-cover" /></div>
          <div className="p-5"><h2 className="text-xl font-bold">{bike.brand} {bike.name} · {bike.year}</h2><p className="mt-2 font-semibold">{String(bike.price).includes("₹") ? bike.price : `₹${priceNumber(bike.price).toLocaleString("en-IN")}`}</p><p>{bike.km} km · {bike.location || "Location on enquiry"}</p><span className="mt-3 inline-block text-orange-700 underline">View bike details</span></div>
        </Link>
      </article>)}
    </div>
    <Link href="/used-bikes-bihar" className="mt-8 inline-block font-semibold text-orange-700 underline">View all used bikes across Bihar</Link>
  </section>;
}
