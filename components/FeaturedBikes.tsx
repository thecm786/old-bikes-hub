"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  MapPin,
  Calendar,
  Gauge,
  Star,
} from "lucide-react";

import { db } from "@/firebase/firebase";
import {
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";

import SectionTitle from "./SectionTitle";
import WishlistButton from "./WishlistButton";
import type { BikeType } from "@/types/bike";

type StoredBike = BikeType & { id: string };

export default function FeaturedBikes() {
  const [bikes, setBikes] = useState<StoredBike[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedBikes = async () => {
      try {
        const q = query(
          collection(db, "bikes"),
          where("featured", "==", true)
        );

        const snapshot = await getDocs(q);

        const bikeList = snapshot.docs.map((doc): StoredBike => ({
          id: doc.id,
          ...(doc.data() as Omit<BikeType, "id">),
        }));

        setBikes(bikeList);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedBikes();
  }, []);

  if (loading || bikes.length === 0) return null;

  return (
    <section className="bg-gray-100 py-20">
      <div className="mx-auto max-w-7xl px-6">
        <SectionTitle
          title="🔥 Featured Bikes"
          subtitle="Premium bikes handpicked for you"
        />

        <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {bikes.map((bike) => (
            <div
              key={bike.id}
              className="group overflow-hidden rounded-3xl bg-white shadow-lg transition duration-300 hover:-translate-y-2 hover:shadow-2xl"
            >
              {/* Image */}
              <div className="relative h-64 overflow-hidden">
                {bike.image ? (
                  <Image
                    src={bike.image}
                    alt={bike.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition duration-500 group-hover:scale-110"
                  />
                ) : (
                  <div className="flex h-64 items-center justify-center bg-gray-200 text-7xl">
                    🏍️
                  </div>
                )}

                {/* Featured Badge */}
                <span className="absolute left-4 top-4 flex items-center gap-2 rounded-full bg-orange-500 px-3 py-2 text-xs font-bold text-white shadow-lg">
                  <Star size={14} fill="white" />
                  Featured
                </span>

                {/* Wishlist */}
                <div className="absolute right-4 top-4">
                  <WishlistButton bikeId={bike.id} />
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-900">
                  {bike.name}
                </h3>

                <p className="mt-3 text-3xl font-extrabold text-orange-500">
                  ₹{Number(bike.price).toLocaleString("en-IN")}
                </p>

                <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center gap-2 rounded-xl bg-gray-100 p-3">
                    <Calendar
                      size={18}
                      className="text-orange-500"
                    />
                    <span>{bike.year}</span>
                  </div>

                  <div className="flex items-center gap-2 rounded-xl bg-gray-100 p-3">
                    <Gauge
                      size={18}
                      className="text-orange-500"
                    />
                    <span>{bike.km} KM</span>
                  </div>

                  <div className="col-span-2 flex items-center gap-2 rounded-xl bg-gray-100 p-3">
                    <MapPin
                      size={18}
                      className="text-orange-500"
                    />
                    <span>{bike.location}</span>
                  </div>
                </div>

                <div className="mt-5">
                  <span className="rounded-full bg-orange-100 px-4 py-2 text-sm font-semibold text-orange-600">
                    {bike.brand}
                  </span>
                </div>

                <Link
                  href={`/bike/${bike.slug}`}
                  className="mt-6 block rounded-xl bg-black py-4 text-center font-bold text-white transition hover:bg-orange-500"
                >
                  View Details →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
