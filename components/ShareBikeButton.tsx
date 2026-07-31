"use client";

import { useState } from "react";

import {
  Share2,
  Copy,
  Check,
  MessageCircle,
} from "lucide-react";

type ShareBikeButtonProps = {
  bikeName: string;
  slug: string;
};

export default function ShareBikeButton({
  bikeName,
  slug,
}: ShareBikeButtonProps) {
  const [copied, setCopied] = useState(false);

  const getBikeUrl = () => {
    if (typeof window === "undefined") {
      return "";
    }

    return `${window.location.origin}/bike/${slug}`;
  };

  const handleShare = async () => {
    const url = getBikeUrl();

    if (!url) return;

    const shareData = {
      title: bikeName,
      text: `Check out this bike on Old Bikes Hub: ${bikeName}`,
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

      await handleCopy();
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

  const handleWhatsApp = () => {
    const url = getBikeUrl();

    if (!url) return;

    const message =
      `Check out this bike on Old Bikes Hub:\n\n` +
      `${bikeName}\n\n` +
      `${url}`;

    const whatsappUrl =
      `https://wa.me/?text=${encodeURIComponent(message)}`;

    window.open(
      whatsappUrl,
      "_blank",
      "noopener,noreferrer"
    );
  };

  const handleCopy = async () => {
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

  return (
    <div className="mt-5 w-full">
      {/* SHARE HEADER */}

      <div className="mb-3 flex items-center gap-2">
        <Share2
          size={18}
          className="text-orange-500"
        />

        <span className="text-sm font-bold text-gray-700">
          Share this bike
        </span>
      </div>

      {/* SHARE BUTTONS */}

      <div className="flex flex-wrap gap-2">
        {/* MAIN SHARE */}

        <button
          type="button"
          onClick={handleShare}
          className="
            inline-flex
            items-center
            justify-center
            gap-2
            rounded-xl
            bg-orange-500
            px-4
            py-3
            text-sm
            font-black
            text-white
            shadow-sm
            transition-all
            duration-200
            hover:bg-orange-600
            hover:shadow-md
            active:scale-95
          "
        >
          <Share2 size={17} />

          Share Bike
        </button>

        {/* WHATSAPP */}

        <button
          type="button"
          onClick={handleWhatsApp}
          className="
            inline-flex
            items-center
            justify-center
            gap-2
            rounded-xl
            bg-green-500
            px-4
            py-3
            text-sm
            font-black
            text-white
            shadow-sm
            transition-all
            duration-200
            hover:bg-green-600
            hover:shadow-md
            active:scale-95
          "
        >
          <MessageCircle size={17} />

          WhatsApp
        </button>

        {/* COPY LINK */}

        <button
          type="button"
          onClick={handleCopy}
          className="
            inline-flex
            items-center
            justify-center
            gap-2
            rounded-xl
            border
            border-gray-200
            bg-gray-50
            px-4
            py-3
            text-sm
            font-black
            text-gray-700
            transition-all
            duration-200
            hover:border-orange-300
            hover:bg-orange-50
            hover:text-orange-600
            active:scale-95
          "
        >
          {copied ? (
            <>
              <Check
                size={17}
                className="text-green-600"
              />

              Copied
            </>
          ) : (
            <>
              <Copy size={17} />

              Copy Link
            </>
          )}
        </button>
      </div>
    </div>
  );
}