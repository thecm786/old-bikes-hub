"use client";

import {
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  useSearchParams,
} from "next/navigation";

import {
  collection,
  getDocs,
  query,
  orderBy,
  limit,
  startAfter,
  QueryDocumentSnapshot,
  DocumentData,
} from "firebase/firestore";

import {
  Search,
  SlidersHorizontal,
  ShieldCheck,
  X,
} from "lucide-react";

import { db } from "@/firebase/firebase";

import BikeCard from "@/components/BikeCard";

import {
  bikes as defaultBikes,
} from "@/lib/bikes";

import type { BikeType } from "@/types/bike";

const BIHAR_SERVICE_AREAS = new Set(["araria", "arwal", "aurangabad", "banka", "begusarai", "bhagalpur", "bhojpur", "buxar", "darbhanga", "east champaran", "motihari", "gaya", "gopalganj", "jamui", "jehanabad", "kaimur", "katihar", "khagaria", "kishanganj", "lakhisarai", "madhepura", "madhubani", "munger", "muzaffarpur", "nalanda", "nawada", "patna", "purnia", "rohtas", "saharsa", "samastipur", "saran", "sheikhpura", "sheohar", "sitamarhi", "siwan", "supaul", "vaishali", "west champaran", "bettiah"]);

function BuyBikesContent() {


  const searchParams = useSearchParams();

  const selectedBrand =
    searchParams.get("brand") || "";

  const initialSearch =
    searchParams.get("search") || "";

  const [bikes, setBikes] =
    useState<BikeType[]>([]);

  const [allBrands, setAllBrands] =
    useState<string[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [loadingMore, setLoadingMore] =
    useState(false);

  const [search, setSearch] =
    useState(initialSearch);

  const [brand, setBrand] =
    useState(selectedBrand || "All");

  const [price, setPrice] =
    useState("All");

  const [year, setYear] =
    useState("All");

  const [filterOpen, setFilterOpen] =
    useState(false);

  const [lastDoc, setLastDoc] =
    useState<QueryDocumentSnapshot<DocumentData> | null>(
      null
    );

  const [hasMore, setHasMore] =
    useState(true);

  const loadMoreRef =
    useRef<HTMLDivElement | null>(null);

  const [previousQuery, setPreviousQuery] = useState({ selectedBrand, initialSearch });
  if (previousQuery.selectedBrand !== selectedBrand || previousQuery.initialSearch !== initialSearch) {
    setPreviousQuery({ selectedBrand, initialSearch });
    setBrand(selectedBrand || "All");
    setSearch(initialSearch);
  }

  useEffect(() => {
    let active = true;
    const bikesQuery = query(collection(db, "bikes"), orderBy("createdAt", "desc"), limit(20));
    getDocs(bikesQuery).then((snapshot) => {
      if (!active) return;
      const data = snapshot.docs.map((item) => ({ id: item.id, ...(item.data() as Omit<BikeType, "id">) }));
      setBikes(data);
      setLastDoc(snapshot.docs.at(-1) || null);
      setHasMore(snapshot.size === 20);
      setAllBrands(["All", ...Array.from(new Set([...defaultBikes, ...data].map((bike) => bike.brand))).sort()]);
    }).catch((error: unknown) => {
      if (!active) return;
      console.error(error);
      setBikes(defaultBikes.map((bike) => ({ ...bike, id: String(bike.id) })));
      setAllBrands(["All", ...Array.from(new Set(defaultBikes.map((bike) => bike.brand))).sort()]);
      setHasMore(false);
    }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  const fetchMoreBikes =
    useCallback(async () => {

      if (
        loading ||
        !lastDoc ||
        !hasMore ||
        loadingMore
      ) {
        return;
      }

      try {

        setLoadingMore(true);

        const bikesRef =
          collection(
            db,
            "bikes"
          );

        const nextQuery =
          query(

            bikesRef,

            orderBy(
              "createdAt",
              "desc"
            ),

            startAfter(
              lastDoc
            ),

            limit(20)

          );

        const snapshot =
          await getDocs(
            nextQuery
          );

        if (
          snapshot.empty
        ) {

          setHasMore(false);

          return;

        }

        const newBikes =
          snapshot.docs.map(
            (doc) => ({
              id: doc.id,
              ...(doc.data() as Omit<
                BikeType,
                "id"
              >),
            })
          );

        setBikes((prev) => {

          const merged = [

            ...prev,

            ...newBikes.map(
              (bike) => ({
                ...bike,
                id: String(
                  bike.id
                ),
              })
            ),

          ];

          return merged.filter(

            (
              bike,
              index,
              self
            ) =>

              index ===

              self.findIndex(
                (b) =>
                  b.id === bike.id
              )

          );

        });

        setLastDoc(

          snapshot.docs[
            snapshot.docs.length - 1
          ]

        );

        if (
          snapshot.docs.length < 20
        ) {

          setHasMore(false);

        }

      } catch (error) {

        console.error(error);

      } finally {

        setLoadingMore(false);

      }

    }, [

      loading,

      lastDoc,

      hasMore,

      loadingMore,

    ]);



  useEffect(() => {

    if (loading) return;

    const target =
      loadMoreRef.current;

    if (!target) return;

    const observer =
      new IntersectionObserver(

        (entries) => {

          if (

            entries[0]
              .isIntersecting &&

            hasMore &&

            !loadingMore &&

            !loading

          ) {

            fetchMoreBikes();

          }

        },

        {

          root: null,

          rootMargin:
            "500px",

          threshold: 0,

        }

      );

    observer.observe(
      target
    );

    return () => {

      observer.disconnect();

    };

  }, [

    fetchMoreBikes,

    hasMore,

    loadingMore,

    loading,

  ]);

  const filteredBikes =
    useMemo(() => {

      return bikes.filter(
        (bike) => {

          const text =
            search.toLowerCase();

          const citySearch = BIHAR_SERVICE_AREAS.has(text);

          const searchMatch =

            !text || citySearch ||

            bike.name
              ?.toLowerCase()
              .includes(text)

            ||

            bike.brand
              ?.toLowerCase()
              .includes(text)

            ||

            false;

          const brandMatch =

            brand === "All"

            ||

            bike.brand ===
              brand;

          let priceMatch =
            true;

          if (
            price ===
            "under1"
          ) {

            priceMatch =
              Number(
                bike.price
              ) < 100000;

          }

          if (
            price ===
            "1to2"
          ) {

            priceMatch =

              Number(
                bike.price
              ) >=
                100000 &&

              Number(
                bike.price
              ) <=
                200000;

          }

          if (
            price ===
            "above2"
          ) {

            priceMatch =
              Number(
                bike.price
              ) > 200000;

          }

          let yearMatch =
            true;

          if (
            year !== "All"
          ) {

            yearMatch =
              Number(
                bike.year
              ) >=
              Number(
                year
              );

          }

          return (

            searchMatch &&

            brandMatch &&

            priceMatch &&

            yearMatch

          );

        }

      );

    }, [

      bikes,

      search,

      brand,

      price,

      year,

    ]);

  if (loading) {

    return (

      <div className="flex min-h-screen items-center justify-center">

        <div className="text-center">

          <div
            className="
              mx-auto
              h-14
              w-14
              animate-spin
              rounded-full
              border-4
              border-orange-500
              border-t-transparent
            "
          />

          <p className="mt-4 font-bold">
            Loading Bikes...
          </p>

        </div>

      </div>

    );

  }

  return (

    <main
      className="
        min-h-screen
        bg-gray-100
        px-4
        py-8
      "
    >

      <section className="mx-auto mb-8 max-w-7xl" aria-labelledby="bihar-bikes-heading">
        <h1 id="bihar-bikes-heading" className="text-3xl font-black tracking-tight text-gray-900 sm:text-4xl">
          Buy Used Bikes Across Bihar
        </h1>
        <p className="mt-3 max-w-3xl leading-7 text-gray-600">
          Explore available second hand motorcycles from Old Bikes Hub. Filter by brand, compare prices and kilometres, and contact us to confirm documents and inspection details before buying.
        </p>
        <nav className="mt-4 flex flex-wrap gap-2" aria-label="Popular used bike brands">
          {["Royal Enfield", "TVS", "Honda", "Hero", "Yamaha", "Bajaj", "KTM"].map((brand) => (
            <a key={brand} href={`/buy-bikes?brand=${encodeURIComponent(brand)}`} className="rounded-full bg-white px-3 py-1.5 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-orange-500 hover:text-white">
              Used {brand} bikes
            </a>
          ))}
        </nav>
      </section>

      {/* HEADER */}

      <section
        className="
          mx-auto
          max-w-7xl
          rounded-3xl
          bg-gradient-to-r
          from-black
          via-gray-900
          to-orange-500
          px-6
          py-6
          text-white
          shadow-xl
          md:px-8
        "
      >

        <div
          className="
            flex
            flex-col
            gap-5
            md:flex-row
            md:items-center
            md:justify-between
          "
        >

          <div>

            <div
              className="
                flex
                items-center
                gap-2
                text-sm
                font-bold
                text-orange-300
              "
            >

              <ShieldCheck size={18} />

              Verified Used Bikes

            </div>

            <h2
              className="
                mt-2
                text-3xl
                font-black
                md:text-4xl
              "
            >
              Explore Used Bikes
            </h2>

            <p
              className="
                mt-2
                text-sm
                text-gray-300
              "
            >
              {filteredBikes.length} Bikes Available
            </p>

          </div>

          <div
            className="
              w-full
              md:max-w-sm
            "
          >

            <div
              className="
                flex
                items-center
                rounded-xl
                bg-white
                p-2
              "
            >

              <Search
                size={20}
                className="ml-2 text-gray-400"
              />

              <input
                value={search}
                onChange={(e) =>
                  setSearch(
                    e.target.value
                  )
                }
                placeholder="Search Bike..."
                className="
                  w-full
                  bg-transparent
                  px-3
                  py-2
                  text-black
                  outline-none
                "
              />

            </div>

          </div>

        </div>

      </section>

      {/* MOBILE FILTER BUTTON */}

      <button
        onClick={() =>
          setFilterOpen(true)
        }
        className="
          mt-6
          flex
          items-center
          gap-2
          rounded-xl
          bg-black
          px-5
          py-3
          font-bold
          text-white
          lg:hidden
        "
      >

        <SlidersHorizontal size={18} />

        Filters

      </button>

      <div
        className="
          mx-auto
          mt-6
          flex
          max-w-7xl
          flex-col
          gap-6
          lg:flex-row
        "
      >

        {/* SIDEBAR */}

        <aside
          className={`
            rounded-3xl
            bg-white
            p-6
            shadow-lg
            lg:block
            lg:w-72

            ${
              filterOpen
                ? "fixed left-5 right-5 top-20 z-50 max-h-[80vh] overflow-y-auto"
                : "hidden lg:block"
            }
          `}
        >

          <div
            className="
              flex
              items-center
              justify-between
            "
          >

            <h2
              className="
                text-2xl
                font-black
              "
            >
              Filters
            </h2>

            <button
              onClick={() =>
                setFilterOpen(false)
              }
              className="lg:hidden"
            >

              <X size={22} />

            </button>

          </div>

          {/* BRAND */}

          <div className="mt-6">

            <label className="font-bold">
              Brand
            </label>

            <select
              value={brand}
              onChange={(e) => {

                const value =
                  e.target.value;

                setBrand(value);

              }}
              className="
                mt-2
                w-full
                rounded-xl
                border
                p-3
              "
            >

              {allBrands.map((item) => (

                <option
                  key={item}
                  value={item}
                >
                  {item}
                </option>

              ))}

            </select>

          </div>

          {/* PRICE */}

          <div className="mt-5">

            <label className="font-bold">
              Price
            </label>

            <select
              value={price}
              onChange={(e) =>
                setPrice(e.target.value)
              }
              className="
                mt-2
                w-full
                rounded-xl
                border
                p-3
              "
            >

              <option value="All">
                All Price
              </option>

              <option value="under1">
                Below ₹1 Lakh
              </option>

              <option value="1to2">
                ₹1 - ₹2 Lakh
              </option>

              <option value="above2">
                Above ₹2 Lakh
              </option>

            </select>

          </div>

          {/* YEAR */}

          <div className="mt-5">

            <label className="font-bold">
              Year
            </label>

            <select
              value={year}
              onChange={(e) =>
                setYear(e.target.value)
              }
              className="
                mt-2
                w-full
                rounded-xl
                border
                p-3
              "
            >

              <option value="All">
                All Years
              </option>

              <option value="2024">
                2024+
              </option>

              <option value="2022">
                2022+
              </option>

              <option value="2020">
                2020+
              </option>

            </select>

          </div>

          {/* RESET */}

          <button
            onClick={() => {

              setBrand("All");

              setSearch("");

              setPrice("All");

              setYear("All");

            }}
            className="
              mt-8
              w-full
              rounded-xl
              bg-orange-500
              py-3
              font-black
              text-white
              hover:bg-orange-600
            "
          >

            Reset Filters

          </button>

        </aside>

        {/* BIKES GRID */}

        <section
          className="
            grid
            w-full
            gap-6
            sm:grid-cols-2
            xl:grid-cols-3
          "
        >

          {filteredBikes.map((bike) => (

            <BikeCard
              key={bike.id}
              id={String(bike.id)}
              slug={bike.slug}
              name={bike.name}
              brand={bike.brand}
              price={bike.price}
              year={String(bike.year)}
              km={String(bike.km)}
              location={bike.location}
              phone={bike.phone}
              image={bike.image}
              featured={bike.featured}
              verified={bike.verified}
              status={bike.status}
            />

          ))}

        </section>

      </div>

      {/* INFINITE SCROLL */}

      {hasMore && (

        <div
          ref={loadMoreRef}
          className="
            flex
            min-h-[120px]
            items-center
            justify-center
          "
        >

          {loadingMore && (

            <div
              className="
                h-12
                w-12
                animate-spin
                rounded-full
                border-4
                border-orange-500
                border-t-transparent
              "
            />

          )}

        </div>

      )}

      {/* EMPTY STATE */}

      {!loading &&
        filteredBikes.length === 0 && (

          <div
            className="
              mx-auto
              mt-10
              max-w-3xl
              rounded-3xl
              bg-white
              p-10
              text-center
              shadow-xl
            "
          >

            <div className="text-6xl">
              🏍️
            </div>

            <h2
              className="
                mt-4
                text-3xl
                font-black
              "
            >
              No Bikes Found
            </h2>

            <p
              className="
                mt-2
                text-gray-500
              "
            >
              Try changing your filters.
            </p>

          </div>

        )}

    </main>

  );

}

export default function BuyBikes() {

  return (

    <Suspense

      fallback={

        <div className="flex min-h-screen items-center justify-center">

          <div className="text-center">

            <div
              className="
                mx-auto
                h-14
                w-14
                animate-spin
                rounded-full
                border-4
                border-orange-500
                border-t-transparent
              "
            />

            <p className="mt-4 font-bold">
              Loading Bikes...
            </p>

          </div>

        </div>

      }

    >

      <BuyBikesContent />

    </Suspense>

  );

}
