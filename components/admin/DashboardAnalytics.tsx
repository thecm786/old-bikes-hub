"use client";

import {
  Bike,
  Star,
  IndianRupee,
  Tags,
} from "lucide-react";

import type { Bike as BikeType } from "@/types/bike";


interface DashboardAnalyticsProps {

  bikes: BikeType[];

}



export default function DashboardAnalytics({

  bikes,

}: DashboardAnalyticsProps) {



  const totalValue = bikes.reduce(

    (sum,bike)=>

      sum + Number(bike.price || 0),

    0

  );




  const featured = bikes.filter(

    (bike)=>bike.featured

  ).length;



  const normal =

    bikes.length - featured;




  const brandData =

    Object.entries(

      bikes.reduce(

        (acc:any,bike)=>{


          acc[bike.brand] =

            (acc[bike.brand] || 0) + 1;


          return acc;


        },

        {}

      )

    )

    .sort(

      (a:any,b:any)=>

        b[1]-a[1]

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
      ">


        <h2 className="
        text-2xl
        font-black
        text-gray-900
        ">

          Dashboard Analytics 📊

        </h2>


        <p className="
        text-sm
        text-gray-500
        ">

          Business overview and inventory insights

        </p>


      </div>







      {/* Top Cards */}


      <div className="
      grid
      gap-5
      md:grid-cols-3
      ">




        <div className="
        rounded-2xl
        bg-orange-50
        p-5
        ">


          <div className="
          flex
          items-center
          justify-between
          ">

            <div>


              <p className="
              text-sm
              text-gray-500
              ">

                Inventory Value

              </p>


              <h3 className="
              mt-2
              text-2xl
              font-black
              ">

                ₹
                {totalValue.toLocaleString("en-IN")}

              </h3>


            </div>


            <IndianRupee
              className="text-orange-500"
              size={32}
            />


          </div>


        </div>







        <div className="
        rounded-2xl
        bg-yellow-50
        p-5
        ">


          <div className="
          flex
          items-center
          justify-between
          ">


            <div>


              <p className="
              text-sm
              text-gray-500
              ">

                Featured Bikes

              </p>


              <h3 className="
              mt-2
              text-3xl
              font-black
              ">

                {featured}

              </h3>


            </div>


            <Star
              className="text-yellow-500"
              size={32}
              fill="currentColor"
            />


          </div>


        </div>







        <div className="
        rounded-2xl
        bg-blue-50
        p-5
        ">


          <div className="
          flex
          items-center
          justify-between
          ">


            <div>


              <p className="
              text-sm
              text-gray-500
              ">

                Total Listings

              </p>


              <h3 className="
              mt-2
              text-3xl
              font-black
              ">

                {bikes.length}

              </h3>


            </div>


            <Bike
              className="text-blue-600"
              size={32}
            />


          </div>


        </div>



      </div>








      {/* Brand Analytics */}



      <div className="
      mt-8
      grid
      gap-6
      md:grid-cols-2
      ">



        <div className="
        rounded-2xl
        border
        p-5
        ">


          <div className="
          mb-5
          flex
          items-center
          gap-2
          ">


            <Tags
              className="text-orange-500"
            />


            <h3 className="
            font-black
            ">

              Top Brands

            </h3>


          </div>





          <div className="
          space-y-4
          ">


            {
              brandData.map(

                ([brand,count]:any)=>(


                  <div
                    key={brand}
                  >


                    <div className="
                    mb-1
                    flex
                    justify-between
                    text-sm
                    font-bold
                    ">


                      <span>
                        {brand}
                      </span>


                      <span>
                        {count}
                      </span>


                    </div>



                    <div className="
                    h-3
                    overflow-hidden
                    rounded-full
                    bg-gray-200
                    ">


                      <div

                        className="
                        h-full
                        rounded-full
                        bg-orange-500
                        "

                        style={{

                          width:
                          `${

                            (count / bikes.length)

                            * 100

                          }%`

                        }}

                      />


                    </div>



                  </div>


                )

              )
            }


          </div>


        </div>








        <div className="
        rounded-2xl
        border
        p-5
        ">


          <h3 className="
          mb-5
          font-black
          ">

            Listing Status

          </h3>




          <div className="
          space-y-5
          ">



            <div>


              <div className="
              mb-2
              flex
              justify-between
              font-bold
              ">

                <span>
                  Featured
                </span>

                <span>
                  {featured}
                </span>

              </div>


              <div className="
              h-3
              rounded-full
              bg-gray-200
              ">


                <div

                  className="
                  h-full
                  rounded-full
                  bg-yellow-400
                  "

                  style={{

                    width:

                    `${
                      bikes.length
                      ?
                      (featured/bikes.length)*100
                      :
                      0
                    }%`

                  }}

                />


              </div>


            </div>






            <div>


              <div className="
              mb-2
              flex
              justify-between
              font-bold
              ">


                <span>
                  Normal
                </span>


                <span>
                  {normal}
                </span>


              </div>


              <div className="
              h-3
              rounded-full
              bg-gray-200
              ">


                <div

                  className="
                  h-full
                  rounded-full
                  bg-blue-500
                  "

                  style={{

                    width:

                    `${
                      bikes.length
                      ?
                      (normal/bikes.length)*100
                      :
                      0
                    }%`

                  }}

                />


              </div>


            </div>



          </div>



        </div>



      </div>





    </section>


  );


}