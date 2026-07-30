"use client";

import { useState } from "react";

import {
  addDoc,
  collection,
  serverTimestamp,
} from "firebase/firestore";

import {
  CheckCircle,
} from "lucide-react";

import {
  db,
} from "@/firebase/firebase";

import SellBikeImageUploader from "@/components/SellBikeImageUploader";


export default function SellBikePage() {


  const [loading,setLoading] = useState(false);

  const [success,setSuccess] = useState(false);


  const [images,setImages] = useState<string[]>([]);



  const [form,setForm] = useState({

    name:"",
    mobile:"",
    brand:"",
    model:"",
    year:"",
    km:"",
    price:"",
    location:"",
    description:""

  });





  const handleChange = (

    e:React.ChangeEvent<
    HTMLInputElement | HTMLTextAreaElement
    >

  )=>{


    setForm({

      ...form,

      [e.target.name]:e.target.value

    });


  };








  const submitHandler = async(

    e:React.FormEvent

  )=>{


    e.preventDefault();


    try{


      setLoading(true);



      await addDoc(

        collection(db,"sellRequests"),

        {


          ...form,


          images,


          status:"Pending",


          createdAt:serverTimestamp()


        }

      );





      setSuccess(true);





      const message = `

🏍️ OLD BIKES HUB SELL REQUEST


Name:
${form.name}


Mobile:
${form.mobile}


Bike:
${form.brand} ${form.model}


Year:
${form.year}


KM:
${form.km}


Expected Price:
${form.price}


Location:
${form.location}


Description:
${form.description}


Images:
${images.length} uploaded


`;





      window.open(

        `https://wa.me/918789192394?text=${encodeURIComponent(message)}`,

        "_blank"

      );







      setForm({

        name:"",
        mobile:"",
        brand:"",
        model:"",
        year:"",
        km:"",
        price:"",
        location:"",
        description:""

      });



      setImages([]);




    }

    catch(error){


      console.log(error);


      alert(
        "Something went wrong"
      );


    }

    finally{


      setLoading(false);


    }


  };









  return(


    <main className="
    min-h-screen
    bg-gray-100
    py-16
    ">


      <section className="
      bg-black
      py-16
      text-center
      text-white
      ">


        <h1 className="
        text-5xl
        font-black
        ">

          Sell Your Bike

        </h1>



        <p className="
        mt-4
        text-gray-400
        ">

          Get the best price for your old bike

        </p>


      </section>









      <section className="
      mx-auto
      max-w-3xl
      px-6
      py-12
      ">




      {
        success &&

        <div className="
        mb-6
        flex
        items-center
        gap-3
        rounded-xl
        bg-green-100
        p-5
        font-bold
        text-green-700
        ">

          <CheckCircle/>

          Request Submitted Successfully


        </div>

      }









      <form

      onSubmit={submitHandler}

      className="
      space-y-5
      rounded-3xl
      bg-white
      p-8
      shadow-xl
      "

      >







      <input

      required

      name="name"

      value={form.name}

      onChange={handleChange}

      placeholder="Your Name"

      className="
      w-full
      rounded-xl
      border
      p-4
      "

      />







      <input

      required

      name="mobile"

      value={form.mobile}

      onChange={handleChange}

      placeholder="Mobile Number"

      className="
      w-full
      rounded-xl
      border
      p-4
      "

      />







      <input

      required

      name="brand"

      value={form.brand}

      onChange={handleChange}

      placeholder="Bike Brand"

      className="
      w-full
      rounded-xl
      border
      p-4
      "

      />







      <input

      required

      name="model"

      value={form.model}

      onChange={handleChange}

      placeholder="Bike Model"

      className="
      w-full
      rounded-xl
      border
      p-4
      "

      />








      <div className="
      grid
      gap-5
      md:grid-cols-2
      ">



      <input

      name="year"

      value={form.year}

      onChange={handleChange}

      placeholder="Manufacturing Year"

      className="
      rounded-xl
      border
      p-4
      "

      />





      <input

      name="km"

      value={form.km}

      onChange={handleChange}

      placeholder="KM Driven"

      className="
      rounded-xl
      border
      p-4
      "

      />


      </div>








      <input

      name="price"

      value={form.price}

      onChange={handleChange}

      placeholder="Expected Price"

      className="
      w-full
      rounded-xl
      border
      p-4
      "

      />








      <input

      name="location"

      value={form.location}

      onChange={handleChange}

      placeholder="City"

      className="
      w-full
      rounded-xl
      border
      p-4
      "

      />









      <textarea

      name="description"

      value={form.description}

      onChange={handleChange}

      placeholder="Bike Condition"

      className="
      h-32
      w-full
      rounded-xl
      border
      p-4
      "

      />







      {/* IMAGE UPLOAD */}

      <SellBikeImageUploader

      images={images}

      setImages={setImages}

      />









      <button

      disabled={loading}

      className="
      w-full
      rounded-xl
      bg-orange-500
      py-4
      font-black
      text-white
      hover:bg-orange-600
      "

      >


      {
        loading

        ?

        "Submitting..."

        :

        "Submit Bike Details"

      }


      </button>






      </form>





      </section>




    </main>


  );


}