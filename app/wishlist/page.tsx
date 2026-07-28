"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { collection, getDocs } from "firebase/firestore";

import { db } from "@/firebase/firebase";
import { getWishlist } from "@/lib/wishlist";

export default function WishlistPage() {
  const [bikes, setBikes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const snapshot = await getDocs(collection(db, "bikes"));

        const allBikes = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        const wishlist = getWishlist();

        const savedBikes = allBikes.filter((bike) =>
          wishlist.includes(bike.id)
        );

        setBikes(savedBikes);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();

    window.addEventListener("wishlistUpdated", fetchWishlist);

    return () => {
      window.removeEventListener(
        "wishlistUpdated",
        fetchWishlist
      );
    };
  }, []);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <h1 className="text-3xl font-bold">
          Loading Wishlist...
        </h1>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100 py-16">
      <div className="mx-auto max-w-7xl px-6">
        <h1 className="mb-10 text-4xl font-bold">
          ❤️ My Wishlist
        </h1>

        {bikes.length === 0 ? (
          <div className="rounded-2xl bg-white p-16 text-center shadow-lg">
            <div className="text-7xl">💔</div>

            <h2 className="mt-5 text-3xl font-bold">
              Wishlist Empty
            </h2>

            <p className="mt-3 text-gray-500">
              Save your favourite bikes here.
            </p>

            <Link
              href="/buy-bikes"
              className="mt-8 inline-block rounded-xl bg-orange-500 px-8 py-4 font-bold text-white"
            >
              Browse Bikes
            </Link>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {bikes.map((bike) => (
              <div
                key={bike.id}
                className="overflow-hidden rounded-3xl bg-white shadow-lg transition hover:-translate-y-2 hover:shadow-2xl"
              >
                {bike.image ? (
                  <img
                    src={bike.image}
                    alt={bike.name}
                    className="h-64 w-full object-cover"
                  />
                ) : (
                  <div className="flex h-64 items-center justify-center bg-gray-200 text-7xl">
                    🏍️
                  </div>
                )}

                <div className="p-6">
                  <h2 className="text-2xl font-bold">
                    {bike.name}
                  </h2>

                  <p className="mt-2 text-3xl font-bold text-orange-500">
                    ₹{Number(bike.price).toLocaleString("en-IN")}
                  </p>

                  <p className="mt-3 text-gray-600">
                    📍 {bike.location}
                  </p>

                  <Link
                    href={`/bike/${bike.slug}`}
                    className="mt-6 block rounded-xl bg-black py-4 text-center font-bold text-white hover:bg-orange-500"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}