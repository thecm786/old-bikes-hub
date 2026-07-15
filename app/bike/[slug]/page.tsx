"use client";

import { useEffect, useState } from "react";
import { bikes as defaultBikes } from "@/lib/bikes";
import { useParams } from "next/navigation";


export default function BikeDetails() {


  const params = useParams();

  const slug = params.slug as string;



  const [bike, setBike] = useState<any>(null);



  useEffect(() => {


    const savedBikes = JSON.parse(

      localStorage.getItem("bikes") || "[]"

    );



    const allBikes = [

      ...defaultBikes,

      ...savedBikes

    ];



    const foundBike = allBikes.find(

      (item) => item.slug === slug

    );



    setBike(foundBike);



  }, [slug]);





  if (!bike) {


    return (

      <main className="flex min-h-screen items-center justify-center">

        <h1 className="text-3xl font-bold">

          Loading Bike...

        </h1>

      </main>

    );

  }





  return (

    <main className="min-h-screen bg-gray-100 px-6 py-12">


      <div className="mx-auto grid max-w-6xl gap-10 rounded-2xl bg-white p-8 shadow-xl md:grid-cols-2">



        <div className="h-96 overflow-hidden rounded-xl bg-gray-200">


          {bike.image ? (

            <img

              src={bike.image}

              alt={bike.name}

              className="h-full w-full object-cover"

            />

          ) : (

            <div className="flex h-full items-center justify-center text-7xl">

              🏍️

            </div>

          )}


        </div>





        <div>


          <h1 className="text-4xl font-bold">

            {bike.name}

          </h1>




          <p className="mt-4 text-3xl font-bold text-orange-500">

            {bike.price}

          </p>




          <div className="mt-6 space-y-3 text-lg">


            <p>
              🏷️ Brand: {bike.brand}
            </p>


            <p>
              📅 Year: {bike.year}
            </p>


            <p>
              🛣️ KM Driven: {bike.km}
            </p>


            <p>
              📍 Location: {bike.location}
            </p>


          </div>




          <p className="mt-6 text-gray-600">

            {bike.description || 
            "Well maintained used bike available."}

          </p>




          <div className="mt-8 flex gap-4">


            <a

              href="https://wa.me/918789192394"

              target="_blank"

              className="rounded-xl bg-green-600 px-6 py-3 font-bold text-white"

            >

              WhatsApp

            </a>




            <a

              href="tel:+918789192394"

              className="rounded-xl bg-black px-6 py-3 font-bold text-white"

            >

              Call Now

            </a>


          </div>


        </div>



      </div>


    </main>

  );

}