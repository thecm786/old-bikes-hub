"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { collection, getDocs } from "firebase/firestore";
import { ArrowRight, Bike } from "lucide-react";

import { db } from "@/firebase/firebase";
import { bikes as defaultBikes } from "@/lib/bikes";

interface BikeData {
  id?: string | number;
  brand: string;
}

const brandLogos: Record<string, string> = {
  "Royal Enfield": "/brands/royal-enfield.png",
  Hero: "/brands/hero.png",
  Honda: "/brands/honda.png",
  TVS: "/brands/tvs.png",
  Bajaj: "/brands/bajaj.png",
  Yamaha: "/brands/yamaha.png",
  KTM: "/brands/ktm.png",
  Suzuki: "/brands/suzuki.png",
  Kawasaki: "/brands/kawasaki.png",
};

export default function PopularBrands() {
  const [bikes, setBikes] = useState<BikeData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBikes = async () => {
      try {
        const snapshot = await getDocs(collection(db, "bikes"));

        const firebaseBikes = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as BikeData),
        }));

        setBikes([...defaultBikes, ...firebaseBikes]);
      } catch (error) {
        console.log(error);
        setBikes(defaultBikes);
      } finally {
        setLoading(false);
      }
    };

    loadBikes();
  }, []);

  const brands = useMemo(() => {
    const map: Record<string, number> = {};

    bikes.forEach((bike) => {
      if (!bike.brand) return;

      map[bike.brand] = (map[bike.brand] || 0) + 1;
    });

    return Object.entries(map).sort((a, b) => b[1] - a[1]);
  }, [bikes]);

  if (loading) {
    return (
      <section className="bg-gray-50 py-20">
        <div className="mx-auto max-w-7xl px-5">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[1,2,3,4,5,6,7,8].map((item)=>(
              <div
                key={item}
                className="h-72 animate-pulse rounded-3xl bg-white"
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-gray-50 py-20">

      <div className="mx-auto max-w-7xl px-5">

        <div className="mb-14 text-center">

          <span
            className="
              rounded-full
              bg-orange-100
              px-5
              py-2
              text-sm
              font-bold
              text-orange-600
            "
          >
            Browse By Brand
          </span>

          <h2
            className="
              mt-5
              text-4xl
              font-black
              text-gray-900
              md:text-5xl
            "
          >
            Popular Used Bike Brands
          </h2>

          <p
            className="
              mt-4
              text-lg
              text-gray-500
            "
          >
            Choose your favourite brand and explore all available bikes.
          </p>

        </div>

        <div
          className="
            grid
            gap-7
            sm:grid-cols-2
            lg:grid-cols-4
          "
        >

          {brands.map(([brand, count]) => (
            <Link
              key={brand}
              href={`/buy-bikes?brand=${encodeURIComponent(brand)}`}
              className="
                group
                relative
                overflow-hidden
                rounded-[30px]
                border
                border-gray-100
                bg-white
                p-8
                text-center
                shadow-md
                transition-all
                duration-500
                hover:-translate-y-3
                hover:border-orange-300
                hover:shadow-[0_20px_60px_rgba(249,115,22,0.20)]
              "
            >
              {/* Top Orange Border */}

              <div
                className="
                  absolute
                  left-0
                  top-0
                  h-1
                  w-0
                  bg-gradient-to-r
                  from-orange-500
                  via-orange-400
                  to-yellow-400
                  transition-all
                  duration-500
                  group-hover:w-full
                "
              />

              {/* Logo */}

              <div
                className="
                  mx-auto
                  flex
                  h-28
                  w-28
                  items-center
                  justify-center
                  overflow-hidden
                  rounded-full
                  bg-white
                  ring-4
                  ring-orange-100
                  shadow-xl
                  transition-all
                  duration-500
                  group-hover:scale-105
                  group-hover:ring-orange-300
                  group-hover:shadow-orange-300/50
                "
              >
                {brandLogos[brand] ? (
                  <Image
                    src={brandLogos[brand]}
                    alt={brand}
                    width={96}
                    height={96}
                    className="
                      h-24
                      w-24
                      object-contain
                      scale-[1.55]
                      transition-all
                      duration-500
                      group-hover:scale-[1.75]
                      drop-shadow-xl
                      select-none
                      pointer-events-none
                    "
                  />
                ) : (
                  <Bike
                    size={58}
                    className="
                      text-orange-500
                      transition-transform
                      duration-500
                      group-hover:rotate-6
                    "
                  />
                )}
              </div>

              {/* Brand Name */}

              <h3
                className="
                  mt-7
                  text-2xl
                  font-black
                  text-gray-900
                  transition-colors
                  duration-300
                  group-hover:text-orange-500
                "
              >
                {brand}
              </h3>

              {/* Count */}

              <p
                className="
                  mt-3
                  text-base
                  text-gray-500
                "
              >
                🚲{" "}
                <span className="font-black text-orange-600">
                  {count}
                </span>{" "}
                Bikes Available
              </p>

              {/* Button */}

              <div
                className="
                  mt-7
                  inline-flex
                  items-center
                  gap-2
                  rounded-full
                  bg-black
                  px-6
                  py-3
                  font-bold
                  text-white
                  transition-all
                  duration-300
                  group-hover:bg-orange-500
                "
              >
                Explore Bikes

                <ArrowRight
                  size={18}
                  className="
                    transition-transform
                    duration-300
                    group-hover:translate-x-1
                  "
                />
              </div>
            </Link>
          ))}

        </div>

        {/* Bottom CTA */}

        <div
          className="
            mt-16
            overflow-hidden
            rounded-[32px]
            bg-gradient-to-r
            from-orange-500
            via-orange-600
            to-black
            p-10
            text-center
            text-white
            shadow-2xl
          "
        >
          <h3 className="text-3xl font-black md:text-4xl">
            Can&apos;t Find Your Favourite Brand?
          </h3>

          <p className="mx-auto mt-4 max-w-2xl text-orange-100">
            Browse our complete collection of verified used bikes from all
            major brands across India. New bikes are added every day.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/buy-bikes"
              className="
                inline-flex
                items-center
                gap-2
                rounded-full
                bg-white
                px-8
                py-4
                font-bold
                text-orange-600
                transition-all
                duration-300
                hover:scale-105
                hover:shadow-xl
              "
            >
              View All Bikes

              <ArrowRight size={18} />
            </Link>

            <Link
              href="/sell-bike"
              className="
                inline-flex
                items-center
                gap-2
                rounded-full
                border-2
                border-white
                px-8
                py-4
                font-bold
                text-white
                transition-all
                duration-300
                hover:bg-white
                hover:text-orange-600
              "
            >
              Sell Your Bike
            </Link>
          </div>
        </div>

      </div>

    </section>

  );
}
