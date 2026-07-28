"use client";


import {
  Bike,
  CheckCircle,
  Clock,
  BadgeCheck,
} from "lucide-react";


import type { BikeType } from "@/types/bike";



interface DashboardStatsProps {


  bikes:BikeType[];


}



export default function DashboardStats({

  bikes,

}:DashboardStatsProps){



  const totalBikes =
    bikes.length;



  const availableBikes =
    bikes.filter(
      (bike)=>
        bike.status === "Available"
    ).length;



  const pendingBikes =
    bikes.filter(
      (bike)=>
        bike.status === "Pending"
    ).length;



  const soldBikes =
    bikes.filter(
      (bike)=>
        bike.status === "Sold"
    ).length;





  const stats = [


    {

      title:"Total Bikes",

      value:totalBikes,

      icon:<Bike size={28}/>,

      bg:"bg-black",

      text:"text-white"

    },


    {

      title:"Available",

      value:availableBikes,

      icon:<CheckCircle size={28}/>,

      bg:"bg-green-500",

      text:"text-white"

    },


    {

      title:"Pending",

      value:pendingBikes,

      icon:<Clock size={28}/>,

      bg:"bg-yellow-400",

      text:"text-black"

    },


    {

      title:"Sold",

      value:soldBikes,

      icon:<BadgeCheck size={28}/>,

      bg:"bg-red-600",

      text:"text-white"

    },


  ];







  return (


    <section className="
    grid
    gap-6
    sm:grid-cols-2
    xl:grid-cols-4
    ">



      {
        stats.map((item)=>(


          <div

            key={item.title}

            className={`
            ${item.bg}
            ${item.text}
            rounded-3xl
            p-6
            shadow-xl
            transition
            duration-300
            hover:-translate-y-2
            `}

          >


            <div className="
            flex
            items-center
            justify-between
            ">


              <div>


                <p className="
                text-sm
                font-bold
                opacity-80
                ">

                  {item.title}

                </p>



                <h2 className="
                mt-3
                text-4xl
                font-black
                ">

                  {item.value}

                </h2>


              </div>




              <div className="
              flex
              h-14
              w-14
              items-center
              justify-center
              rounded-2xl
              bg-white/20
              ">

                {item.icon}

              </div>



            </div>


          </div>


        ))
      }




    </section>


  );

}