import Link from "next/link";

import {
  Bike,
  MapPin,
  Phone,
  Mail,
  MessageCircle,
  ArrowRight,
} from "lucide-react";

import { siteConfig } from "@/lib/siteConfig";

export default function Footer() {
  return (
    <footer className="bg-black text-white">

      {/* =========================
          MAIN FOOTER
      ========================= */}

      <div className="mx-auto max-w-7xl px-5 py-12 sm:px-6 sm:py-14 lg:px-8">

        <div
          className="
            grid
            gap-10
            border-b
            border-white/10
            pb-10
            sm:grid-cols-2
            lg:grid-cols-[1.4fr_0.8fr_0.9fr_1.2fr]
            lg:gap-12
            lg:pb-12
          "
        >

          {/* =========================
              BRAND
          ========================= */}

          <div>

            <Link
              href="/"
              className="group inline-flex items-center gap-3"
            >

              <div
                className="
                  flex
                  h-12
                  w-12
                  shrink-0
                  items-center
                  justify-center
                  rounded-2xl
                  bg-orange-500
                  shadow-lg
                  shadow-orange-500/20
                  transition
                  group-hover:scale-105
                "
              >
                <Bike
                  size={27}
                  strokeWidth={2.5}
                  className="text-white"
                />
              </div>

              <div>

                <h2 className="text-xl font-black tracking-tight sm:text-2xl">
                  Old Bikes Hub
                </h2>

                <p className="mt-0.5 text-xs font-bold text-orange-500 sm:text-sm">
                  India's Trusted Used Bike Marketplace
                </p>

              </div>

            </Link>

            <p
              className="
                mt-5
                max-w-sm
                text-sm
                leading-6
                text-gray-400
                sm:text-base
                sm:leading-7
              "
            >
              Buy, sell and exchange verified second hand
              bikes across India. Find your dream bike at
              the best price.
            </p>

            <Link
              href="/buy-bikes"
              className="
                mt-5
                inline-flex
                items-center
                gap-2
                text-sm
                font-bold
                text-orange-500
                transition
                hover:text-orange-400
              "
            >
              Explore Bikes
              <ArrowRight size={16} />
            </Link>

          </div>


          {/* =========================
              QUICK LINKS
          ========================= */}

          <div>

            <h3 className="text-lg font-black">
              Quick Links
            </h3>

            <div className="mt-5 flex flex-col gap-3">

              <Link
                href="/"
                className="
                  w-fit
                  text-sm
                  text-gray-400
                  transition
                  hover:translate-x-1
                  hover:text-orange-500
                "
              >
                Home
              </Link>

              <Link
                href="/buy-bikes"
                className="
                  w-fit
                  text-sm
                  text-gray-400
                  transition
                  hover:translate-x-1
                  hover:text-orange-500
                "
              >
                Buy Bikes
              </Link>

              <Link
                href="/sell-bike"
                className="
                  w-fit
                  text-sm
                  text-gray-400
                  transition
                  hover:translate-x-1
                  hover:text-orange-500
                "
              >
                Sell Bike
              </Link>

              <Link
                href="/wishlist"
                className="
                  w-fit
                  text-sm
                  text-gray-400
                  transition
                  hover:translate-x-1
                  hover:text-orange-500
                "
              >
                Wishlist
              </Link>

              <Link
                href="/contact"
                className="
                  w-fit
                  text-sm
                  text-gray-400
                  transition
                  hover:translate-x-1
                  hover:text-orange-500
                "
              >
                Contact Us
              </Link>

            </div>

          </div>


          {/* =========================
              WHY CHOOSE US
          ========================= */}

          <div>

            <h3 className="text-lg font-black">
              Why Choose Us
            </h3>

            <ul className="mt-5 space-y-4">

              <li className="flex items-start gap-2.5 text-sm text-gray-400">
                <span className="mt-0.5 text-orange-500">✓</span>
                <span>Verified Used Bikes</span>
              </li>

              <li className="flex items-start gap-2.5 text-sm text-gray-400">
                <span className="mt-0.5 text-orange-500">✓</span>
                <span>Direct Seller Contact</span>
              </li>

              <li className="flex items-start gap-2.5 text-sm text-gray-400">
                <span className="mt-0.5 text-orange-500">✓</span>
                <span>Best Market Price</span>
              </li>

              <li className="flex items-start gap-2.5 text-sm text-gray-400">
                <span className="mt-0.5 text-orange-500">✓</span>
                <span>Easy Bike Selling</span>
              </li>

            </ul>

          </div>


          {/* =========================
              CONTACT
          ========================= */}

          <div>

            <h3 className="text-lg font-black">
              Contact
            </h3>

            <div className="mt-5 space-y-4">

              {/* LOCATION */}

              <div className="flex items-start gap-3">

                <MapPin
                  size={19}
                  className="mt-0.5 shrink-0 text-orange-500"
                />

                <span className="text-sm leading-6 text-gray-400">
                  {siteConfig.location}
                </span>

              </div>


              {/* PHONE */}

              <a
                href={`tel:${siteConfig.phone}`}
                className="
                  flex
                  items-center
                  gap-3
                  text-sm
                  text-gray-400
                  transition
                  hover:text-orange-500
                "
              >

                <Phone
                  size={19}
                  className="shrink-0 text-orange-500"
                />

                <span>
                  {siteConfig.phone}
                </span>

              </a>


              {/* EMAIL */}

              <a
                href={`mailto:${siteConfig.email}`}
                className="
                  flex
                  items-start
                  gap-3
                  break-all
                  text-sm
                  text-gray-400
                  transition
                  hover:text-orange-500
                "
              >

                <Mail
                  size={19}
                  className="mt-0.5 shrink-0 text-orange-500"
                />

                <span>
                  {siteConfig.email}
                </span>

              </a>


              {/* WHATSAPP */}

              <a
                href={`https://wa.me/${siteConfig.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="
                  mt-2
                  flex
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
                  shadow-lg
                  shadow-green-500/10
                  transition
                  hover:bg-green-600
                  active:scale-[0.98]
                "
              >

                <MessageCircle size={19} />

                WhatsApp

              </a>

            </div>

          </div>

        </div>


        {/* =========================
            BOTTOM BAR
        ========================= */}

        <div
          className="
            flex
            flex-col
            gap-3
            pt-6
            text-center
            text-xs
            text-gray-500
            sm:flex-row
            sm:items-center
            sm:justify-between
            sm:text-left
          "
        >

          <p>
            © {new Date().getFullYear()} Old Bikes Hub.
            All Rights Reserved.
          </p>

          <p className="text-gray-600">
            India's Trusted Used Bike Marketplace
          </p>

        </div>

      </div>

    </footer>
  );
}