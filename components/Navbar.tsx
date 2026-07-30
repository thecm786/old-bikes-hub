"use client";

import {
  useState,
  useEffect,
} from "react";

import Link from "next/link";

import {
  usePathname,
} from "next/navigation";

import {
  Menu,
  X,
  Heart,
  Bike,
  ChevronRight,
} from "lucide-react";

import { getWishlistCount } from "@/lib/wishlist";

export default function Navbar() {

  const pathname = usePathname();

  const [open, setOpen] = useState(false);

  const [wishlistCount, setWishlistCount] = useState(0);

  useEffect(() => {

    const updateWishlist = () => {
  setWishlistCount(getWishlistCount());
};

    updateWishlist();

    window.addEventListener(
      "storage",
      updateWishlist
    );

    window.addEventListener(
      "wishlistUpdated",
      updateWishlist
    );

    return () => {

      window.removeEventListener(
        "storage",
        updateWishlist
      );

      window.removeEventListener(
        "wishlistUpdated",
        updateWishlist
      );

    };

  }, []);

  const menu = [

    {
      name: "Home",
      href: "/",
    },

    {
      name: "Buy Bikes",
      href: "/buy-bikes",
    },

    {
      name: "Sell Bike",
      href: "/sell-bike",
    },

    {
      name: "Wishlist",
      href: "/wishlist",
    },

    {
      name: "Contact",
      href: "/contact",
    },

  ];

  return (

    <header
      className="
      fixed
      top-0
      left-0
      right-0
      z-50
      border-b
      border-white/10
      bg-black/70
      backdrop-blur-xl
      "
    >

      <div
        className="
        mx-auto
        flex
        h-20
        max-w-7xl
        items-center
        justify-between
        px-5
        "
      >

        {/* LOGO */}

        <Link
          href="/"
          className="flex items-center gap-3"
        >

          <div
            className="
            flex
            h-12
            w-12
            items-center
            justify-center
            rounded-2xl
            bg-orange-500
            shadow-lg
            shadow-orange-500/30
            "
          >
            <Bike
              size={28}
              className="text-black"
            />
          </div>

          <div>

            <h1
              className="
              text-xl
              font-black
              tracking-tight
              text-white
              "
            >
              Old Bikes Hub
            </h1>

            <p
              className="
              text-[11px]
              font-bold
              text-orange-500
              "
            >
              India's Used Bike Marketplace
            </p>

          </div>

        </Link>

        {/* DESKTOP */}

        <nav
          className="
          hidden
          items-center
          gap-8
          lg:flex
          "
        >

          {menu.map((item) => (

            <Link
              key={item.href}
              href={item.href}
              className="
              group
              relative
              font-bold
              text-gray-300
              transition
              hover:text-white
              "
            >

              <span
                className={
                  pathname === item.href
                    ? "text-orange-500"
                    : ""
                }
              >
                {item.name}
              </span>

              <span
                className={`
                absolute
                -bottom-2
                left-0
                h-[2px]
                bg-orange-500
                transition-all
                ${
                  pathname === item.href
                    ? "w-full"
                    : "w-0 group-hover:w-full"
                }
                `}
              />

            </Link>

          ))}

          {/* Wishlist */}

          <Link
            href="/wishlist"
            className="
            relative
            ml-2
            flex
            items-center
            gap-2
            font-bold
            text-gray-300
            hover:text-white
            "
          >

            <Heart size={20} />

            {wishlistCount > 0 && (

              <span
                className="
                absolute
                -right-3
                -top-3
                flex
                min-w-[20px]
                items-center
                justify-center
                rounded-full
                bg-red-500
                px-1
                py-[2px]
                text-[10px]
                font-bold
                text-white
                "
              >
                {wishlistCount}
              </span>

            )}

          </Link>

          <Link
            href="/sell-bike"
            className="
            ml-5
            flex
            items-center
            gap-2
            rounded-xl
            bg-orange-500
            px-6
            py-3
            font-black
            text-black
            transition
            hover:scale-105
            hover:bg-orange-400
            "
          >

            Post Your Bike

            <ChevronRight size={18} />

          </Link>

        </nav>

        {/* MOBILE BUTTON */}

        <button
          onClick={() => setOpen(!open)}
          className="
          rounded-xl
          p-2
          text-white
          lg:hidden
          "
        >
          {open ? <X size={30} /> : <Menu size={30} />}
        </button>

      </div>

      {/* MOBILE MENU */}

      {open && (

        <div
          className="
          border-t
          border-white/10
          bg-black
          px-6
          py-6
          lg:hidden
          "
        >

          <div
            className="
            flex
            flex-col
            gap-5
            "
          >

            {menu.map((item) => (

              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={
                  pathname === item.href
                    ? "font-bold text-orange-500"
                    : "font-bold text-white"
                }
              >
                {item.name}
              </Link>

            ))}

            {/* Mobile Wishlist */}

            <Link
              href="/wishlist"
              onClick={() => setOpen(false)}
              className="
              flex
              items-center
              justify-between
              rounded-xl
              border
              border-white/10
              px-4
              py-3
              font-bold
              text-white
              "
            >
              <span className="flex items-center gap-2">
                <Heart size={18} />
                Wishlist
              </span>

              {wishlistCount > 0 && (
                <span
                  className="
                  rounded-full
                  bg-red-500
                  px-2
                  py-1
                  text-xs
                  font-bold
                  text-white
                  "
                >
                  {wishlistCount}
                </span>
              )}
            </Link>

            <Link
              href="/sell-bike"
              onClick={() => setOpen(false)}
              className="
              rounded-xl
              bg-orange-500
              py-3
              text-center
              font-black
              text-black
              "
            >
              Post Your Bike
            </Link>

          </div>

        </div>

      )}

    </header>

  );

}