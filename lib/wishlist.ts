export const WISHLIST_KEY = "old-bikes-hub-wishlist";

export function getWishlist(): string[] {
  if (typeof window === "undefined") return [];

  try {
    const data: unknown = JSON.parse(localStorage.getItem(WISHLIST_KEY) || "[]");
    return Array.isArray(data) ? data.filter((id): id is string => typeof id === "string") : [];
  } catch { return []; }
}

export function isWishlisted(id: string): boolean {
  return getWishlist().includes(id);
}

export function toggleWishlist(id: string): boolean {
  const wishlist = getWishlist();

  let added = false;

  if (wishlist.includes(id)) {
    const updated = wishlist.filter((item) => item !== id);

    localStorage.setItem(
      WISHLIST_KEY,
      JSON.stringify(updated)
    );

    added = false;
  } else {
    wishlist.push(id);

    localStorage.setItem(
      WISHLIST_KEY,
      JSON.stringify(wishlist)
    );

    added = true;
  }

  // Refresh wishlist page automatically
  window.dispatchEvent(
    new Event("wishlistUpdated")
  );

  return added;
}

export function getWishlistCount(): number {
  return getWishlist().length;
}

export function clearWishlist() {
  localStorage.removeItem(WISHLIST_KEY);

  window.dispatchEvent(
    new Event("wishlistUpdated")
  );
}