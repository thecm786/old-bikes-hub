"use client";

import { useEffect, useMemo, useState } from "react";

import {
  collection,
  doc,
  onSnapshot,
  query,
  updateDoc,
  where,
} from "firebase/firestore";

import { db } from "@/firebase/firebase";

import {
  Bike as BikeIcon,
  Calendar,
  CheckCircle2,
  Gauge,
  IndianRupee,
  Loader2,
  MapPin,
  Search,
  Star,
} from "lucide-react";

type Bike = {
  id: string;
  name?: string;
  brand?: string;
  model?: string;
  price?: string | number;
  year?: string | number;
  km?: string | number;
  location?: string;
  image?: string;
  images?: string[];
  featured?: boolean;
  verified?: boolean;
  status?: string;
};

export default function FeaturedBikesPage() {
  const [bikes, setBikes] = useState<Bike[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  /* ---------------------------------------------
     FETCH ONLY FEATURED BIKES
  --------------------------------------------- */

  useEffect(() => {
    const bikesQuery = query(
      collection(db, "bikes"),
      where("featured", "==", true)
    );

    const unsubscribe = onSnapshot(
      bikesQuery,
      (snapshot) => {
        const data: Bike[] = snapshot.docs.map((item) => ({
          id: item.id,
          ...(item.data() as Omit<Bike, "id">),
        }));

        setBikes(data);
        setLoading(false);
      },
      (error) => {
        console.error("Featured bikes error:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  /* ---------------------------------------------
     REMOVE FROM FEATURED
  --------------------------------------------- */

  const removeFromFeatured = async (bikeId: string) => {
    try {
      setUpdatingId(bikeId);

      await updateDoc(doc(db, "bikes", bikeId), {
        featured: false,
      });
    } catch (error) {
      console.error("Remove featured failed:", error);
      alert("Failed to remove bike from featured.");
    } finally {
      setUpdatingId(null);
    }
  };

  /* ---------------------------------------------
     SEARCH
  --------------------------------------------- */

  const filteredBikes = useMemo(() => {
    const text = search.trim().toLowerCase();

    if (!text) {
      return bikes;
    }

    return bikes.filter((bike) => {
      return (
        bike.name?.toLowerCase().includes(text) ||
        bike.brand?.toLowerCase().includes(text) ||
        bike.model?.toLowerCase().includes(text) ||
        bike.location?.toLowerCase().includes(text)
      );
    });
  }, [bikes, search]);

  /* ---------------------------------------------
     LOADING
  --------------------------------------------- */

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-100">
        <div className="flex items-center gap-3 rounded-2xl bg-white px-6 py-5 shadow-lg">
          <Loader2
            size={24}
            className="animate-spin text-orange-500"
          />

          <span className="font-bold text-gray-700">
            Loading Featured Bikes...
          </span>
        </div>
      </main>
    );
  }

  /* ---------------------------------------------
     PAGE
  --------------------------------------------- */

  return (
    <main className="min-h-screen bg-gray-100 p-5 md:p-8">

      {/* HEADER */}

      <section
        className="
          mb-8
          overflow-hidden
          rounded-3xl
          bg-gradient-to-r
          from-black
          via-gray-900
          to-orange-600
          p-6
          text-white
          shadow-xl
          md:p-8
        "
      >
        <div
          className="
            flex
            flex-col
            justify-between
            gap-6
            lg:flex-row
            lg:items-center
          "
        >
          <div>
            <p className="mb-2 text-sm font-bold uppercase tracking-widest text-orange-400">
              Old Bikes Hub Admin
            </p>

            <h1 className="flex items-center gap-3 text-3xl font-black md:text-4xl">
              Featured Bikes

              <Star
                size={32}
                className="fill-orange-500 text-orange-500"
              />
            </h1>

            <p className="mt-2 max-w-xl text-sm text-gray-300 md:text-base">
              Manage bikes currently featured on Old Bikes Hub.
            </p>
          </div>

          {/* FEATURED COUNT */}

          <div className="rounded-2xl bg-orange-500 px-6 py-5 shadow-lg">
            <p className="text-sm font-bold text-orange-100">
              Total Featured
            </p>

            <p className="mt-1 text-4xl font-black">
              {bikes.length}
            </p>
          </div>
        </div>
      </section>

      {/* SEARCH */}

      <section className="mb-8 rounded-3xl bg-white p-5 shadow-lg md:p-6">
        <div className="relative">
          <Search
            size={20}
            className="
              absolute
              left-4
              top-1/2
              -translate-y-1/2
              text-gray-400
            "
          />

          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search featured bike, brand, model, location..."
            className="
              w-full
              rounded-2xl
              border
              border-gray-200
              bg-gray-50
              py-4
              pl-12
              pr-4
              text-gray-800
              outline-none
              transition
              focus:border-orange-500
              focus:bg-white
              focus:ring-2
              focus:ring-orange-500/20
            "
          />
        </div>
      </section>

      {/* EMPTY STATE */}

      {filteredBikes.length === 0 && (
        <section className="rounded-3xl bg-white p-12 text-center shadow-lg">
          <div
            className="
              mx-auto
              mb-5
              flex
              h-20
              w-20
              items-center
              justify-center
              rounded-full
              bg-gray-100
            "
          >
            <Star
              size={36}
              className="text-gray-400"
            />
          </div>

          <h2 className="text-2xl font-black text-gray-800">
            No Featured Bikes
          </h2>

          <p className="mt-2 text-gray-500">
            There are currently no bikes marked as featured.
          </p>
        </section>
      )}

      {/* BIKE GRID */}

      {filteredBikes.length > 0 && (
        <div
          className="
            grid
            gap-6
            md:grid-cols-2
            xl:grid-cols-3
          "
        >
          {filteredBikes.map((bike) => {
            const bikeImage =
              bike.image ||
              bike.images?.[0] ||
              "";

            const isUpdating =
              updatingId === bike.id;

            return (
              <article
                key={bike.id}
                className="
                  group
                  overflow-hidden
                  rounded-3xl
                  bg-white
                  shadow-lg
                  ring-2
                  ring-orange-500
                  transition
                  hover:-translate-y-1
                  hover:shadow-2xl
                "
              >

                {/* IMAGE */}

                <div className="relative h-56 overflow-hidden bg-gray-100">
                  {bikeImage ? (
                    <img
                      src={bikeImage}
                      alt={
                        bike.name ||
                        `${bike.brand || ""} ${bike.model || ""}`
                      }
                      className="
                        h-full
                        w-full
                        object-cover
                        transition
                        duration-500
                        group-hover:scale-105
                      "
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <BikeIcon
                        size={55}
                        className="text-gray-300"
                      />
                    </div>
                  )}

                  {/* FEATURED BADGE */}

                  <div
                    className="
                      absolute
                      left-4
                      top-4
                      flex
                      items-center
                      gap-2
                      rounded-full
                      bg-orange-500
                      px-3
                      py-2
                      text-xs
                      font-black
                      text-white
                      shadow-lg
                    "
                  >
                    <Star
                      size={15}
                      className="fill-white"
                    />

                    FEATURED
                  </div>

                  {/* VERIFIED */}

                  {bike.verified && (
                    <div
                      className="
                        absolute
                        right-4
                        top-4
                        flex
                        items-center
                        gap-1
                        rounded-full
                        bg-green-500
                        px-3
                        py-2
                        text-xs
                        font-bold
                        text-white
                        shadow-lg
                      "
                    >
                      <CheckCircle2 size={14} />

                      Verified
                    </div>
                  )}
                </div>

                {/* CONTENT */}

                <div className="p-5">

                  <h2
                    className="
                      line-clamp-1
                      text-xl
                      font-black
                      text-gray-900
                    "
                  >
                    {bike.name ||
                      `${bike.brand || ""} ${bike.model || ""}`}
                  </h2>

                  {/* PRICE */}

                  <p
                    className="
                      mt-2
                      flex
                      items-center
                      gap-1
                      text-2xl
                      font-black
                      text-orange-500
                    "
                  >
                    <IndianRupee
                      size={20}
                      strokeWidth={3}
                    />

                    {Number(
                      bike.price || 0
                    ).toLocaleString("en-IN")}
                  </p>

                  {/* DETAILS */}

                  <div
                    className="
                      mt-4
                      grid
                      grid-cols-2
                      gap-3
                      text-sm
                      text-gray-600
                    "
                  >
                    <div className="flex items-center gap-2">
                      <Calendar
                        size={16}
                        className="text-orange-500"
                      />

                      {bike.year || "N/A"}
                    </div>

                    <div className="flex items-center gap-2">
                      <Gauge
                        size={16}
                        className="text-orange-500"
                      />

                      {bike.km || "0"} KM
                    </div>

                    <div
                      className="
                        col-span-2
                        flex
                        items-center
                        gap-2
                      "
                    >
                      <MapPin
                        size={16}
                        className="text-orange-500"
                      />

                      <span className="truncate">
                        {bike.location ||
                          "Location not available"}
                      </span>
                    </div>
                  </div>

                  {/* STATUS */}

                  <div
                    className="
                      mt-5
                      flex
                      items-center
                      justify-between
                    "
                  >
                    <span
                      className={`
                        rounded-full
                        px-3
                        py-1
                        text-xs
                        font-bold
                        ${
                          bike.status === "Available"
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-600"
                        }
                      `}
                    >
                      {bike.status || "Available"}
                    </span>

                    <span className="text-xs font-bold text-orange-500">
                      Featured Listing
                    </span>
                  </div>

                  {/* REMOVE BUTTON */}

                  <button
                    type="button"
                    disabled={isUpdating}
                    onClick={() =>
                      removeFromFeatured(bike.id)
                    }
                    className="
                      mt-5
                      flex
                      w-full
                      items-center
                      justify-center
                      gap-2
                      rounded-xl
                      bg-gray-900
                      py-3
                      font-black
                      text-white
                      transition
                      hover:bg-gray-800
                      disabled:cursor-not-allowed
                      disabled:opacity-60
                    "
                  >
                    {isUpdating ? (
                      <Loader2
                        size={18}
                        className="animate-spin"
                      />
                    ) : (
                      <Star
                        size={18}
                        className="
                          fill-orange-500
                          text-orange-500
                        "
                      />
                    )}

                    {isUpdating
                      ? "Removing..."
                      : "Remove from Featured"}
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </main>
  );
}