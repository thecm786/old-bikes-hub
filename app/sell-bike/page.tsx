"use client";

import { useState } from "react";

export default function SellBikePage() {
  const [form, setForm] = useState({
    name: "",
    mobile: "",
    brand: "",
    model: "",
    year: "",
    km: "",
    price: "",
    location: "",
    description: "",
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

    alert("Button Clicked Successfully");

    const message = `🏍️ OLD BIKES HUB - SELL BIKE REQUEST

Name: ${form.name}

Mobile: ${form.mobile}

Brand: ${form.brand}

Model: ${form.model}

Year: ${form.year}

KM Driven: ${form.km}

Expected Price: ${form.price}

Location: ${form.location}

Description:
${form.description}`;

    window.open(
      `https://wa.me/918789192394?text=${encodeURIComponent(message)}`,
      "_blank"
    );
  };

  return (
    <main className="min-h-screen bg-gray-100">
      <section className="bg-black py-16 text-center text-white">
        <h1 className="text-5xl font-bold">Sell Your Bike</h1>

        <p className="mt-4 text-gray-300">
          Get the Best Price for Your Used Bike
        </p>
      </section>

      <section className="mx-auto max-w-3xl px-6 py-12">
        <form
          onSubmit={handleSubmit}
          className="space-y-5 rounded-2xl bg-white p-8 shadow-lg"
        >
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Full Name"
            className="w-full rounded-lg border p-3"
            required
          />

          <input
            name="mobile"
            value={form.mobile}
            onChange={handleChange}
            placeholder="Mobile Number"
            className="w-full rounded-lg border p-3"
            required
          />

          <input
            name="brand"
            value={form.brand}
            onChange={handleChange}
            placeholder="Bike Brand"
            className="w-full rounded-lg border p-3"
            required
          />

          <input
            name="model"
            value={form.model}
            onChange={handleChange}
            placeholder="Bike Model"
            className="w-full rounded-lg border p-3"
            required
          />

          <input
            name="year"
            value={form.year}
            onChange={handleChange}
            placeholder="Manufacturing Year"
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
            name="price"
            value={form.price}
            onChange={handleChange}
            placeholder="Expected Price"
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
            placeholder="Bike Condition / Additional Details"
            className="h-32 w-full rounded-lg border p-3"
          />

          <button
            type="submit"
            className="w-full rounded-lg bg-orange-500 py-4 text-lg font-bold text-white hover:bg-orange-600"
          >
            Submit Bike Details
          </button>
        </form>
      </section>
    </main>
  );
}