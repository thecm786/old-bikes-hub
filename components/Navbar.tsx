"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Menu,
  X,
  Bike,
  Heart,
} from "lucide-react";

import { getWishlistCount } from "@/lib/wishlist";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [wishlistCount, setWishlistCount] =
    useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };

    window.addEventListener("scroll", handleScroll);

    return () =>
      window.removeEventListener(
        "scroll",
        handleScroll
      );
  }, []);

  useEffect(() => {
    const updateWishlist = () => {
      setWishlistCount(getWishlistCount());
    };

    updateWishlist();

    window.addEventListener(
      "wishlistUpdated",
      updateWishlist
    );

    return () =>
      window.removeEventListener(
        "wishlistUpdated",
        updateWishlist
      );
  }, []);

  return (
    <header
      className={`fixed left-0 top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "bg-black/95 shadow-2xl backdrop-blur"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">

        {/* Logo */}

        <Link
          href="/"
          className="flex items-center gap-2"
        >
          <Bike
            size={32}
            className="text-orange-500"
          />

          <div>
            <h1 className="text-2xl font-extrabold text-white">
              Old Bikes
            </h1>

            <p className="-mt-1 text-xs text-orange-500">
              HUB
            </p>
          </div>
        </Link>

        {/* Desktop Menu */}

        <nav className="hidden items-center gap-8 text-white md:flex">

          <Link
            href="/"
            className="transition hover:text-orange-500"
          >
            Home
          </Link>

          <Link
            href="/buy-bikes"
            className="transition hover:text-orange-500"
          >
            Buy Bikes
          </Link>

          <Link
            href="/sell-bike"
            className="transition hover:text-orange-500"
          >
            Sell Bike
          </Link>

          <Link
            href="/wishlist"
            className="relative flex items-center gap-2 transition hover:text-orange-500"
          >
            <Heart size={20} />

            Wishlist

            {wishlistCount > 0 && (
              <span className="absolute -right-4 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                {wishlistCount}
              </span>
            )}
          </Link>

          <Link
            href="#"
            className="transition hover:text-orange-500"
          >
            About
          </Link>

          <Link
            href="#"
            className="transition hover:text-orange-500"
          >
            Contact
          </Link>

          <Link
            href="/admin"
            className="rounded-xl bg-orange-500 px-5 py-3 font-bold transition hover:bg-orange-600"
          >
            Post Your Bike
          </Link>

        </nav>

        {/* Mobile Button */}

        <button
          onClick={() =>
            setMenuOpen(!menuOpen)
          }
          className="text-white md:hidden"
        >
          {menuOpen ? (
            <X size={30} />
          ) : (
            <Menu size={30} />
          )}
        </button>

      </div>

      {/* Mobile Menu */}

      {menuOpen && (
        <div className="border-t border-gray-800 bg-black md:hidden">

          <div className="flex flex-col px-6 py-6">

            <Link
              href="/"
              className="py-3 text-white"
              onClick={() => setMenuOpen(false)}
            >
              Home
            </Link>

            <Link
              href="/buy-bikes"
              className="py-3 text-white"
              onClick={() => setMenuOpen(false)}
            >
              Buy Bikes
            </Link>

            <Link
              href="/sell-bike"
              className="py-3 text-white"
              onClick={() => setMenuOpen(false)}
            >
              Sell Bike
            </Link>

            <Link
              href="/wishlist"
              className="flex items-center justify-between py-3 text-white"
              onClick={() => setMenuOpen(false)}
            >
              <span>❤️ Wishlist</span>

              {wishlistCount > 0 && (
                <span className="rounded-full bg-red-500 px-2 py-1 text-xs font-bold">
                  {wishlistCount}
                </span>
              )}
            </Link>

            <Link
              href="#"
              className="py-3 text-white"
              onClick={() => setMenuOpen(false)}
            >
              About
            </Link>

            <Link
              href="#"
              className="py-3 text-white"
              onClick={() => setMenuOpen(false)}
            >
              Contact
            </Link>

            <Link
              href="/admin"
              className="mt-4 rounded-xl bg-orange-500 px-5 py-3 text-center font-bold text-white"
              onClick={() => setMenuOpen(false)}
            >
              Post Your Bike
            </Link>

          </div>

        </div>
      )}
    </header>
  );
}