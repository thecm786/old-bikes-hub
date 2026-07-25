"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { db } from "@/firebase/firebase";

import {
  collection,
  getDocs,
  deleteDoc,
  doc
} from "firebase/firestore";


export default function AdminDashboard() {


  const [bikes, setBikes] = useState<any[]>([]);

  const [loading, setLoading] = useState(true);




  const fetchBikes = async () => {


    try {


      const snapshot = await getDocs(

        collection(db, "bikes")

      );



      const bikeList = snapshot.docs.map((item)=>({


        id:item.id,


        ...item.data()


      }));



      setBikes(bikeList);



    } catch(error){


      console.log(
        "Fetch Error",
        error
      );


    } finally {


      setLoading(false);


    }


  };






  useEffect(()=>{


    fetchBikes();


  },[]);








  const handleDelete = async(id:string)=>{


    const confirmDelete = window.confirm(

      "Are you sure you want to delete this bike?"

    );



    if(!confirmDelete) return;




    try{


      await deleteDoc(

        doc(db,"bikes",id)

      );



      setBikes((prev)=>

        prev.filter(

          (bike)=>bike.id !== id

        )

      );



      alert(
        "Bike Deleted Successfully"
      );



    }catch(error){


      console.log(error);


      alert(
        "Delete Failed"
      );


    }


  };








  if(loading){


    return (

      <main className="flex min-h-screen items-center justify-center">

        <h1 className="text-3xl font-bold">

          Loading...

        </h1>

      </main>

    );

  }








  return (

    <main className="min-h-screen bg-gray-100 p-8">



      <h1 className="mb-8 text-4xl font-bold">

        Admin Dashboard

      </h1>






      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">



        {
          bikes.length > 0 ? (


            bikes.map((bike)=>(



              <div

                key={bike.id}

                className="rounded-2xl bg-white p-5 shadow-xl"

              >




                {
                  bike.image ? (


                    <img

                      src={bike.image}

                      alt={bike.name}

                      className="h-48 w-full rounded-xl object-cover"

                    />


                  ):(


                    <div className="flex h-48 items-center justify-center rounded-xl bg-gray-200 text-6xl">

                      🏍️

                    </div>


                  )

                }






                <h2 className="mt-4 text-2xl font-bold">

                  {bike.name}

                </h2>





                <p className="text-xl font-bold text-orange-500">

                  ₹{bike.price}

                </p>





                <p>

                  🏷️ {bike.brand}

                </p>





                <p>

                  📍 {bike.location}

                </p>







                <Link

                  href={`/admin/edit-bike/${bike.id}`}

                  className="mt-5 block w-full rounded-xl bg-black py-3 text-center font-bold text-white"

                >

                  Edit Bike

                </Link>






                <button


                  onClick={()=>handleDelete(bike.id)}


                  className="mt-3 w-full rounded-xl bg-red-600 py-3 font-bold text-white"


                >

                  Delete Bike

                </button>





              </div>



            ))



          ):(


            <p className="text-xl text-gray-500">

              No Bikes Available

            </p>


          )

        }



      </div>




    </main>

  );

}