"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

import {
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";

import { db } from "@/firebase/firebase";

export default function BikeDetailsPage() {
  const params = useParams();

  const slug = params.slug as string;

  const [bike, setBike] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBike = async () => {
      try {
        const q = query(
          collection(db, "bikes"),
          where("slug", "==", slug)
        );

        const snapshot = await getDocs(q);

        if (!snapshot.empty) {
          setBike({
            id: snapshot.docs[0].id,
            ...snapshot.docs[0].data(),
          });
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchBike();
    }
  }, [slug]);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <h1 className="text-3xl font-bold">
          Loading Bike...
        </h1>
      </main>
    );
  }

  if (!bike) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <h1 className="text-3xl font-bold">
          Bike Not Found
        </h1>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100 py-10">

      <div className="mx-auto max-w-7xl px-6">

        <Link
          href="/buy-bikes"
          className="mb-8 inline-block rounded-lg bg-black px-5 py-3 text-white"
        >
          ← Back to Bikes
        </Link>

        <div className="grid gap-10 lg:grid-cols-2">

          {/* Image */}

          <div>

            {bike.image ? (
              <img
                src={bike.image}
                alt={bike.name}
                className="h-[500px] w-full rounded-3xl bg-white object-cover shadow-xl"
              />
            ) : (
              <div className="flex h-[500px] items-center justify-center rounded-3xl bg-white text-9xl shadow-xl">
                🏍️
              </div>
            )}

          </div>

          {/* Details */}

          <div>

            {bike.featured && (
              <span className="rounded-full bg-yellow-400 px-4 py-2 font-bold">
                ⭐ Featured Bike
              </span>
            )}

            <h1 className="mt-4 text-5xl font-bold">
              {bike.name}
            </h1>

            <h2 className="mt-4 text-4xl font-bold text-orange-500">
              ₹{Number(bike.price).toLocaleString("en-IN")}
            </h2>

            <div className="mt-8 grid gap-4 rounded-2xl bg-white p-6 shadow-lg">

              <div className="flex justify-between border-b pb-3">
                <span className="font-semibold">
                  Brand
                </span>

                <span>{bike.brand}</span>
              </div>

              <div className="flex justify-between border-b pb-3">
                <span className="font-semibold">
                  Year
                </span>

                <span>{bike.year}</span>
              </div>

              <div className="flex justify-between border-b pb-3">
                <span className="font-semibold">
                  KM Driven
                </span>

                <span>{bike.km} KM</span>
              </div>

              <div className="flex justify-between border-b pb-3">
                <span className="font-semibold">
                  Owner
                </span>

                <span>{bike.owner}</span>
              </div>

              <div className="flex justify-between">
                <span className="font-semibold">
                  Location
                </span>

                <span>{bike.location}</span>
              </div>

            </div>

            <div className="mt-8 rounded-2xl bg-white p-6 shadow-lg">

              <h3 className="mb-3 text-2xl font-bold">
                Description
              </h3>

              <p className="leading-8 text-gray-700">
                {bike.description || "No description available."}
              </p>

            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-2">

              <a
                href="tel:+919999999999"
                className="rounded-xl bg-black py-4 text-center text-lg font-bold text-white transition hover:bg-gray-800"
              >
                📞 Call Seller
              </a>

              <a
                href={`https://wa.me/919999999999?text=Hi, I'm interested in ${encodeURIComponent(
                  bike.name
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl bg-green-600 py-4 text-center text-lg font-bold text-white transition hover:bg-green-700"
              >
                💬 WhatsApp Seller
              </a>

            </div>

          </div>

        </div>

      </div>

    </main>
  );
}