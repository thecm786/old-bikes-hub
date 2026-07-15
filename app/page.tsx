import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import BrandCard from "@/components/BrandCard";
import BikeCard from "@/components/BikeCard";

export default function Home() {
  return (
    <>
      <Navbar />

      <Hero />


      {/* Popular Used Bike Brands */}

      <section className="bg-gray-100 py-20">

        <h2 className="mb-10 text-center text-4xl font-bold">
          Popular Used Bike Brands
        </h2>


        <div className="mx-auto grid max-w-6xl gap-6 px-6 md:grid-cols-3 lg:grid-cols-4">


          <BrandCard
            name="Royal Enfield"
            bikes="25"
          />


          <BrandCard
            name="KTM"
            bikes="18"
          />


          <BrandCard
            name="Yamaha"
            bikes="22"
          />


          <BrandCard
            name="Honda"
            bikes="30"
          />


          <BrandCard
            name="TVS"
            bikes="20"
          />


          <BrandCard
            name="Bajaj"
            bikes="35"
          />


          <BrandCard
            name="Hero"
            bikes="40"
          />


          <BrandCard
            name="Suzuki"
            bikes="15"
          />


        </div>

      </section>



      {/* Latest Used Bikes */}

      <section className="py-20">

        <h2 className="mb-10 text-center text-4xl font-bold">
          Latest Used Bikes
        </h2>


        <div className="mx-auto grid max-w-6xl gap-8 px-6 md:grid-cols-2 lg:grid-cols-3">


          <BikeCard
            name="Royal Enfield Classic 350"
            price="₹1,65,000"
            year="2022"
            km="12000"
            location="Muzaffarpur"
          />


          <BikeCard
            name="KTM Duke 390"
            price="₹2,05,000"
            year="2023"
            km="8500"
            location="Patna"
          />


          <BikeCard
            name="Yamaha R15 V4"
            price="₹1,55,000"
            year="2024"
            km="5000"
            location="Bihar"
          />


        </div>

      </section>


      {/* Sell Your Bike */}

      <section className="bg-black py-20 text-center text-white">

        <h2 className="text-4xl font-bold">
          Want To Sell Your Bike?
        </h2>

        <p className="mt-4 text-gray-300">
          Get the best price for your used bike
        </p>


        <button className="mt-8 rounded-xl bg-orange-500 px-8 py-4 font-bold">
          Sell Your Bike
        </button>


      </section>


    </>
  );
}