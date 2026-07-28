"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Search } from "lucide-react";

export default function Hero() {
  const router = useRouter();

  const [search, setSearch] = useState("");

  const handleSearch = () => {
    if (!search.trim()) {
      router.push("/buy-bikes");
      return;
    }

    router.push(
      `/buy-bikes?search=${encodeURIComponent(search)}`
    );
  };

  return (
    <section
      className="relative flex min-h-[85vh] items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=1600&q=80')",
      }}
    >
      {/* Overlay */}

      <div className="absolute inset-0 bg-black/70"></div>

      {/* Content */}

      <div className="relative z-10 mx-auto max-w-6xl px-6 text-center text-white">

        <span className="rounded-full bg-orange-500 px-5 py-2 text-sm font-semibold">
          India's Trusted Used Bike Marketplace
        </span>

        <h1 className="mt-8 text-5xl font-extrabold leading-tight md:text-7xl">
          Find Your
          <span className="text-orange-500">
            {" "}
            Dream Bike
          </span>
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-300 md:text-xl">
          Buy, Sell & Exchange Verified Used Bikes at the
          Best Prices Across India.
        </p>

        {/* Search Box */}

        <div className="mx-auto mt-10 flex max-w-3xl flex-col gap-4 rounded-2xl bg-white p-4 shadow-2xl md:flex-row">

          <input
            type="text"
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearch();
              }
            }}
            placeholder="Search Brand, Model or City..."
            className="flex-1 rounded-xl border border-gray-300 px-5 py-4 text-black outline-none focus:border-orange-500"
          />

          <button
            onClick={handleSearch}
            className="flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-8 py-4 font-bold text-white transition hover:bg-orange-600"
          >
            <Search size={20} />
            Search
          </button>

        </div>

        {/* CTA */}

        <div className="mt-8 flex flex-col justify-center gap-4 md:flex-row">

          <Link
            href="/buy-bikes"
            className="rounded-xl bg-orange-500 px-8 py-4 font-bold text-white transition hover:bg-orange-600"
          >
            Buy Used Bikes
          </Link>

          <Link
            href="/sell-bike"
            className="rounded-xl border-2 border-white px-8 py-4 font-bold text-white transition hover:bg-white hover:text-black"
          >
            Sell Your Bike
          </Link>

        </div>

        {/* Stats */}

        <div className="mt-16 grid grid-cols-2 gap-6 md:grid-cols-4">

          <div className="rounded-2xl bg-white/10 p-6 backdrop-blur">
            <h2 className="text-3xl font-bold text-orange-500">
              500+
            </h2>
            <p className="mt-2 text-gray-300">
              Used Bikes
            </p>
          </div>

          <div className="rounded-2xl bg-white/10 p-6 backdrop-blur">
            <h2 className="text-3xl font-bold text-orange-500">
              50+
            </h2>
            <p className="mt-2 text-gray-300">
              Brands
            </p>
          </div>

          <div className="rounded-2xl bg-white/10 p-6 backdrop-blur">
            <h2 className="text-3xl font-bold text-orange-500">
              1000+
            </h2>
            <p className="mt-2 text-gray-300">
              Happy Customers
            </p>
          </div>

          <div className="rounded-2xl bg-white/10 p-6 backdrop-blur">
            <h2 className="text-3xl font-bold text-orange-500">
              24×7
            </h2>
            <p className="mt-2 text-gray-300">
              Customer Support
            </p>
          </div>

        </div>

      </div>
    </section>
  );
}