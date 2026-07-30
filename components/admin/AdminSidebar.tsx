"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import {
  LayoutDashboard,
  PlusCircle,
  Bike,
  Star,
  Settings,
  LogOut,
  ClipboardList,
} from "lucide-react";

import { signOut } from "firebase/auth";
import { auth, db } from "@/firebase/firebase";

import {
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";

import { useEffect, useState } from "react";





export default function AdminSidebar() {


  const pathname = usePathname();

  const router = useRouter();



  const [pendingCount,setPendingCount] =
    useState(0);






  useEffect(()=>{


    const fetchPending = async()=>{


      try{


        const q = query(

          collection(
            db,
            "sellRequests"
          ),

          where(
            "status",
            "==",
            "Pending"
          )

        );



        const snapshot =
          await getDocs(q);



        setPendingCount(
          snapshot.size
        );


      }

      catch(error){

        console.log(error);

      }


    };



    fetchPending();



  },[]);









  const menu = [


    {
      name:"Dashboard",
      href:"/admin/dashboard",
      icon:<LayoutDashboard size={20}/>
    },



    {
      name:"Add Bike",
      href:"/admin/add-bike",
      icon:<PlusCircle size={20}/>
    },



    {
      name:"All Bikes",
      href:"/admin/bikes",
      icon:<Bike size={20}/>
    },



    {
      name:"Sell Requests",
      href:"/admin/sell-requests",
      icon:<ClipboardList size={20}/>,
      badge:pendingCount
    },



    {
      name:"Featured Bikes",
      href:"/admin/featured",
      icon:<Star size={20}/>
    },



    {
      name:"Settings",
      href:"/admin/settings",
      icon:<Settings size={20}/>
    },


  ];









  const logoutHandler = async()=>{


    await signOut(auth);


    router.push(
      "/admin/login"
    );


  };









  return (


    <aside className="
    flex
    h-full
    flex-col
    bg-black
    text-white
    ">





      {/* LOGO */}


      <div className="
      border-b
      border-white/10
      p-6
      ">


        <h1 className="
        text-2xl
        font-black
        text-orange-500
        ">

          🏍️ Old Bikes Hub

        </h1>


        <p className="
        mt-1
        text-xs
        text-gray-400
        ">

          ADMIN PANEL

        </p>


      </div>









      {/* MENU */}


      <nav className="
      flex-1
      space-y-2
      p-4
      ">


      {

        menu.map((item)=>(


          <Link


          key={item.name}


          href={item.href}


          className={`

          flex
          items-center
          justify-between
          rounded-xl
          px-4
          py-3
          font-semibold
          transition


          ${
            pathname===item.href

            ?

            "bg-orange-500 text-white shadow-lg"

            :

            "text-gray-300 hover:bg-white/10 hover:text-white"

          }


          `}



          >




            <div className="
            flex
            items-center
            gap-3
            ">


              {item.icon}


              <span>

                {item.name}

              </span>


            </div>







            {
              item.badge &&
              item.badge > 0 &&


              <span className="
              rounded-full
              bg-red-500
              px-2
              py-1
              text-xs
              font-black
              text-white
              ">

                {item.badge}


              </span>


            }




          </Link>


        ))

      }


      </nav>









      {/* LOGOUT */}


      <div className="
      border-t
      border-white/10
      p-4
      ">


        <button


        onClick={logoutHandler}


        className="
        flex
        w-full
        items-center
        gap-3
        rounded-xl
        px-4
        py-3
        font-bold
        text-red-400
        hover:bg-red-500/10
        "


        >


          <LogOut size={20}/>


          Logout


        </button>



      </div>







    </aside>


  );


}