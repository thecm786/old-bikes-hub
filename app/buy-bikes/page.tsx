"use client";

import { useEffect, useState } from "react";
import BikeCard from "@/components/BikeCard";
import { bikes as defaultBikes } from "@/lib/bikes";


export default function BuyBikes() {


  const [allBikes, setAllBikes] = useState(defaultBikes);

  const [brand, setBrand] = useState("All");



  useEffect(() => {


    const savedBikes = JSON.parse(
      localStorage.getItem("bikes") || "[]"
    );


    setAllBikes([
      ...defaultBikes,
      ...savedBikes
    ]);


  }, []);




  const brands = [

    "All",
    "Royal Enfield",
    "KTM",
    "Yamaha",
    "Honda",
    "TVS",
    "Bajaj"

  ];




  const filteredBikes =

    brand === "All"

      ? allBikes

      : allBikes.filter(

          (bike) => bike.brand === brand

        );




  return (

    <main className="bg-gray-100 min-h-screen">


      <section className="bg-black py-20 text-center text-white">


        <h1 className="text-5xl font-bold">

          Buy Used Bikes

        </h1>


        <p className="mt-4 text-gray-300">

          Find Verified Second Hand Bikes

        </p>


      </section>





      <section className="px-6 py-12">



        <div className="mb-10 flex flex-wrap justify-center gap-4">


          {brands.map((item) => (


            <button

              key={item}

              onClick={() => setBrand(item)}

              className={`rounded-xl px-6 py-3 font-bold text-white ${
                
                brand === item
                  
                  ? "bg-orange-600"
                  
                  : "bg-black"

              }`}

            >

              {item}

            </button>


          ))}


        </div>






        <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-2 lg:grid-cols-3">



          {filteredBikes.length > 0 ? (


            filteredBikes.map((bike) => (


              <BikeCard

                key={bike.id}

                slug={bike.slug}

                name={bike.name}

                price={bike.price}

                year={bike.year}

                km={bike.km}

                location={bike.location}

                image={bike.image}

              />


            ))



          ) : (


            <p className="col-span-3 text-center text-xl text-gray-500">

              No Bikes Available

            </p>


          )}




        </div>



      </section>



    </main>

  );

}