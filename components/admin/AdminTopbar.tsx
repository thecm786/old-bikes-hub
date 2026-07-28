"use client";

import {
  Search,
  Bell,
  UserCircle2,
  LogOut,
} from "lucide-react";

import {
  signOut,
} from "firebase/auth";

import {
  auth,
} from "@/firebase/firebase";

import {
  useRouter,
} from "next/navigation";

import {
  useState,
} from "react";



export default function AdminTopbar(){


  const router = useRouter();


  const [search,setSearch] =
    useState("");





  const logoutHandler = async()=>{


    try{


      await signOut(auth);


      router.push(
        "/admin/login"
      );


    }
    catch(error){


      console.log(error);


    }


  };







  return (


    <header className="
    sticky
    top-0
    z-40
    flex
    items-center
    justify-between
    gap-4
    border-b
    bg-white/80
    px-6
    py-4
    backdrop-blur-xl
    ">





      {/* Search */}


      <div className="
      flex
      max-w-xl
      flex-1
      items-center
      gap-3
      rounded-2xl
      border
      bg-gray-50
      px-4
      py-3
      ">


        <Search
          size={20}
          className="text-gray-400"
        />


        <input

          value={search}

          onChange={(e)=>
            setSearch(e.target.value)
          }

          placeholder="
          Search bikes...
          "

          className="
          w-full
          bg-transparent
          outline-none
          "

        />


      </div>









      {/* Right Side */}


      <div className="
      flex
      items-center
      gap-4
      ">





        {/* Notification */}


        <button

          className="
          relative
          flex
          h-11
          w-11
          items-center
          justify-center
          rounded-xl
          bg-gray-100
          hover:bg-gray-200
          "

        >


          <Bell size={20}/>


          <span className="
          absolute
          right-2
          top-2
          h-2.5
          w-2.5
          rounded-full
          bg-orange-500
          " />


        </button>







        {/* Profile */}


        <div className="
        hidden
        items-center
        gap-3
        rounded-xl
        bg-gray-100
        px-4
        py-2
        md:flex
        ">


          <UserCircle2
            size={35}
            className="text-orange-500"
          />


          <div>


            <p className="
            text-sm
            font-black
            text-gray-900
            ">

              Admin

            </p>


            <p className="
            text-xs
            text-gray-500
            ">

              Old Bikes Hub

            </p>


          </div>


        </div>







        {/* Logout */}


        <button

          onClick={logoutHandler}

          className="
          flex
          h-11
          w-11
          items-center
          justify-center
          rounded-xl
          bg-red-50
          text-red-600
          transition
          hover:bg-red-600
          hover:text-white
          "

        >


          <LogOut size={20}/>


        </button>





      </div>





    </header>


  );


}