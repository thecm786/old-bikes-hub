"use client";

import { useState } from "react";


export default function AddBike() {


  const [form, setForm] = useState({

    brand: "",
    model: "",
    price: "",
    year: "",
    km: "",
    owner: "",
    location: "",
    description: "",
    image: "",

  });



  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {

    setForm({

      ...form,

      [e.target.name]: e.target.value,

    });

  };



  const handleSubmit = (e: React.FormEvent) => {

    e.preventDefault();



    const oldBikes = JSON.parse(
      localStorage.getItem("bikes") || "[]"
    );



    const newBike = {


      id: Date.now(),


      slug:

        form.model
        .toLowerCase()
        .replaceAll(" ", "-"),


      name: form.model,


      brand: form.brand,


      price: form.price,


      year: form.year,


      km: form.km,


      owner: form.owner,


      location: form.location,


      description: form.description,


      image: form.image,


    };



    localStorage.setItem(

      "bikes",

      JSON.stringify([
        ...oldBikes,
        newBike
      ])

    );



    alert("Bike Added Successfully");



    setForm({

      brand:"",
      model:"",
      price:"",
      year:"",
      km:"",
      owner:"",
      location:"",
      description:"",
      image:"",

    });


  };




  return (

    <main>


      <section className="bg-black py-16 text-center text-white">


        <h1 className="text-4xl font-bold">
          Add New Bike
        </h1>


      </section>





      <section className="mx-auto max-w-3xl px-6 py-12">


        <form

          onSubmit={handleSubmit}

          className="space-y-5 rounded-2xl bg-white p-8 shadow-xl"

        >



          <input
            name="image"
            value={form.image}
            onChange={handleChange}
            placeholder="Bike Image URL"
            className="w-full rounded-lg border p-3"
          />



          <input
            name="brand"
            value={form.brand}
            onChange={handleChange}
            placeholder="Bike Brand"
            className="w-full rounded-lg border p-3"
          />



          <input
            name="model"
            value={form.model}
            onChange={handleChange}
            placeholder="Bike Model"
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

            placeholder="Bike Description"

            className="h-32 w-full rounded-lg border p-3"

          />



          <button

            type="submit"

            className="w-full rounded-xl bg-orange-500 py-4 font-bold text-white"

          >

            Add Bike

          </button>



        </form>


      </section>


    </main>

  );

}