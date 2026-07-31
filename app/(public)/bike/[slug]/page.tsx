"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

import {
  collection,
  getDocs,
  query,
  where,
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

  /*
  ========================================
  FETCH BIKE
  ========================================
  */

  useEffect(() => {
    const fetchBike = async () => {
      try {
        if (!slug) return;

        const q = query(
          collection(db, "bikes"),
          where("slug", "==", slug)
        );

        const snapshot = await getDocs(q);

        if (!snapshot.empty) {
          const bikeDoc = snapshot.docs[0];

          const bikeData: BikeType = {
            id: bikeDoc.id,
            ...(bikeDoc.data() as Omit<BikeType, "id">),
          };

          setBike(bikeData);

          if (
            bikeData.images &&
            bikeData.images.length > 0
          ) {
            setActiveImage(bikeData.images[0]);
          } else if (bikeData.image) {
            setActiveImage(bikeData.image);
          }
        } else {
          setBike(null);
        }
      } catch (error) {
        console.error("Bike Fetch Error:", error);
        setBike(null);
      } finally {
        setLoading(false);
      }
    };

    fetchBike();
  }, [slug]);

  /*
  ========================================
  LOADING
  ========================================
  */

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-100">
        <div className="h-14 w-14 animate-spin rounded-full border-4 border-orange-500 border-t-transparent" />
      </main>
    );
  }

  /*
  ========================================
  BIKE NOT FOUND
  ========================================
  */

  if (!bike) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-5 bg-gray-100 px-5">
        <h1 className="text-4xl font-black text-gray-900">
          Bike Not Found
        </h1>

        <p className="text-gray-500">
          This bike listing may have been removed.
        </p>

        <Link
          href="/buy-bikes"
          className="rounded-xl bg-orange-500 px-6 py-3 font-bold text-white transition hover:bg-orange-600"
        >
          Back To Bikes
        </Link>
      </main>
    );
  }

  /*
  ========================================
  GALLERY
  ========================================
  */

  const gallery =
    bike.images && bike.images.length > 0
      ? bike.images
      : bike.image
      ? [bike.image]
      : [];

  /*
  ========================================
  CONTACT
  ========================================
  */

  const phoneNumber = bike.phone
    ? bike.phone.replace(/\D/g, "")
    : "";

  const whatsapp = phoneNumber
    ? `https://wa.me/${phoneNumber}`
    : "#";

  const call = bike.phone
    ? `tel:${bike.phone}`
    : "#";

  /*
  ========================================
  SHARE URL
  ========================================
  */

  const getBikeUrl = () => {
    if (typeof window === "undefined") {
      return "";
    }

    return window.location.href;
  };

  /*
  ========================================
  MAIN SHARE
  ========================================
  */

  const handleShare = async () => {
    const url = getBikeUrl();

    if (!url) return;

    const shareData = {
      title: bike.name,
      text: `Check out this bike on Old Bikes Hub: ${bike.name}`,
      url,
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

  /*
  ========================================
  WHATSAPP SHARE
  ========================================
  */

  const handleWhatsAppShare = () => {
    const url = getBikeUrl();

    if (!url) return;

    const message = `Check out this bike on Old Bikes Hub:

${bike.name}

Price: ₹${Number(bike.price || 0).toLocaleString("en-IN")}

Location: ${bike.location}

${url}`;

    const whatsappUrl =
      `https://wa.me/?text=${encodeURIComponent(message)}`;

    window.open(
      whatsappUrl,
      "_blank",
      "noopener,noreferrer"
    );
  };

  /*
  ========================================
  COPY LINK
  ========================================
  */

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

  /*
  ========================================
  PAGE
  ========================================
  */

  return (
    <main className="min-h-screen bg-gray-100 py-6 sm:py-10">
      <div className="mx-auto max-w-7xl space-y-8 px-4 sm:px-6">

        {/* =================================
            BACK BUTTON
        ================================= */}

        <Link
          href="/buy-bikes"
          className="inline-flex items-center gap-2 font-bold text-gray-800 transition hover:text-orange-500"
        >
          <ArrowLeft size={18} />

          Back To Bikes
        </Link>

        {/* =================================
            MAIN CONTENT
        ================================= */}

        <div className="grid gap-8 lg:grid-cols-2">

          {/* =================================
              IMAGE SECTION
          ================================= */}

          <div className="space-y-5">

            {/* MAIN IMAGE */}

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
                    onClick={() =>
                      setActiveImage(img)
                    }
                    className={`overflow-hidden rounded-xl border-4 transition ${
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

          {/* =================================
              DETAILS SECTION
          ================================= */}

          <div className="rounded-3xl bg-white p-5 shadow-xl sm:p-8">

            {/* =================================
                BRAND + STATUS
            ================================= */}

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

            {/* =================================
                BIKE NAME
            ================================= */}

            <h1 className="mt-6 text-3xl font-black leading-tight sm:text-4xl">
              {bike.name}
            </h1>

            {/* =================================
                PRICE
            ================================= */}

            <div className="mt-6">
              <p className="text-sm font-bold uppercase tracking-wide text-gray-500">
                Price
              </p>

              <p className="mt-1 text-4xl font-black text-orange-500">
                ₹
                {Number(
                  bike.price || 0
                ).toLocaleString("en-IN")}
              </p>
            </div>

            {/* =================================
                SHARE SECTION
            ================================= */}

            <div className="mt-6 rounded-2xl bg-gray-50 p-5">

              <div className="flex items-center gap-2">
                <Share2
                  size={22}
                  className="text-orange-500"
                />

                <h2 className="text-xl font-black">
                  Share This Bike
                </h2>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-3">

                {/* SHARE */}

                <button
                  type="button"
                  onClick={handleShare}
                  className="flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-4 py-3 font-bold text-white shadow-sm transition hover:bg-orange-600 active:scale-95"
                >
                  <Share2 size={19} />

                  Share Bike
                </button>

                {/* WHATSAPP SHARE */}

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

              {copied && (
                <p className="mt-3 text-sm font-bold text-green-600">
                  Bike link copied successfully!
                </p>
              )}

            </div>

            {/* =================================
                BIKE INFORMATION
            ================================= */}

            <div className="mt-8 grid grid-cols-2 gap-4">

              {/* YEAR */}

              <div className="rounded-2xl bg-gray-100 p-4">

                <div className="flex items-center gap-2 text-gray-500">
                  <Calendar size={19} />

                  <p className="text-xs font-bold">
                    Year
                  </p>
                </div>

                <p className="mt-2 font-black">
                  {bike.year}
                </p>

              </div>

              {/* RUNNING */}

              <div className="rounded-2xl bg-gray-100 p-4">

                <div className="flex items-center gap-2 text-gray-500">
                  <Gauge size={19} />

                  <p className="text-xs font-bold">
                    Running
                  </p>
                </div>

                <p className="mt-2 font-black">
                  {bike.km} KM
                </p>

              </div>

              {/* LOCATION */}

              <div className="rounded-2xl bg-gray-100 p-4">

                <div className="flex items-center gap-2 text-gray-500">
                  <MapPin size={19} />

                  <p className="text-xs font-bold">
                    Location
                  </p>
                </div>

                <p className="mt-2 font-black">
                  {bike.location}
                </p>

              </div>

              {/* STATUS */}

              <div className="rounded-2xl bg-gray-100 p-4">

                <p className="text-xs font-bold text-gray-500">
                  Status
                </p>

                <p
                  className={`mt-2 font-black ${
                    bike.status === "Available"
                      ? "text-green-600"
                      : bike.status === "Pending"
                      ? "text-yellow-600"
                      : "text-red-600"
                  }`}
                >
                  {bike.status || "Available"}
                </p>

              </div>

            </div>

            {/* =================================
                BADGES
            ================================= */}

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

            {/* =================================
                DESCRIPTION
            ================================= */}

            <div className="mt-8">

              <h2 className="text-2xl font-black">
                Description
              </h2>

              <p className="mt-3 leading-7 text-gray-600">
                {bike.description ||
                  "No description available."}
              </p>

            </div>


            {/* =================================
                CONTACT BUTTONS
            ================================= */}

            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">

              {/* WHATSAPP */}

              <a
                href={whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center justify-center gap-2 rounded-xl py-4 font-bold text-white transition active:scale-95 ${
                  phoneNumber
                    ? "bg-green-500 hover:bg-green-600"
                    : "pointer-events-none bg-gray-400"
                }`}
              >
                <MessageCircle size={22} />

                WhatsApp Inquiry
              </a>

              {/* CALL */}

              <a
                href={call}
                className={`flex items-center justify-center gap-2 rounded-xl py-4 font-bold text-white transition active:scale-95 ${
                  bike.phone
                    ? "bg-orange-500 hover:bg-orange-600"
                    : "pointer-events-none bg-gray-400"
                }`}
              >
                <Phone size={22} />

                Call Seller
              </a>

            </div>

          </div>

        </div>

      </div>
    </main>
  );
}