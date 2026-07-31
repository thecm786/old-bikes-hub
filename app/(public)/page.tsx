import Hero from "@/components/Hero";
import FeaturedBikes from "@/components/FeaturedBikes";
import LatestBikes from "@/components/LatestBikes";
import PopularBrands from "@/components/PopularBrands";

export default function Home() {
  return (
    <main className="bg-white">
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
    </main>
  );
}