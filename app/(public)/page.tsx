import dynamic from "next/dynamic";
import { jsonLd } from "@/lib/seo";

const Hero = dynamic(
  () => import("@/components/Hero"),
  {
    loading: () => (
      <div className="h-[520px] animate-pulse rounded-3xl bg-gray-200" />
    ),
  }
);

const FeaturedBikes = dynamic(
  () => import("@/components/FeaturedBikes"),
  {
    loading: () => (
      <div className="mx-auto mt-10 h-[500px] max-w-7xl animate-pulse rounded-3xl bg-gray-200" />
    ),
  }
);

const PopularBrands = dynamic(
  () => import("@/components/PopularBrands"),
  {
    loading: () => (
      <div className="mx-auto mt-10 h-[250px] max-w-7xl animate-pulse rounded-3xl bg-gray-200" />
    ),
  }
);

const LatestBikes = dynamic(
  () => import("@/components/LatestBikes"),
  {
    loading: () => (
      <div className="mx-auto mt-10 h-[500px] max-w-7xl animate-pulse rounded-3xl bg-gray-200" />
    ),
  }
);

export default function Home() {
  return (
    <main className="bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd({
        "@context": "https://schema.org", "@graph": [
          { "@type": "AutoDealer", "@id": "https://www.oldbikeshub.com/#business", name: "Old Bikes Hub", url: "https://www.oldbikeshub.com", description: "Buy and sell verified used bikes in Muzaffarpur, Bihar and across India.", areaServed: ["Muzaffarpur", "Bihar", "India"], telephone: "+918789192394", email: "admin@oldbikeshub.com", address: { "@type": "PostalAddress", addressLocality: "Muzaffarpur", addressRegion: "Bihar", addressCountry: "IN" } },
          { "@type": "WebSite", "@id": "https://www.oldbikeshub.com/#website", url: "https://www.oldbikeshub.com", name: "Old Bikes Hub", publisher: { "@id": "https://www.oldbikeshub.com/#business" } },
        ],
      }) }} />
      {/* HERO */}
      <Hero />

      {/* FEATURED BIKES */}
      <FeaturedBikes />

      {/* POPULAR BRANDS */}
      <PopularBrands />

      {/* LATEST BIKES */}
      <LatestBikes />

      {/* =========================
          SELL YOUR BIKE CTA
      ========================= */}

      <section className="px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div
            className="
              relative
              overflow-hidden
              rounded-3xl
              bg-black
              px-6
              py-12
              text-center
              shadow-xl
              sm:px-10
              sm:py-14
              lg:px-16
            "
          >
            {/* Decorative Orange Glow */}
            <div
              className="
                pointer-events-none
                absolute
                -right-24
                -top-24
                h-56
                w-56
                rounded-full
                bg-orange-500/20
                blur-3xl
              "
            />

            <div
              className="
                pointer-events-none
                absolute
                -bottom-24
                -left-24
                h-56
                w-56
                rounded-full
                bg-orange-500/10
                blur-3xl
              "
            />

            {/* CONTENT */}

            <div className="relative z-10 mx-auto max-w-2xl">
              <span
                className="
                  inline-flex
                  items-center
                  rounded-full
                  border
                  border-orange-500/30
                  bg-orange-500/10
                  px-4
                  py-2
                  text-sm
                  font-bold
                  text-orange-400
                "
              >
                Sell Your Used Bike
              </span>

              <h2
                className="
                  mt-5
                  text-3xl
                  font-black
                  tracking-tight
                  text-white
                  sm:text-4xl
                  lg:text-5xl
                "
              >
                Want To Sell Your Bike?
              </h2>

              <p
                className="
                  mx-auto
                  mt-4
                  max-w-xl
                  text-base
                  leading-7
                  text-gray-400
                  sm:text-lg
                "
              >
                Get the best price for your used bike and connect
                with genuine buyers through Old Bikes Hub.
              </p>

              <a
                href="/sell-bike"
                className="
                  mt-7
                  inline-flex
                  items-center
                  justify-center
                  rounded-xl
                  bg-orange-500
                  px-7
                  py-3.5
                  text-base
                  font-black
                  text-white
                  shadow-lg
                  shadow-orange-500/20
                  transition
                  duration-200
                  hover:bg-orange-600
                  hover:shadow-orange-500/30
                  active:scale-95
                  sm:px-8
                "
              >
                Sell Your Bike
                <span className="ml-2 text-lg">→</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-gray-100 bg-gray-50 px-4 py-14 sm:px-6 lg:px-8" aria-labelledby="local-guide-title">
        <div className="mx-auto max-w-4xl">
          <h2 id="local-guide-title" className="text-2xl font-black tracking-tight text-gray-900 sm:text-3xl">
            Used Bikes in Muzaffarpur, Bihar
          </h2>
          <p className="mt-4 leading-7 text-gray-600">
            Old Bikes Hub helps riders in Muzaffarpur and nearby Bihar areas find and sell pre-owned motorcycles. Browse real bike photos, compare model year, kilometres and price, then contact our team for availability and inspection details.
          </p>
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <h3 className="font-bold text-gray-900">Buying a used bike</h3>
              <p className="mt-2 text-sm leading-6 text-gray-600">Check the listing photos and documents, confirm the bike location, and arrange a visit before making a purchase.</p>
            </div>
            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <h3 className="font-bold text-gray-900">Selling your bike</h3>
              <p className="mt-2 text-sm leading-6 text-gray-600">Share your bike details and clear photos through our sell form. Our team will review the request and contact you.</p>
            </div>
          </div>
          <p className="mt-6 text-sm text-gray-600">Serving Muzaffarpur, Bihar and buyers looking for used bikes across India.</p>
        </div>
      </section>
    </main>
  );
}
