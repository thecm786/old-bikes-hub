import Hero from "@/components/Hero";
import FeaturedBikes from "@/components/FeaturedBikes";
import LatestBikes from "@/components/LatestBikes";
import PopularBrands from "@/components/PopularBrands";

export default function Home() {
  return (
    <main>
      {/* HERO */}
      <Hero />

      {/* FEATURED BIKES */}
      <FeaturedBikes />

      {/* DYNAMIC POPULAR BRANDS */}
      <PopularBrands />

      {/* LATEST BIKES */}
      <LatestBikes />

      {/* SELL CTA */}
      <section
        className="
        bg-black
        py-20
        text-center
        text-white
        "
      >
        <h2
          className="
          text-4xl
          font-black
          "
        >
          Want To Sell Your Bike?
        </h2>

        <p
          className="
          mt-4
          text-gray-400
          "
        >
          Get the best price for your used bike.
        </p>

        <a
          href="/sell-bike"
          className="
          mt-8
          inline-block
          rounded-xl
          bg-orange-500
          px-8
          py-4
          font-bold
          text-white
          transition
          hover:bg-orange-600
          "
        >
          Sell Your Bike
        </a>
      </section>
    </main>
  );
}