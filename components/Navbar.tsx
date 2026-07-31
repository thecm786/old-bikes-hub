"use client";

import { useEffect, useState } from "react";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  Menu,
  X,
  Heart,
  ChevronRight,
} from "lucide-react";

import { getWishlistCount } from "@/lib/wishlist";

export default function Navbar() {
  const pathname = usePathname();

  const [open, setOpen] = useState(false);
  const [wishlistCount, setWishlistCount] = useState(0);

  /*
   * ----------------------------------------------------
   * WISHLIST COUNT
   * ----------------------------------------------------
   */

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

  /*
   * ----------------------------------------------------
   * CLOSE MOBILE MENU WHEN ROUTE CHANGES
   * ----------------------------------------------------
   */

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  /*
   * ----------------------------------------------------
   * MENU
   * ----------------------------------------------------
   */

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

  /*
   * ----------------------------------------------------
   * HELPERS
   * ----------------------------------------------------
   */

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }

    return pathname.startsWith(href);
  };

  /*
   * ----------------------------------------------------
   * RENDER
   * ----------------------------------------------------
   */

  return (
    <header
      className="
        fixed
        inset-x-0
        top-0
        z-50
        border-b
        border-white/10
        bg-black/75
        backdrop-blur-xl
      "
    >
      <div
        className="
          mx-auto
          flex
          h-[76px]
          max-w-7xl
          items-center
          justify-between
          px-4
          sm:px-5
          lg:px-6
        "
      >

        {/* ==================================================
            BRAND / LOGO
        ================================================== */}

        <Link
          href="/"
          className="
            group
            flex
            min-w-0
            items-center
            gap-2.5
            sm:gap-3
          "
        >

          {/* Logo */}

          <div
  className="
    flex
    h-[48px]
    w-[48px]
    shrink-0
    items-center
    justify-center
    overflow-hidden
    rounded-full
  "
>
  <img
    src="/logo.png"
    alt="Old Bikes Hub"
    width={48}
    height={48}
    className="
      block
      h-[48px]
      w-[48px]
      object-contain
    "
  />
</div>

          {/* Brand Text */}

          <div
            className="
              min-w-0
              leading-none
            "
          >
            <h1
              className="
                truncate
                text-[17px]
                font-black
                tracking-tight
                text-white
                sm:text-[19px]
              "
            >
              Old Bikes Hub
            </h1>

            <p
              className="
                mt-1
                whitespace-nowrap
                text-[9px]
                font-bold
                tracking-wide
                text-orange-500
                sm:text-[10px]
              "
            >
              India&apos;s Used Bike Marketplace
            </p>
          </div>

        </Link>

        {/* ==================================================
            DESKTOP NAVIGATION
        ================================================== */}

        <nav
          className="
            hidden
            items-center
            gap-7
            lg:flex
            xl:gap-8
          "
        >

          {menu.map((item) => {
            const active = isActive(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className="
                  group
                  relative
                  py-2
                  text-[15px]
                  font-bold
                  transition-colors
                  duration-200
                "
              >

                <span
                  className={
                    active
                      ? "text-orange-500"
                      : "text-gray-300 group-hover:text-white"
                  }
                >
                  {item.name}
                </span>

                {/* Active / Hover Line */}

                <span
                  className={`
                    absolute
                    -bottom-0.5
                    left-0
                    h-[2px]
                    rounded-full
                    bg-orange-500
                    transition-all
                    duration-300
                    ${
                      active
                        ? "w-full"
                        : "w-0 group-hover:w-full"
                    }
                  `}
                />

              </Link>
            );
          })}

          {/* ==================================================
              WISHLIST ICON
          ================================================== */}

          <Link
            href="/wishlist"
            aria-label="Wishlist"
            className="
              relative
              ml-1
              flex
              h-10
              w-10
              items-center
              justify-center
              rounded-xl
              text-gray-300
              transition-all
              duration-200
              hover:bg-white/10
              hover:text-white
            "
          >

            <Heart
              size={21}
              strokeWidth={2}
            />

            {wishlistCount > 0 && (
              <span
                className="
                  absolute
                  -right-0.5
                  -top-0.5
                  flex
                  min-h-[18px]
                  min-w-[18px]
                  items-center
                  justify-center
                  rounded-full
                  bg-red-500
                  px-1
                  text-[9px]
                  font-black
                  text-white
                  shadow-md
                "
              >
                {wishlistCount > 99
                  ? "99+"
                  : wishlistCount}
              </span>
            )}

          </Link>

          {/* ==================================================
              POST YOUR BIKE
          ================================================== */}

          <Link
            href="/sell-bike"
            className="
              ml-2
              flex
              items-center
              gap-2
              rounded-xl
              bg-orange-500
              px-5
              py-3
              text-[14px]
              font-black
              text-black
              shadow-lg
              shadow-orange-500/20
              transition-all
              duration-200
              hover:scale-[1.03]
              hover:bg-orange-400
              hover:shadow-orange-500/30
              active:scale-[0.98]
              xl:px-6
            "
          >

            <span>
              Post Your Bike
            </span>

            <ChevronRight
              size={17}
              strokeWidth={2.5}
            />

          </Link>

        </nav>

        {/* ==================================================
            MOBILE MENU BUTTON
        ================================================== */}

        <button
          type="button"
          aria-label={
            open
              ? "Close menu"
              : "Open menu"
          }
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
          className="
            flex
            h-11
            w-11
            items-center
            justify-center
            rounded-xl
            border
            border-white/10
            bg-white/5
            text-white
            transition-all
            duration-200
            hover:bg-white/10
            lg:hidden
          "
        >
          {open ? (
            <X size={25} />
          ) : (
            <Menu size={25} />
          )}
        </button>

      </div>

      {/* ====================================================
          MOBILE MENU
      ==================================================== */}

      {open && (
        <div
          className="
            border-t
            border-white/10
            bg-black/95
            backdrop-blur-xl
            lg:hidden
          "
        >

          <div
            className="
              mx-auto
              max-w-7xl
              px-5
              py-5
            "
          >

            <div
              className="
                flex
                flex-col
                gap-2
              "
            >

              {menu.map((item) => {
                const active = isActive(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`
                      flex
                      items-center
                      justify-between
                      rounded-xl
                      px-4
                      py-3.5
                      font-bold
                      transition-all
                      ${
                        active
                          ? "bg-orange-500/10 text-orange-500"
                          : "text-gray-200 hover:bg-white/5 hover:text-white"
                      }
                    `}
                  >

                    <span>
                      {item.name}
                    </span>

                    {active && (
                      <span
                        className="
                          h-2
                          w-2
                          rounded-full
                          bg-orange-500
                        "
                      />
                    )}

                  </Link>
                );
              })}

              {/* ==================================================
                  MOBILE WISHLIST
              ================================================== */}

              <Link
                href="/wishlist"
                className="
                  mt-2
                  flex
                  items-center
                  justify-between
                  rounded-xl
                  border
                  border-white/10
                  bg-white/5
                  px-4
                  py-3.5
                  font-bold
                  text-white
                  transition
                  hover:bg-white/10
                "
              >

                <span
                  className="
                    flex
                    items-center
                    gap-3
                  "
                >

                  <Heart
                    size={19}
                    strokeWidth={2}
                  />

                  Wishlist

                </span>

                {wishlistCount > 0 && (
                  <span
                    className="
                      rounded-full
                      bg-red-500
                      px-2.5
                      py-1
                      text-[11px]
                      font-black
                      text-white
                    "
                  >
                    {wishlistCount > 99
                      ? "99+"
                      : wishlistCount}
                  </span>
                )}

              </Link>

              {/* ==================================================
                  MOBILE POST BIKE
              ================================================== */}

              <Link
                href="/sell-bike"
                className="
                  mt-1
                  flex
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  bg-orange-500
                  px-4
                  py-3.5
                  font-black
                  text-black
                  transition
                  hover:bg-orange-400
                "
              >

                Post Your Bike

                <ChevronRight
                  size={18}
                  strokeWidth={2.5}
                />

              </Link>

            </div>

          </div>

        </div>
      )}

    </header>
  );
}