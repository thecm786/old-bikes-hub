"use client";

import {
  Search,
  ShieldCheck,
  Bike,
  IndianRupee,
} from "lucide-react";


interface HeroProps {

  search: string;

  setSearch: (
    value:string
  ) => void;

}





export default function Hero({

  search,

  setSearch,

}:HeroProps){



  return (

    <section

      className="
      relative
      overflow-hidden
      rounded-3xl
      bg-gradient-to-br
      from-black
      via-gray-900
      to-orange-600
      px-6
      py-16
      text-white
      md:px-12
      "

    >



      {/* Background */}

      <div

        className="
        absolute
        -right-20
        -top-20
        h-72
        w-72
        rounded-full
        bg-orange-500/30
        blur-3xl
        "

      />



      <div

        className="
        relative
        z-10
        grid
        gap-10
        lg:grid-cols-2
        lg:items-center
        "

      >





        <div>


          <div

            className="
            mb-5
            inline-flex
            items-center
            gap-2
            rounded-full
            bg-white/10
            px-4
            py-2
            text-sm
            font-bold
            backdrop-blur
            "

          >

            <ShieldCheck
              size={18}
              className="text-green-400"
            />

            Verified Used Bikes Marketplace

          </div>





          <h1

            className="
            text-4xl
            font-black
            leading-tight
            md:text-6xl
            "

          >

            Find Your Dream

            <span
              className="
              block
              text-orange-400
              "
            >

              Second Hand Bike

            </span>


          </h1>





          <p

            className="
            mt-5
            max-w-xl
            text-lg
            text-gray-200
            "

          >

            Buy trusted used bikes from verified sellers.
            Best prices, genuine listings and direct owner contact.

          </p>






          {/* Search */}


          <div

            className="
            mt-8
            flex
            rounded-2xl
            bg-white
            p-2
            shadow-2xl
            "

          >


            <Search

              className="
              ml-3
              self-center
              text-gray-400
              "

              size={22}

            />



            <input


              value={search}


              onChange={(e)=>

                setSearch(
                  e.target.value
                )

              }



              placeholder="
              Search bike name, brand or city...
              "



              className="
              w-full
              px-4
              py-3
              text-gray-900
              outline-none
              "

            />



          </div>



        </div>









        {/* Stats */}


        <div

          className="
          grid
          grid-cols-2
          gap-5
          "

        >



          <div

            className="
            rounded-3xl
            bg-white/10
            p-6
            backdrop-blur
            "

          >

            <Bike

              className="
              mb-3
              text-orange-400
              "

            />

            <h3

              className="
              text-3xl
              font-black
              "

            >

              100+

            </h3>


            <p className="text-gray-300">

              Quality Bikes

            </p>


          </div>







          <div

            className="
            rounded-3xl
            bg-white/10
            p-6
            backdrop-blur
            "

          >

            <IndianRupee

              className="
              mb-3
              text-green-400
              "

            />


            <h3

              className="
              text-3xl
              font-black
              "

            >

              Best

            </h3>


            <p className="text-gray-300">

              Market Price

            </p>


          </div>






          <div

            className="
            col-span-2
            rounded-3xl
            bg-white/10
            p-6
            backdrop-blur
            "

          >

            <h3

              className="
              text-xl
              font-black
              "

            >

              Why Old Bikes Hub?

            </h3>


            <p

              className="
              mt-2
              text-gray-300
              "

            >

              Verified listings + direct contact + transparent deals.

            </p>


          </div>





        </div>



      </div>


    </section>


  );

}