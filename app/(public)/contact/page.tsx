"use client";

import { useEffect, useState } from "react";

import {
  Mail,
  Phone,
  MapPin,
  MessageCircle,
  Send,
  ShieldCheck,
} from "lucide-react";

import {
  addDoc,
  collection,
  serverTimestamp,
} from "firebase/firestore";

import { db } from "@/firebase/firebase";

export default function ContactPage() {
const [sending, setSending] = useState(false);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);

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

    setSubmitted(true);

    setForm({
      name: "",
      phone: "",
      email: "",
      message: "",
    });
  };

  return (
    <main className="min-h-screen bg-gray-100">

      {/* HERO SECTION */}

      <section className="bg-gradient-to-r from-black via-gray-900 to-orange-500 px-5 py-16 text-white md:px-8">

        <div className="mx-auto max-w-7xl">

          <div className="max-w-3xl">

            <div className="mb-4 flex items-center gap-2 text-sm font-bold text-orange-400">
              <ShieldCheck size={18} />
              Old Bikes Hub Support
            </div>

            <h1 className="text-4xl font-black md:text-6xl">
              Contact Us
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-7 text-gray-300 md:text-lg">
              Have a question about buying, selling, or listing a used bike?
              Our team is here to help you.
            </p>

          </div>

        </div>

      </section>



        {/* ================================
    PART 2 — CONTACT FORM SECTION
================================= */}

<section className="mx-auto mt-10 max-w-7xl px-4 pb-16">
  <div className="grid gap-8 lg:grid-cols-2">

    {/* LEFT — CONTACT INFORMATION */}
    <div className="rounded-3xl bg-black p-8 text-white shadow-xl md:p-10">

      <div className="mb-8">
        <p className="text-sm font-bold uppercase tracking-wider text-orange-500">
          Get In Touch
        </p>

        <h2 className="mt-2 text-3xl font-black md:text-4xl">
          We’re here to help.
        </h2>

        <p className="mt-4 leading-7 text-gray-400">
          Have a question about a bike, selling your bike, or anything
          related to Old Bikes Hub? Send us a message and our team will
          get back to you.
        </p>
      </div>

      {/* CONTACT INFO */}
      <div className="space-y-5">

        {/* PHONE */}
        <div className="flex items-center gap-4 rounded-2xl bg-white/10 p-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-orange-500">
            📞
          </div>

          <div>
            <p className="text-sm text-gray-400">
              Call Us
            </p>

            <a
              href="tel:+919999999999"
              className="font-bold transition hover:text-orange-500"
            >
              +91 99999 99999
            </a>
          </div>
        </div>

        {/* WHATSAPP */}
        <div className="flex items-center gap-4 rounded-2xl bg-white/10 p-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-green-600">
            💬
          </div>

          <div>
            <p className="text-sm text-gray-400">
              WhatsApp
            </p>

            <a
              href="https://wa.me/919999999999"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold transition hover:text-orange-500"
            >
              Chat with us
            </a>
          </div>
        </div>

        {/* EMAIL */}
        <div className="flex items-center gap-4 rounded-2xl bg-white/10 p-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-orange-500">
            ✉️
          </div>

          <div>
            <p className="text-sm text-gray-400">
              Email
            </p>

            <a
              href="mailto:info@oldbikeshub.in"
              className="font-bold transition hover:text-orange-500"
            >
              info@oldbikeshub.in
            </a>
          </div>
        </div>

        {/* LOCATION */}
        <div className="flex items-center gap-4 rounded-2xl bg-white/10 p-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-orange-500">
            📍
          </div>

          <div>
            <p className="text-sm text-gray-400">
              Location
            </p>

            <p className="font-bold">
              Bihar, India
            </p>
          </div>
        </div>

      </div>

      {/* SMALL TRUST BOX */}
      <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-5">
        <p className="text-sm font-bold text-orange-500">
          Old Bikes Hub
        </p>

        <p className="mt-2 text-sm leading-6 text-gray-400">
          Trusted platform for buying and selling used bikes.
          Connect directly with genuine buyers and sellers.
        </p>
      </div>

    </div>


    {/* RIGHT — CONTACT FORM */}
    <div className="rounded-3xl bg-white p-8 shadow-xl md:p-10">

      <div className="mb-8">
        <p className="text-sm font-bold uppercase tracking-wider text-orange-500">
          Send Message
        </p>

        <h2 className="mt-2 text-3xl font-black text-gray-900">
          Contact Us
        </h2>

        <p className="mt-3 text-gray-500">
          Fill out the form below and we’ll get back to you.
        </p>
      </div>


      <form
  onSubmit={async (e) => {
    e.preventDefault();

    const form = e.currentTarget;

    const formData = new FormData(form);

    const name = String(formData.get("name") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const phone = String(formData.get("phone") || "").trim();
    const subject = String(formData.get("subject") || "").trim();
    const message = String(formData.get("message") || "").trim();

    if (!name || !email || !subject || !message) {
      alert("Please fill all required fields.");
      return;
    }

    try {
      setSending(true);

      await addDoc(collection(db, "contactMessages"), {
  name,
  email,
  phone,
  subject,
  message,
  status: "New",
  createdAt: serverTimestamp(),
});

const whatsappNumber = "918789192394";

const whatsappMessage = `
🔔 *New Contact Message - Old Bikes Hub*

👤 *Name:* ${name}

📧 *Email:* ${email}

📱 *Phone:* ${phone || "Not provided"}

📌 *Subject:* ${subject}

💬 *Message:*
${message}
`;

const whatsappUrl =
  `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    whatsappMessage
  )}`;

window.location.href = whatsappUrl;

alert("Message submitted successfully.");

form.reset();

    } catch (error) {
      console.error("Contact form error:", error);

      alert("Message send nahi ho paya. Please try again.");

    } finally {
      setSending(false);
    }
  }}
        className="space-y-5"
      >

        {/* NAME */}
        <div>
          <label
            htmlFor="name"
            className="mb-2 block text-sm font-bold text-gray-700"
          >
            Full Name
          </label>

          <input
            id="name"
            name="name"
            type="text"
            required
            placeholder="Enter your name"
            className="
              w-full
              rounded-xl
              border
              border-gray-200
              bg-gray-50
              px-4
              py-3
              outline-none
              transition
              focus:border-orange-500
              focus:bg-white
              focus:ring-2
              focus:ring-orange-100
            "
          />
        </div>


        {/* EMAIL */}
        <div>
          <label
            htmlFor="email"
            className="mb-2 block text-sm font-bold text-gray-700"
          >
            Email Address
          </label>

          <input
            id="email"
            name="email"
            type="email"
            required
            placeholder="Enter your email"
            className="
              w-full
              rounded-xl
              border
              border-gray-200
              bg-gray-50
              px-4
              py-3
              outline-none
              transition
              focus:border-orange-500
              focus:bg-white
              focus:ring-2
              focus:ring-orange-100
            "
          />
        </div>


        {/* PHONE */}
        <div>
          <label
            htmlFor="phone"
            className="mb-2 block text-sm font-bold text-gray-700"
          >
            Phone Number
          </label>

          <input
            id="phone"
            name="phone"
            type="tel"
            placeholder="+91 XXXXX XXXXX"
            className="
              w-full
              rounded-xl
              border
              border-gray-200
              bg-gray-50
              px-4
              py-3
              outline-none
              transition
              focus:border-orange-500
              focus:bg-white
              focus:ring-2
              focus:ring-orange-100
            "
          />
        </div>


        {/* SUBJECT */}
        <div>
          <label
            htmlFor="subject"
            className="mb-2 block text-sm font-bold text-gray-700"
          >
            Subject
          </label>

          <select
            id="subject"
            name="subject"
            required
            className="
              w-full
              rounded-xl
              border
              border-gray-200
              bg-gray-50
              px-4
              py-3
              outline-none
              transition
              focus:border-orange-500
              focus:bg-white
              focus:ring-2
              focus:ring-orange-100
            "
          >
            <option value="">
              Select a subject
            </option>

            <option value="buy-bike">
              Buying a Bike
            </option>

            <option value="sell-bike">
              Selling a Bike
            </option>

            <option value="listing">
              Bike Listing
            </option>

            <option value="technical">
              Technical Issue
            </option>

            <option value="other">
              Other
            </option>
          </select>
        </div>


        {/* MESSAGE */}
        <div>
          <label
            htmlFor="message"
            className="mb-2 block text-sm font-bold text-gray-700"
          >
            Message
          </label>

          <textarea
            id="message"
            name="message"
            required
            rows={5}
            placeholder="Write your message..."
            className="
              w-full
              resize-none
              rounded-xl
              border
              border-gray-200
              bg-gray-50
              px-4
              py-3
              outline-none
              transition
              focus:border-orange-500
              focus:bg-white
              focus:ring-2
              focus:ring-orange-100
            "
          />
        </div>


        {/* SUBMIT */}
<button
  type="submit"
  disabled={sending}
  className="
    w-full
    rounded-xl
    bg-gradient-to-r
    from-orange-500
    to-red-500
    px-6
    py-4
    font-black
    text-white
    shadow-lg
    transition
    hover:-translate-y-0.5
    hover:shadow-xl
    active:translate-y-0
    disabled:cursor-not-allowed
    disabled:opacity-60
  "
>
  {sending ? "Sending..." : "Send Message →"}
</button>


        <p className="text-center text-xs text-gray-400">
          We usually respond within 24 hours.
        </p>

      </form>

    </div>

  </div>
</section>

    </main>
  );
}

