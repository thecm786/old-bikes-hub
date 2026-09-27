"use client";

import { useSyncExternalStore } from "react";
import { isWishlisted, getWishlistCount } from "@/lib/wishlist";

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener("wishlistUpdated", callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener("wishlistUpdated", callback);
  };
}

export function useWishlisted(id: string) {
  return useSyncExternalStore(subscribe, () => isWishlisted(id), () => false);
}

export function useWishlistCount() {
  return useSyncExternalStore(subscribe, getWishlistCount, () => 0);
}
