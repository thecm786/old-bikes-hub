"use client";

import Link from "next/link";

interface Bike {
  id: string;
  slug: string;
  name: string;
  brand: string;
  price: string;
  year: string;
  km: string;
  location: string;
  image?: string;
}

interface RelatedBikesProps {
  bikes: Bike[];
  currentBikeId: string;
  brand: string;
}

export default function RelatedBikes({
  bikes,
  currentBikeId,
  brand,
}: RelatedBikesProps) {
  const relatedBikes = bikes
    .filter(
      (bike) =>
        bike.brand === brand &&
        bike.id !== currentBikeId
    )
    .slice(0, 6);

  if (relatedBikes.length === 0) return null;

  return (
    <section className="mt-16">
      <h2 className="mb-8 text-3xl font-bold">
        Related Bikes
      </h2>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {relatedBikes.map((bike) => (
          <div
            key={bike.id}
            className="overflow-hidden rounded-2xl bg-white shadow-lg transition hover:-translate-y-1 hover:shadow-2xl"
          >
            {bike.image ? (
              <img
                src={bike.image}
                alt={bike.name}
                className="h-52 w-full object-cover"
              />
            ) : (
              <div className="flex h-52 items-center justify-center bg-gray-200 text-6xl">
                🏍️
              </div>
            )}

            <div className="p-5">
              <h3 className="text-2xl font-bold">
                {bike.name}
              </h3>

              <p className="mt-2 text-2xl font-bold text-orange-500">
                ₹
                {Number(
                  bike.price
                ).toLocaleString("en-IN")}
              </p>

              <div className="mt-4 space-y-2 text-gray-600">
                <p>🏷️ {bike.brand}</p>
                <p>📅 {bike.year}</p>
                <p>🛣️ {bike.km} KM</p>
                <p>📍 {bike.location}</p>
              </div>

              <Link
                href={`/bike/${bike.slug}`}
                className="mt-6 block rounded-xl bg-black py-3 text-center font-bold text-white transition hover:bg-gray-800"
              >
                View Details
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}