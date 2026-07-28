"use client";

import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import {
  isWishlisted,
  toggleWishlist,
} from "@/lib/wishlist";

interface WishlistButtonProps {
  bikeId: string;
}

export default function WishlistButton({
  bikeId,
}: WishlistButtonProps) {
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    setLiked(isWishlisted(bikeId));
  }, [bikeId]);

  const handleClick = () => {
    const status = toggleWishlist(bikeId);

    setLiked(status);

    window.dispatchEvent(
      new Event("wishlistUpdated")
    );
  };

  return (
    <button
      onClick={handleClick}
      className={`rounded-full p-2 shadow-lg transition duration-300 ${
        liked
          ? "bg-red-500 text-white"
          : "bg-white text-gray-700 hover:bg-red-500 hover:text-white"
      }`}
    >
      <Heart
        size={20}
        fill={liked ? "currentColor" : "none"}
      />
    </button>
  );
}