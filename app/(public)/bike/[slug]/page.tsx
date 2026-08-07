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

  /*
   * =========================
   * SLUG
   * =========================
   */

  const slugParam = params?.slug;

  const slug = Array.isArray(slugParam)
    ? slugParam[0]
    : slugParam;

  /*
   * =========================
   * STATE
   * =========================
   */

  const [bike, setBike] = useState<BikeType | null>(null);

  const [loading, setLoading] = useState(true);

  const [activeImage, setActiveImage] = useState("");

  const [copied, setCopied] = useState(false);

  /*
   * =========================
   * FETCH BIKE BY SLUG
   * =========================
   */

  useEffect(() => {
    const fetchBike = async () => {
      if (!slug) {
        setBike(null);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        /*
         * IMPORTANT:
         *
         * We search Firestore using
         * the slug FIELD instead of
         * assuming slug is document ID.
         */

        const bikesRef = collection(db, "bikes");

        const bikeQuery = query(
          bikesRef,
          where("slug", "==", slug)
        );

        const snapshot = await getDocs(bikeQuery);

        /*
         * =========================
         * BIKE NOT FOUND
         * =========================
         */

        if (snapshot.empty) {
          console.warn(
            "Bike not found for slug:",
            slug
          );

          setBike(null);

          return;
        }

        /*
         * =========================
         * FIRST MATCH
         * =========================
         */

        const bikeDoc = snapshot.docs[0];

        const data =
          bikeDoc.data() as Omit<
            BikeType,
            "id"
          >;

        const bikeData: BikeType = {
          id: bikeDoc.id,
          ...data,
        };

        setBike(bikeData);

        /*
         * =========================
         * ACTIVE IMAGE
         * =========================
         */

        if (
          bikeData.images &&
          bikeData.images.length > 0
        ) {
          setActiveImage(
            bikeData.images[0]
          );
        } else if (bikeData.image) {
          setActiveImage(
            bikeData.image
          );
        } else {
          setActiveImage("");
        }
      } catch (error) {
        console.error(
          "Error loading bike:",
          error
        );

        setBike(null);
      } finally {
        setLoading(false);
      }
    };

    fetchBike();
  }, [slug]);

  /*
   * =========================
   * LOADING
   * =========================
   */

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-100">
        <div className="flex flex-col items-center gap-4">
          <div className="h-14 w-14 animate-spin rounded-full border-4 border-orange-500 border-t-transparent" />

          <p className="font-semibold text-gray-600">
            Loading bike details...
          </p>
        </div>
      </main>
    );
  }

  /*
   * =========================
   * BIKE NOT FOUND
   * =========================
   */

  if (!bike) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-5 bg-gray-100 px-4">
        <div className="text-center">
          <div className="mb-4 text-7xl">
            🏍️
          </div>

          <h1 className="text-3xl font-black sm:text-4xl">
            Bike Not Found
          </h1>

          <p className="mt-2 text-gray-500">
            This bike may have been removed
            or is no longer available.
          </p>
        </div>

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
   * =========================
   * GALLERY
   * =========================
   */

  const gallery =
    bike.images &&
    bike.images.length > 0
      ? bike.images
      : bike.image
      ? [bike.image]
      : [];

  /*
  /* =========================
   CONTACT
========================= */

const OLD_BIKES_HUB_PHONE = "8789192394";

const whatsappNumber = OLD_BIKES_HUB_PHONE.replace(/\D/g, "");

const whatsapp = `https://wa.me/91${whatsappNumber}`;

const call = `tel:+91${whatsappNumber}`;
  /*
   * =========================
   * SHARE URL
   * =========================
   */

  const getBikeUrl = () => {
    if (
      typeof window === "undefined"
    ) {
      return "";
    }

    return window.location.href;
  };

  /*
   * =========================
   * MAIN SHARE
   * =========================
   */

  const handleShare = async () => {
    const url = getBikeUrl();

    if (!url) {
      return;
    }

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
        await navigator.share(
          shareData
        );

        return;
      }

      await navigator.clipboard.writeText(
        url
      );

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

      console.error(
        "Share failed:",
        error
      );
    }
  };

  /*
   * =========================
   * WHATSAPP SHARE
   * =========================
   */

  const handleWhatsAppShare = () => {
    const url = getBikeUrl();

    if (!url) {
      return;
    }

    const message = `Check out this bike on Old Bikes Hub:

${bike.name}

Price: ₹${Number(
      bike.price
    ).toLocaleString("en-IN")}

${url}`;

    const whatsappUrl =
      `https://wa.me/?text=${encodeURIComponent(
        message
      )}`;

    window.open(
      whatsappUrl,
      "_blank",
      "noopener,noreferrer"
    );
  };

  /*
   * =========================
   * COPY LINK
   * =========================
   */

  const handleCopyLink = async () => {
    const url = getBikeUrl();

    if (!url) {
      return;
    }

    try {
      await navigator.clipboard.writeText(
        url
      );

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error(
        "Copy failed:",
        error
      );
    }
  };

  /*
   * =========================
   * STATUS STYLE
   * =========================
   */

  const statusClass =
    bike.status === "Available"
      ? "bg-green-500 text-white"
      : bike.status === "Pending"
      ? "bg-yellow-400 text-black"
      : bike.status === "Sold"
      ? "bg-red-600 text-white"
      : "bg-gray-500 text-white";

  /*
   * =========================
   * PAGE
   * =========================
   */

  return (
    <main className="min-h-screen bg-gray-100 py-6 sm:py-10">
      <div className="mx-auto max-w-7xl space-y-8 px-4 sm:px-6">

        {/* =========================
            BACK BUTTON
        ========================= */}

        <Link
          href="/buy-bikes"
          className="inline-flex items-center gap-2 font-bold text-gray-800 transition hover:text-orange-500"
        >
          <ArrowLeft size={18} />

          Back To Bikes
        </Link>

        {/* =========================
            MAIN GRID
        ========================= */}

        <div className="grid gap-8 lg:grid-cols-2">

          {/* =========================
              IMAGE SECTION
          ========================= */}

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
                <div className="flex h-[350px] items-center justify-center bg-gray-100 text-8xl sm:h-[500px]">
                  🏍️
                </div>
              )}

            </div>

            {/* THUMBNAILS */}

            {gallery.length > 0 && (
              <div className="grid grid-cols-4 gap-3">

                {gallery.map(
                  (img, index) => (
                    <button
                      key={`${img}-${index}`}
                      type="button"
                      onClick={() =>
                        setActiveImage(
                          img
                        )
                      }
                      className={`overflow-hidden rounded-xl border-4 transition ${
                        activeImage === img
                          ? "border-orange-500"
                          : "border-transparent"
                      }`}
                    >
                      <img
                        src={img}
                        alt={`${bike.name} ${
                          index + 1
                        }`}
                        className="h-20 w-full object-cover sm:h-24"
                      />
                    </button>
                  )
                )}

              </div>
            )}

          </div>

          {/* =========================
              DETAILS SECTION
          ========================= */}

          <div className="rounded-3xl bg-white p-5 shadow-xl sm:p-8">

            {/* =========================
                BRAND + STATUS
            ========================= */}

            <div className="flex flex-wrap gap-3">

              {bike.brand && (
                <div className="rounded-full bg-orange-500 px-5 py-2 font-bold text-white">
                  {bike.brand}
                </div>
              )}

              {bike.status && (
                <div
                  className={`rounded-full px-5 py-2 font-bold ${statusClass}`}
                >
                  {bike.status}
                </div>
              )}

            </div>

            {/* =========================
                BIKE NAME
            ========================= */}

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
                ₹
                {Number(
                  bike.price
                ).toLocaleString(
                  "en-IN"
                )}
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
                  onClick={
                    handleShare
                  }
                  className="flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-4 py-3 font-bold text-white shadow-sm transition hover:bg-orange-600 active:scale-95"
                >
                  <Share2 size={19} />

                  {copied
                    ? "Copied!"
                    : "Share Bike"}
                </button>

                {/* WHATSAPP */}

                <button
                  type="button"
                  onClick={
                    handleWhatsAppShare
                  }
                  className="flex items-center justify-center gap-2 rounded-xl bg-green-500 px-4 py-3 font-bold text-white shadow-sm transition hover:bg-green-600 active:scale-95"
                >
                  <MessageCircle
                    size={19}
                  />

                  WhatsApp
                </button>

                {/* COPY LINK */}

                <button
                  type="button"
                  onClick={
                    handleCopyLink
                  }
                  className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 font-bold text-gray-700 shadow-sm transition hover:bg-gray-100 active:scale-95"
                >
                  {copied ? (
                    <>
                      <Check
                        size={19}
                      />

                      Copied
                    </>
                  ) : (
                    <>
                      <Copy
                        size={19}
                      />

                      Copy Link
                    </>
                  )}
                </button>

              </div>

              <p className="mt-3 text-xs text-gray-500">
                Customer is bike ko
                WhatsApp, social apps ya
                link ke through easily
                share kar sakta hai.
              </p>

            </div>

            {/* =========================
                BIKE INFORMATION
            ========================= */}

            <div className="mt-8 grid gap-4 sm:grid-cols-2">

              {/* YEAR */}

              <div className="flex items-center gap-3 rounded-xl bg-gray-100 p-4">
                <Calendar
                  size={22}
                  className="shrink-0 text-orange-500"
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

              {/* KM */}

              <div className="flex items-center gap-3 rounded-xl bg-gray-100 p-4">
                <Gauge
                  size={22}
                  className="shrink-0 text-orange-500"
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

              {/* LOCATION */}

              <div className="flex items-center gap-3 rounded-xl bg-gray-100 p-4 sm:col-span-2">
                <MapPin
                  size={22}
                  className="shrink-0 text-orange-500"
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

            {(bike.featured ||
              bike.verified) && (
              <div className="mt-6 flex flex-wrap gap-4">

                {bike.featured && (
                  <div className="flex items-center gap-2 rounded-xl bg-yellow-400 px-4 py-3 font-bold">
                    <Star
                      size={20}
                      fill="currentColor"
                    />

                    Featured
                  </div>
                )}

                {bike.verified && (
                  <div className="flex items-center gap-2 rounded-xl bg-green-100 px-4 py-3 font-bold text-green-700">
                    <ShieldCheck
                      size={20}
                    />

                    Verified
                  </div>
                )}

              </div>
            )}
              {/* =========================
    CONTACT OLD BIKES HUB
========================= */}

<div className="mt-8 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">

  <h2 className="text-2xl font-black">
    Contact Old Bikes Hub
  </h2>

  <p className="mt-2 text-sm text-gray-500">
    For any enquiries regarding this bike, please contact Old Bikes Hub directly.
  </p>

  <div className="mt-5 grid grid-cols-2 gap-4">

    {/* WHATSAPP */}

    <a
      href={whatsapp}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center justify-center gap-2 rounded-xl bg-green-500 py-4 font-bold text-white transition hover:bg-green-600 active:scale-95"
    >
      <MessageCircle size={22} />
      WhatsApp
    </a>

    {/* CALL */}

    <a
      href={call}
      className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 py-4 font-bold text-white transition hover:bg-blue-700 active:scale-95"
    >
      <Phone size={22} />
      Call
    </a>

  </div>

</div>
            {/* =========================
                DESCRIPTION
            ========================= */}

            <h2 className="mt-8 text-2xl font-black">
              Description
            </h2>

            <p className="mt-3 whitespace-pre-line leading-7 text-gray-600">
              {bike.description ||
                "No description available."}
            </p>


          </div>

        </div>
      </div>
    </main>
  );
}