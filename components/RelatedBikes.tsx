import SiteImage from "@/components/SiteImage";
import type { RelatedBike } from "@/lib/relatedBikes";
import { bikeFullName } from "@/lib/bikeDisplay";
import { bikePath } from "@/lib/bikeUrls";
import Link from "next/link";

interface RelatedBikesProps {
  bikes: RelatedBike[];
  heading: string;
}

function formatPrice(price: RelatedBike["price"]) {
  const amount = Number(String(price).replace(/[^\d.]/g, ""));
  return amount > 0 ? `₹${amount.toLocaleString("en-IN")}` : "Price on enquiry";
}

export default function RelatedBikes({ bikes, heading }: RelatedBikesProps) {
  if (bikes.length === 0) {
    return (
      <section className="mt-16 rounded-2xl bg-white p-6 shadow-sm" aria-labelledby="related-bikes-heading">
        <h2 id="related-bikes-heading" className="text-2xl font-bold">Explore more available used bikes</h2>
        <p className="mt-2 text-gray-600">Browse all live Old Bikes Hub listings to find another bike that fits your budget.</p>
        <Link href="/buy-bikes" className="mt-4 inline-flex rounded-xl bg-black px-5 py-3 font-bold text-white transition hover:bg-gray-800">
          Browse all available bikes
        </Link>
      </section>
    );
  }

  return (
    <section className="mt-16" aria-labelledby="related-bikes-heading">
      <h2 id="related-bikes-heading" className="text-3xl font-bold">{heading}</h2>
      <p className="mt-2 max-w-3xl text-gray-600">Compare these currently available listings before you enquire with Old Bikes Hub.</p>

      <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {bikes.map((bike) => {
          const name = bikeFullName(bike.brand, bike.name);
          return (
            <article key={bike.id} className="overflow-hidden rounded-2xl bg-white shadow-lg transition hover:-translate-y-1 hover:shadow-2xl">
              {bike.image ? (
                <SiteImage
                  width={640}
                  height={416}
                  sizes="(max-width: 768px) 100vw, 33vw"
                  src={bike.image}
                  alt={`${name}${bike.year ? ` ${bike.year}` : ""}${bike.location ? ` in ${bike.location}` : ""}`}
                  className="h-52 w-full object-cover"
                />
              ) : (
                <div className="flex h-52 items-center justify-center bg-gray-200 text-6xl" aria-label={`${name} photo unavailable`}>🏍️</div>
              )}

              <div className="p-5">
                <h3 className="text-2xl font-bold">{name}</h3>
                <p className="mt-2 text-2xl font-bold text-orange-500">{formatPrice(bike.price)}</p>
                <div className="mt-4 space-y-2 text-gray-600">
                  {bike.year && <p>📅 {bike.year}</p>}
                  {bike.km && <p>🛣️ {bike.km} KM</p>}
                  {bike.location && <p>📍 {bike.location}</p>}
                </div>
                <Link
                  href={bikePath(bike)}
                  aria-label={`View details for ${name}`}
                  className="mt-6 block rounded-xl bg-black py-3 text-center font-bold text-white transition hover:bg-gray-800"
                >
                  View Details
                </Link>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
