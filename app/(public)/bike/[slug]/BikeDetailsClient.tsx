"use client";
import SiteImage from "@/components/SiteImage";
import { bikeFullName } from "@/lib/bikeDisplay";
import { bikeListingContent } from "@/lib/bikeListingSummary";
import { trackBuyerEnquiry } from "@/lib/analytics";
import { usedBikeBrandCollectionPath } from "@/lib/usedBikeCollections";
import { bikePath } from "@/lib/bikeUrls";
import { useSiteConfig } from "@/providers/SiteConfigProvider";


import { useState, type ReactNode } from "react";

import Link from "next/link";



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

export default function BikeDetailsClient({ bike, children }: { bike: BikeType; children?: ReactNode }) {
  const siteConfig = useSiteConfig();
  const [activeImage, setActiveImage] = useState(bike.images?.[0] || bike.image || "");
  const [copied, setCopied] = useState(false);
  const gallery =
    bike.images &&
    bike.images.length > 0
      ? bike.images
      : bike.image
      ? [bike.image]
      : [];
  const bikeImageAlt = `${bikeFullName(bike.brand, bike.name)}${bike.year ? ` ${bike.year}` : ""}${bike.location ? ` in ${bike.location}` : ""}`;
  const displayPrice = Number(String(bike.price).replace(/[^\d.]/g, ""));
  const listingUrl = `https://www.oldbikeshub.com${bikePath(bike)}`;
  const listingStatus = bike.status ?? "Available";
  const isAvailable = listingStatus === "Available";
  const enquiryLabel = isAvailable ? "Enquire on WhatsApp" : "Ask about similar bikes";
  const enquiryTracking = {
    id: bike.id,
    slug: bike.slug,
    brand: bike.brand,
    status: listingStatus,
  };
  const enquiryMessage = [
    isAvailable ? "Hello Old Bikes Hub, I'm interested in this bike:" : "Hello Old Bikes Hub, I am looking for a similar available bike. I saw this listing:",
    `${bikeFullName(bike.brand, bike.name)}${bike.year ? ` · ${bike.year}` : ""}`,
    `Price: ${displayPrice > 0 ? `₹${displayPrice.toLocaleString("en-IN")}` : "Price on enquiry"}`,
    `Kilometres: ${bike.km ? `${bike.km} km` : "Confirm on enquiry"}`,
    `Location: ${bike.location || "Confirm on enquiry"}`,
    `Listing: ${listingUrl}`,
    isAvailable
      ? "Please confirm availability, documents and inspection time."
      : "Please share similar available bikes, documents and inspection time.",
  ].join("\n");

  const whatsapp = `https://wa.me/${siteConfig.whatsapp}?text=${encodeURIComponent(enquiryMessage)}`;
  const call = `tel:${siteConfig.phone}`;
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
                <SiteImage width={1200} height={800} sizes="(max-width: 768px) 100vw, 60vw" loading="eager"
                  src={activeImage}
                  alt={bikeImageAlt}
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
                      <SiteImage width={320} height={192} sizes="(max-width: 768px) 25vw, 15vw"
                        src={img}
                        alt={`${bikeImageAlt} photo ${index + 1}`}
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
              {bikeFullName(bike.brand, bike.name)}
            </h1>

            {/* =========================
                PRICE + SHARE
            ========================= */}

            <div className="mt-6 rounded-2xl bg-gray-50 p-5">

              <p className="text-sm font-bold uppercase tracking-wide text-gray-500">
                Price
              </p>

              <p className="mt-1 text-3xl font-black text-orange-500 sm:text-4xl">
                {displayPrice > 0 ? `₹${displayPrice.toLocaleString("en-IN")}` : "Price on enquiry"}
              </p>

              <a
                href={whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${enquiryLabel} about ${bikeFullName(bike.brand, bike.name)} on WhatsApp`}
                onClick={() => trackBuyerEnquiry("whatsapp", "bike_details_primary", enquiryTracking)}
                className="mt-5 flex items-center justify-center gap-2 rounded-xl bg-green-500 px-4 py-4 font-bold text-white shadow-sm transition hover:bg-green-600 active:scale-95"
              >
                <MessageCircle size={22} />
                {enquiryLabel}
              </a>

              {/* SHARE TITLE */}

              <div className="mt-6 flex items-center gap-2 border-t border-gray-200 pt-6">
                <Share2
                  size={22}
                  className="text-orange-500"
                />

                <h2 className="text-xl font-black">
                  Share this bike
                </h2>
              </div>

              {/* SHARE BUTTONS */}

              <div className="mt-4 grid gap-3 sm:grid-cols-2">

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
                Send this listing to someone who may be interested.
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
    For enquiries from any city in Bihar, contact Old Bikes Hub directly. Confirm availability, inspection options and transport arrangements before purchase.
  </p>

  <div className="mt-5 grid gap-4 sm:grid-cols-2">

    {/* WHATSAPP */}

    <a
      href={whatsapp}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${enquiryLabel} about ${bikeFullName(bike.brand, bike.name)} on WhatsApp`}
      onClick={() => trackBuyerEnquiry("whatsapp", "bike_details_contact", enquiryTracking)}
      className="flex items-center justify-center gap-2 rounded-xl bg-green-500 py-4 font-bold text-white transition hover:bg-green-600 active:scale-95"
    >
      <MessageCircle size={22} />
      {enquiryLabel}
    </a>

    {/* CALL */}

    <a
      href={call}
      onClick={() => trackBuyerEnquiry("phone", "bike_details_contact", enquiryTracking)}
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
              {bikeListingContent(bike)}
            </p>

            <div className="mt-6 flex flex-wrap gap-4 text-sm font-semibold">
              <Link href={usedBikeBrandCollectionPath(bike.brand)} className="text-orange-700 underline">More used {bike.brand} bikes</Link>
              <Link href="/used-bikes-bihar" className="text-orange-700 underline">Browse all used bikes in Bihar</Link>
            </div>


          </div>

        </div>

        {children}
      </div>
    </main>
  );
}
