"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { db } from "@/firebase/firebase";

import {
  doc,
  getDoc,
  updateDoc
} from "firebase/firestore";

import ImageUploader from "@/components/ImageUploader";



export default function EditBike() {


  const params = useParams();

  const router = useRouter();

  const id = params.id as string;



  const [form, setForm] = useState({

    brand: "",
    name: "",
    price: "",
    year: "",
    km: "",
    owner: "",
    location: "",
    description: "",
    image: "",

  });



  const [loading, setLoading] = useState(true);





  useEffect(() => {


    const fetchBike = async () => {


      const bikeRef = doc(
        db,
        "bikes",
        id
      );


      const snapshot = await getDoc(
        bikeRef
      );



      if(snapshot.exists()){


        const data = snapshot.data();



        setForm({

          brand: data.brand || "",
          name: data.name || "",
          price: data.price || "",
          year: data.year || "",
          km: data.km || "",
          owner: data.owner || "",
          location: data.location || "",
          description: data.description || "",
          image: data.image || "",

        });


      }


      setLoading(false);


    };



    if(id){

      fetchBike();

    }


  },[id]);







  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {


    setForm({

      ...form,

      [e.target.name]: e.target.value,

    });


  };







  const handleUpdate = async(
    e: React.FormEvent
  ) => {


    e.preventDefault();



    try{


      await updateDoc(

        doc(db,"bikes",id),

        form

      );



      alert(
        "Bike Updated Successfully"
      );



      router.push(
        "/admin/dashboard"
      );



    }catch(error){


      console.log(error);


      alert(
        "Update Failed"
      );


    }


  };







  if(loading){


    return (

      <main className="flex min-h-screen items-center justify-center">

        Loading...

      </main>

    );

  }







  return (

    <main className="min-h-screen bg-gray-100 p-8">


      <h1 className="mb-8 text-4xl font-bold">

        Edit Bike

      </h1>






      <form

        onSubmit={handleUpdate}

        className="mx-auto max-w-3xl space-y-5 rounded-2xl bg-white p-8 shadow-xl"

      >





        {
          form.image && (

            <img

              src={form.image}

              alt="Bike"

              className="h-48 w-full rounded-xl object-cover"

            />

          )
        }







        <ImageUploader

          onUpload={(url)=>{


            setForm({

              ...form,

              image:url

            });


          }}

        />







        <input

          name="brand"

          value={form.brand}

          onChange={handleChange}

          placeholder="Brand"

          className="w-full rounded-lg border p-3"

        />







        <input

          name="name"

          value={form.name}

          onChange={handleChange}

          placeholder="Bike Name"

          className="w-full rounded-lg border p-3"

        />







        <input

          name="price"

          value={form.price}

          onChange={handleChange}

          placeholder="Price"

          className="w-full rounded-lg border p-3"

        />







        <input

          name="year"

          value={form.year}

          onChange={handleChange}

          placeholder="Year"

          className="w-full rounded-lg border p-3"

        />







        <input

          name="km"

          value={form.km}

          onChange={handleChange}

          placeholder="KM Driven"

          className="w-full rounded-lg border p-3"

        />







        <input

          name="owner"

          value={form.owner}

          onChange={handleChange}

          placeholder="Owner"

          className="w-full rounded-lg border p-3"

        />







        <input

          name="location"

          value={form.location}

          onChange={handleChange}

          placeholder="Location"

          className="w-full rounded-lg border p-3"

        />







        <textarea

          name="description"

          value={form.description}

          onChange={handleChange}

          placeholder="Description"

          className="h-32 w-full rounded-lg border p-3"

        />







        <button

          type="submit"

          className="w-full rounded-xl bg-orange-500 py-4 font-bold text-white"

        >

          Update Bike

        </button>





      </form>



    </main>

  );

}