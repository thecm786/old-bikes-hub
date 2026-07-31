"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

import {
  doc,
  getDoc,
} from "firebase/firestore";

import {
  Calendar,
  Gauge,
  MapPin,
  Phone,
  MessageCircle,
  ShieldCheck,
  Star,
  ArrowLeft,
  User,
  Share2,
  Copy,
  Check,
} from "lucide-react";

import { db } from "@/firebase/firebase";

interface BikeType {
  id: string;
  name: string;
  brand: string;
  slug: string;
  price: number | string;
  year: string;
  km: string;
  location: string;
  owner?: string;
  phone?: string;
  image?: string;
  images?: string[];
  description?: string;
  featured?: boolean;
  verified?: boolean;
  status?: string;
}

export default function BikeDetailsPage() {
  const params = useParams();

  const slug = params.slug as string;

  const [bike, setBike] = useState<BikeType | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchBike = async () => {
      try {
        const snap = await getDoc(
          doc(db, "bikes", slug)
        );

        if (snap.exists()) {
          const data = {
            id: snap.id,
            ...(snap.data() as Omit<BikeType, "id">),
          };

          setBike(data);

          if (data.images && data.images.length > 0) {
            setActiveImage(data.images[0]);
          } else if (data.image) {
            setActiveImage(data.image);
          }
        } else {
          setBike(null);
        }
      } catch (error) {
        console.error("Error loading bike:", error);
        setBike(null);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchBike();
    }
  }, [slug]);

  /* =========================
     LOADING
  ========================= */

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <div className="h-14 w-14 animate-spin rounded-full border-4 border-orange-500 border-t-transparent" />
      </div>
    );
  }

  /* =========================
     BIKE NOT FOUND
  ========================= */

  if (!bike) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-5 bg-gray-100">
        <h1 className="text-4xl font-black">
          Bike Not Found
        </h1>

        <Link
          href="/buy-bikes"
          className="rounded-xl bg-orange-500 px-6 py-3 font-bold text-white"
        >
          Back To Bikes
        </Link>
      </div>
    );
  }

  /* =========================
     GALLERY
  ========================= */

  const gallery =
    bike.images && bike.images.length > 0
      ? bike.images
      : bike.image
      ? [bike.image]
      : [];

  /* =========================
     CONTACT
  ========================= */

  const whatsapp = bike.phone
    ? `https://wa.me/${bike.phone.replace(/\D/g, "")}`
    : "#";

  const call = bike.phone
    ? `tel:${bike.phone}`
    : "#";

  /* =========================
     SHARE URL
  ========================= */

  const getBikeUrl = () => {
    if (typeof window === "undefined") {
      return "";
    }

    return window.location.href;
  };

  /* =========================
     MAIN SHARE
  ========================= */

  const handleShare = async () => {
    const url = getBikeUrl();

    if (!url) return;

    const shareData = {
      title: bike.name,
      text: `Check out this bike on Old Bikes Hub: ${bike.name}`,
      url: url,
    };

    try {
      if (
        typeof navigator !== "undefined" &&
        navigator.share
      ) {
        await navigator.share(shareData);
        return;
      }

      await navigator.clipboard.writeText(url);

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      if (
        error instanceof DOMException &&
        error.name === "AbortError"
      ) {
        return;
      }

      console.error("Share failed:", error);
    }
  };

  /* =========================
     WHATSAPP SHARE
  ========================= */

  const handleWhatsAppShare = () => {
    const url = getBikeUrl();

    if (!url) return;

    const message = `Check out this bike on Old Bikes Hub:

${bike.name}

Price: ₹${Number(bike.price).toLocaleString("en-IN")}

${url}`;

    const whatsappUrl =
      `https://wa.me/?text=${encodeURIComponent(message)}`;

    window.open(
      whatsappUrl,
      "_blank",
      "noopener,noreferrer"
    );
  };

  /* =========================
     COPY LINK
  ========================= */

  const handleCopyLink = async () => {
    const url = getBikeUrl();

    if (!url) return;

    try {
      await navigator.clipboard.writeText(url);

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error("Copy failed:", error);
    }
  };

  /* =========================
     PAGE
  ========================= */

  return (
    <main className="min-h-screen bg-gray-100 py-6 sm:py-10">
      <div className="mx-auto max-w-7xl space-y-8 px-4 sm:px-6">

        {/* BACK BUTTON */}

        <Link
          href="/buy-bikes"
          className="inline-flex items-center gap-2 font-bold text-gray-800 hover:text-orange-500"
        >
          <ArrowLeft size={18} />
          Back To Bikes
        </Link>

        {/* MAIN GRID */}

        <div className="grid gap-8 lg:grid-cols-2">

          {/* =========================
              IMAGE SECTION
          ========================= */}

          <div className="space-y-5">

            <div className="overflow-hidden rounded-3xl bg-white shadow-xl">

              {activeImage ? (
                <img
                  src={activeImage}
                  alt={bike.name}
                  className="h-[350px] w-full object-cover sm:h-[500px]"
                />
              ) : (
                <div className="flex h-[350px] items-center justify-center text-8xl sm:h-[500px]">
                  🏍️
                </div>
              )}

            </div>

            {/* THUMBNAILS */}

            {gallery.length > 0 && (
              <div className="grid grid-cols-4 gap-3">

                {gallery.map((img, index) => (
                  <button
                    key={`${img}-${index}`}
                    type="button"
                    onClick={() => setActiveImage(img)}
                    className={`overflow-hidden rounded-xl border-4 ${
                      activeImage === img
                        ? "border-orange-500"
                        : "border-transparent"
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${bike.name} ${index + 1}`}
                      className="h-20 w-full object-cover sm:h-24"
                    />
                  </button>
                ))}

              </div>
            )}

          </div>

          {/* =========================
              DETAILS SECTION
          ========================= */}

          <div className="rounded-3xl bg-white p-5 shadow-xl sm:p-8">

            {/* BRAND + STATUS */}

            <div className="flex flex-wrap gap-3">

              <div className="rounded-full bg-orange-500 px-5 py-2 font-bold text-white">
                {bike.brand}
              </div>

              {bike.status && (
                <div
                  className={`rounded-full px-5 py-2 font-bold ${
                    bike.status === "Available"
                      ? "bg-green-500 text-white"
                      : bike.status === "Pending"
                      ? "bg-yellow-400 text-black"
                      : "bg-red-600 text-white"
                  }`}
                >
                  {bike.status}
                </div>
              )}

            </div>

            {/* BIKE NAME */}

            <h1 className="mt-6 text-3xl font-black leading-tight sm:text-4xl">
              {bike.name}
            </h1>

            {/* =========================
                PRICE + SHARE
            ========================= */}

            <div className="mt-6 rounded-2xl bg-gray-50 p-5">

              <p className="text-sm font-bold uppercase tracking-wide text-gray-500">
                Price
              </p>

              <p className="mt-1 text-3xl font-black text-orange-500 sm:text-4xl">
                ₹{Number(bike.price).toLocaleString("en-IN")}
              </p>

              {/* SHARE TITLE */}

              <div className="mt-6 flex items-center gap-2">
                <Share2
                  size={22}
                  className="text-orange-500"
                />

                <h2 className="text-xl font-black">
                  Share This Bike
                </h2>
              </div>

              {/* SHARE BUTTONS */}

              <div className="mt-4 grid gap-3 sm:grid-cols-3">

                {/* MAIN SHARE */}

                <button
                  type="button"
                  onClick={handleShare}
                  className="flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-4 py-3 font-bold text-white shadow-sm transition hover:bg-orange-600 active:scale-95"
                >
                  <Share2 size={19} />

                  {copied ? "Copied!" : "Share Bike"}
                </button>

                {/* WHATSAPP */}

                <button
                  type="button"
                  onClick={handleWhatsAppShare}
                  className="flex items-center justify-center gap-2 rounded-xl bg-green-500 px-4 py-3 font-bold text-white shadow-sm transition hover:bg-green-600 active:scale-95"
                >
                  <MessageCircle size={19} />

                  WhatsApp
                </button>

                {/* COPY LINK */}

                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 font-bold text-gray-700 shadow-sm transition hover:bg-gray-100 active:scale-95"
                >
                  {copied ? (
                    <>
                      <Check size={19} />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy size={19} />
                      Copy Link
                    </>
                  )}
                </button>

              </div>

              <p className="mt-3 text-xs text-gray-500">
                Customer is bike ko WhatsApp, social apps ya
                link ke through easily share kar sakta hai.
              </p>

            </div>

            {/* =========================
                BIKE INFORMATION
            ========================= */}

            <div className="mt-8 space-y-4">

              <div className="flex items-center gap-3 rounded-xl bg-gray-100 p-4">
                <Calendar
                  size={22}
                  className="shrink-0"
                />

                <div>
                  <p className="text-xs font-bold text-gray-500">
                    Year
                  </p>

                  <p className="font-bold">
                    {bike.year}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-xl bg-gray-100 p-4">
                <Gauge
                  size={22}
                  className="shrink-0"
                />

                <div>
                  <p className="text-xs font-bold text-gray-500">
                    Kilometers
                  </p>

                  <p className="font-bold">
                    {bike.km} KM
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-xl bg-gray-100 p-4">
                <MapPin
                  size={22}
                  className="shrink-0"
                />

                <div>
                  <p className="text-xs font-bold text-gray-500">
                    Location
                  </p>

                  <p className="font-bold">
                    {bike.location}
                  </p>
                </div>
              </div>

            </div>

            {/* =========================
                BADGES
            ========================= */}

            {(bike.featured || bike.verified) && (
              <div className="mt-6 flex flex-wrap gap-4">

                {bike.featured && (
                  <div className="flex items-center gap-2 rounded-xl bg-yellow-400 px-4 py-3 font-bold">
                    <Star size={20} />
                    Featured
                  </div>
                )}

                {bike.verified && (
                  <div className="flex items-center gap-2 rounded-xl bg-green-100 px-4 py-3 font-bold text-green-700">
                    <ShieldCheck size={20} />
                    Verified
                  </div>
                )}

              </div>
            )}

            {/* =========================
                DESCRIPTION
            ========================= */}

            <h2 className="mt-8 text-2xl font-black">
              Description
            </h2>

            <p className="mt-3 leading-7 text-gray-600">
              {bike.description || "No description available."}
            </p>

            {/* =========================
                SELLER
            ========================= */}

            <div className="mt-8 rounded-2xl bg-gray-100 p-5">

              <h2 className="flex items-center gap-2 text-2xl font-black">
                <User size={24} />
                Seller Details
              </h2>

              <p className="mt-3">
                <b>Name:</b>{" "}
                {bike.owner || "Owner"}
              </p>

              <p className="mt-1">
                <b>Location:</b>{" "}
                {bike.location}
              </p>

            </div>

            {/* =========================
                CONTACT BUTTONS
            ========================= */}

            <div className="mt-8 grid grid-cols-2 gap-4">

              <a
                href={whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-xl bg-green-500 py-4 font-bold text-white transition hover:bg-green-600 active:scale-95"
              >
                <MessageCircle size={22} />

                WhatsApp
              </a>

              <a
                href={call}
                className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 py-4 font-bold text-white transition hover:bg-blue-700 active:scale-95"
              >
                <Phone size={22} />

                Call
              </a>

            </div>

            {/* =========================
                SAFETY TIPS
            ========================= */}

            <div className="mt-8 rounded-2xl bg-orange-50 p-5">

              <h3 className="font-black text-orange-600">
                ⚠️ Safety Tips
              </h3>

              <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-gray-700">
                <li>
                  Check RC before buying
                </li>

                <li>
                  Verify seller details
                </li>

                <li>
                  Meet at a safe location
                </li>
              </ul>

            </div>

          </div>

        </div>

      </div>
    </main>
  );
}