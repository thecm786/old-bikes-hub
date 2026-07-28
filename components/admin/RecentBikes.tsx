"use client";

import Link from "next/link";

import {
  Eye,
  Calendar,
  Gauge,
  IndianRupee,
  MapPin,
  Star,
  ArrowRight,
} from "lucide-react";

import type { Bike as BikeType } from "@/types/bike";


interface RecentBikesProps {

  bikes: BikeType[];

}



export default function RecentBikes({

  bikes = [],

}: RecentBikesProps) {



  const recentBikes = [...bikes]

    .sort(

      (a:any,b:any)=>

        Number(b.createdAt || 0) -

        Number(a.createdAt || 0)

    )

    .slice(0,6);





  return (

    <section className="
    rounded-3xl
    bg-white
    p-6
    shadow-lg
    ">



      {/* Header */}

      <div className="
      mb-6
      flex
      items-center
      justify-between
      ">


        <div>


          <h2 className="
          text-2xl
          font-black
          text-gray-900
          ">

            Recent Bikes 🏍️

          </h2>


          <p className="
          text-sm
          text-gray-500
          ">

            Latest added bike listings

          </p>


        </div>





        <Link

          href="/admin/add-bike"

          className="
          hidden
          items-center
          gap-2
          rounded-xl
          bg-orange-500
          px-4
          py-2
          text-sm
          font-bold
          text-white
          sm:flex
          "

        >

          Add New

          <ArrowRight size={16}/>

        </Link>


      </div>








      {
        recentBikes.length === 0 ? (


          <div className="
          rounded-2xl
          bg-gray-50
          py-16
          text-center
          ">


            <div className="
            text-6xl
            ">

              🏍️

            </div>


            <h3 className="
            mt-4
            text-xl
            font-black
            ">

              No Bikes Added

            </h3>


            <p className="
            mt-2
            text-gray-500
            ">

              Add your first bike listing.

            </p>


          </div>


        ) : (



          <div className="
          grid
          gap-5
          md:grid-cols-2
          xl:grid-cols-3
          ">


            {
              recentBikes.map((bike)=>(



                <div

                  key={bike.id}

                  className="
                  group
                  overflow-hidden
                  rounded-2xl
                  border
                  bg-gray-50
                  transition
                  hover:-translate-y-1
                  hover:shadow-xl
                  "

                >




                  {/* Image */}


                  <div className="
                  relative
                  h-44
                  overflow-hidden
                  ">


                    {
                      bike.image ? (


                        <img

                          src={bike.image}

                          alt={bike.name}

                          className="
                          h-full
                          w-full
                          object-cover
                          transition
                          duration-500
                          group-hover:scale-110
                          "

                        />


                      ) : (


                        <div className="
                        flex
                        h-full
                        items-center
                        justify-center
                        text-6xl
                        ">

                          🏍️

                        </div>


                      )


                    }





                    {
                      bike.featured && (


                        <span className="
                        absolute
                        left-3
                        top-3
                        flex
                        items-center
                        gap-1
                        rounded-full
                        bg-yellow-400
                        px-3
                        py-1
                        text-xs
                        font-bold
                        ">


                          <Star
                            size={13}
                            fill="currentColor"
                          />


                          Featured


                        </span>


                      )
                    }



                  </div>







                  {/* Content */}


                  <div className="
                  space-y-3
                  p-5
                  ">



                    <h3 className="
                    truncate
                    text-lg
                    font-black
                    ">

                      {bike.name}

                    </h3>


                    <p className="
                    text-sm
                    text-gray-500
                    ">

                      {bike.brand}

                    </p>





                    <div className="
                    space-y-2
                    text-sm
                    text-gray-600
                    ">


                      <div className="
                      flex
                      items-center
                      gap-2
                      font-bold
                      text-orange-600
                      ">

                        <IndianRupee size={15}/>

                        ₹
                        {Number(
                          bike.price || 0
                        ).toLocaleString("en-IN")}

                      </div>





                      <div className="
                      flex
                      items-center
                      gap-2
                      ">

                        <Calendar size={15}/>

                        {bike.year}

                      </div>






                      <div className="
                      flex
                      items-center
                      gap-2
                      ">

                        <Gauge size={15}/>

                        {bike.km} KM

                      </div>






                      <div className="
                      flex
                      items-center
                      gap-2
                      truncate
                      ">

                        <MapPin size={15}/>

                        {bike.location}

                      </div>



                    </div>







                    <Link

                      href={`/bike/${bike.slug}`}

                      className="
                      mt-3
                      flex
                      items-center
                      justify-center
                      gap-2
                      rounded-xl
                      bg-black
                      py-3
                      text-sm
                      font-bold
                      text-white
                      hover:bg-gray-800
                      "

                    >

                      <Eye size={16}/>

                      View Bike


                    </Link>




                  </div>


                </div>



              ))
            }


          </div>


        )
      }





    </section>


  );

}