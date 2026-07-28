"use client";

import {
  PlusCircle,
  Star,
  Bike,
  Clock,
} from "lucide-react";

import type { Bike as BikeType } from "@/types/bike";


interface DashboardActivityProps {

  bikes: BikeType[];

}



export default function DashboardActivity({

  bikes = [],

}: DashboardActivityProps) {



  const latestBikes = [...bikes]

    .sort(

      (a:any,b:any)=>

        Number(b.createdAt || 0) -

        Number(a.createdAt || 0)

    )

    .slice(0,5);





  return (

    <section className="
    rounded-3xl
    bg-white
    p-6
    shadow-lg
    ">


      <div className="
      mb-6
      flex
      items-center
      gap-3
      ">


        <Clock
          className="text-orange-500"
        />


        <div>


          <h2 className="
          text-2xl
          font-black
          text-gray-900
          ">

            Recent Activity

          </h2>


          <p className="
          text-sm
          text-gray-500
          ">

            Latest dashboard updates

          </p>


        </div>


      </div>








      {
        latestBikes.length === 0 ? (


          <div className="
          rounded-2xl
          bg-gray-50
          py-10
          text-center
          ">


            <Bike
              size={45}
              className="
              mx-auto
              text-gray-400
              "
            />


            <p className="
            mt-3
            font-bold
            text-gray-500
            ">

              No activity yet

            </p>


          </div>


        ) : (


          <div className="
          space-y-5
          ">



            {
              latestBikes.map((bike,index)=>(


                <div

                  key={bike.id}

                  className="
                  flex
                  items-start
                  gap-4
                  rounded-2xl
                  border
                  p-4
                  transition
                  hover:shadow-md
                  "

                >



                  {/* Icon */}


                  <div className="
                  flex
                  h-11
                  w-11
                  shrink-0
                  items-center
                  justify-center
                  rounded-xl
                  bg-orange-100
                  text-orange-600
                  ">


                    {
                      index===0 ?

                      <PlusCircle size={22}/>

                      :

                      bike.featured ?

                      <Star
                        size={22}
                        fill="currentColor"
                      />

                      :

                      <Bike size={22}/>

                    }


                  </div>







                  <div className="
                  flex-1
                  ">



                    <h3 className="
                    font-black
                    text-gray-900
                    ">

                      {
                        index===0

                        ?

                        "New Bike Added"

                        :

                        bike.featured

                        ?

                        "Bike Featured"

                        :

                        "Bike Listing Updated"

                      }

                    </h3>





                    <p className="
                    mt-1
                    text-sm
                    text-gray-600
                    ">

                      {bike.name}

                      {" - "}

                      {bike.brand}

                    </p>





                    <p className="
                    mt-1
                    text-xs
                    text-gray-400
                    ">

                      {bike.location}

                    </p>




                  </div>





                  <div className="
                  text-xs
                  font-bold
                  text-gray-400
                  ">

                    #{index + 1}

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