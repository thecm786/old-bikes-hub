"use client";


import {
  useEffect,
  useMemo,
  useState,
  Suspense,
} from "react";


import {
  useSearchParams,
} from "next/navigation";


import {
  collection,
  getDocs,
} from "firebase/firestore";


import { db } from "@/firebase/firebase";


import Hero from "@/components/buy-bikes/Hero";

import FilterSidebar from "@/components/buy-bikes/FilterSidebar";

import BikeGrid from "@/components/buy-bikes/BikeGrid";







interface BikeType {


  id:string;


  name:string;


  brand:string;


  slug:string;


  price:number | string;


  year:string;


  km:string;


  location:string;


  owner?:string;


  phone?:string;


  image?:string;


  images?:string[];


  description?:string;


  featured?:boolean;


  verified?:boolean;


  status?:string;


}








function BuyBikesContent(){


  const searchParams =
    useSearchParams();



  const initialSearch =
    searchParams.get("search") || "";





  const [bikes,setBikes] =
    useState<BikeType[]>([]);



  const [loading,setLoading] =
    useState(true);




  const [search,setSearch] =
    useState(initialSearch);




  const [brand,setBrand] =
    useState("All");




  const [status,setStatus] =
    useState("All");




  const [mobileFilter,setMobileFilter] =
    useState(false);








  useEffect(()=>{


    const fetchBikes = async()=>{


      try{


        const snapshot =
          await getDocs(
            collection(
              db,
              "bikes"
            )
          );



        const data =
          snapshot.docs.map((item)=>({


            id:item.id,


            ...(item.data())


          })) as BikeType[];



        setBikes(data);



      }
      catch(error){


        console.log(error);


      }
      finally{


        setLoading(false);


      }


    };



    fetchBikes();



  },[]);










  const brands = useMemo(()=>{


    return [


      "All",


      ...Array.from(


        new Set(


          bikes.map(
            (bike)=>
            bike.brand
          )


        )


      )


    ];


  },[bikes]);









  const filteredBikes = useMemo(()=>{


    return bikes.filter((bike)=>{



      const keyword =
        search.toLowerCase();




      const searchMatch =



        bike.name
        ?.toLowerCase()
        .includes(keyword)



        ||



        bike.brand
        ?.toLowerCase()
        .includes(keyword)



        ||



        bike.location
        ?.toLowerCase()
        .includes(keyword);







      const brandMatch =


        brand === "All"


        ||


        bike.brand === brand;







      const statusMatch =


        status === "All"


        ||


        bike.status === status;







      return (


        searchMatch


        &&


        brandMatch


        &&


        statusMatch


      );



    });



  },[

    bikes,

    search,

    brand,

    status

  ]);













  return (



<main

className="
min-h-screen
bg-gray-100
py-8
"

>



<div

className="
mx-auto
max-w-7xl
space-y-8
px-5
"

>






<Hero

search={search}

setSearch={setSearch}

/>








<button

onClick={()=>setMobileFilter(true)}

className="
rounded-xl
bg-black
px-5
py-3
font-bold
text-white
lg:hidden
"

>

Show Filters

</button>









<div

className="
grid
gap-8
lg:grid-cols-4
"

>









<div

className="
lg:col-span-1
"

>



<FilterSidebar


search={search}


setSearch={setSearch}


brand={brand}


setBrand={setBrand}


brands={brands}



status={status}


setStatus={setStatus}



mobileOpen={mobileFilter}


setMobileOpen={setMobileFilter}



/>



</div>









<section

className="
lg:col-span-3
"

>







<div

className="
mb-5
flex
items-center
justify-between
"

>


<h2

className="
text-3xl
font-black
"

>

Available Bikes

</h2>






<span

className="
rounded-full
bg-orange-100
px-4
py-2
font-bold
text-orange-600
"

>

{filteredBikes.length} Bikes

</span>




</div>









<BikeGrid


bikes={filteredBikes}


loading={loading}



/>







</section>









</div>









</div>



</main>



  );


}









export default function BuyBikesPage(){


  return (


    <Suspense


      fallback={

        <div

        className="
        flex
        min-h-screen
        items-center
        justify-center
        font-bold
        "

        >

          Loading Bikes...

        </div>

      }


    >


      <BuyBikesContent />


    </Suspense>


  );


}