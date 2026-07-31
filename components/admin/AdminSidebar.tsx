"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import {
  LayoutDashboard,
  PlusCircle,
  Bike,
  Star,
  Settings,
  LogOut,
  ClipboardList,
} from "lucide-react";

import { signOut } from "firebase/auth";
import { auth, db } from "@/firebase/firebase";

import {
  collection,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";

import { useEffect, useState } from "react";

export default function AdminSidebar() {

  const pathname = usePathname();

  const router = useRouter();

  const [pendingCount, setPendingCount] = useState(0);

  /*
   * ----------------------------------------------------
   * REAL-TIME PENDING SELL REQUEST COUNT
   * ----------------------------------------------------
   */

  useEffect(() => {

    const pendingQuery = query(
      collection(
        db,
        "sellRequests"
      ),
      where(
        "status",
        "==",
        "Pending"
      )
    );

    const unsubscribe = onSnapshot(
      pendingQuery,
      (snapshot) => {

        setPendingCount(
          snapshot.size
        );

      },
      (error) => {

        console.error(
          "Pending request listener error:",
          error
        );

      }
    );

    /*
     * Cleanup Firestore listener
     */

    return () => {
      unsubscribe();
    };

  }, []);

  /*
   * ----------------------------------------------------
   * ADMIN MENU
   * ----------------------------------------------------
   */

  const menu = [

    {
      name: "Dashboard",
      href: "/admin/dashboard",
      icon: <LayoutDashboard size={20} />,
    },

    {
      name: "Add Bike",
      href: "/admin/add-bike",
      icon: <PlusCircle size={20} />,
    },

    {
      name: "All Bikes",
      href: "/admin/bikes",
      icon: <Bike size={20} />,
    },

    {
      name: "Sell Requests",
      href: "/admin/sell-requests",
      icon: <ClipboardList size={20} />,
      badge: pendingCount,
    },

    {
      name: "Featured Bikes",
      href: "/admin/featured",
      icon: <Star size={20} />,
    },

    {
      name: "Settings",
      href: "/admin/settings",
      icon: <Settings size={20} />,
    },

  ];

  /*
   * ----------------------------------------------------
   * LOGOUT
   * ----------------------------------------------------
   */

  const logoutHandler = async () => {

    try {

      await signOut(auth);

      router.push(
        "/admin/login"
      );

    } catch (error) {

      console.error(
        "Logout failed:",
        error
      );

    }

  };

  /*
   * ----------------------------------------------------
   * SIDEBAR
   * ----------------------------------------------------
   */

  return (

    <aside
      className="
      flex
      h-full
      flex-col
      bg-black
      text-white
      "
    >

      {/* ==================================================
          LOGO
      ================================================== */}

      <div
        className="
        flex
        flex-col
        items-center
        border-b
        border-white/10
        px-5
        py-5
        "
      >

        <Link
          href="/admin/dashboard"
          className="
          block
          transition
          hover:scale-105
          "
        >

          <div
            className="
            relative
            h-24
            w-24
            overflow-hidden
            rounded-full
            "
          >

            <Image
              src="/logo.png"
              alt="Old Bikes Hub"
              fill
              priority
              sizes="96px"
              className="
              object-contain
              "
            />

          </div>

        </Link>

        <h1
          className="
          mt-3
          text-xl
          font-black
          tracking-tight
          text-orange-500
          "
        >
          Old Bikes Hub
        </h1>

        <p
          className="
          mt-1
          text-xs
          font-semibold
          tracking-widest
          text-gray-400
          "
        >
          ADMIN PANEL
        </p>

      </div>

      {/* ==================================================
          MENU
      ================================================== */}

      <nav
        className="
        flex-1
        space-y-2
        p-4
        "
      >

        {menu.map((item) => (

          <Link
            key={item.name}
            href={item.href}
            className={`
            flex
            items-center
            justify-between
            rounded-xl
            px-4
            py-3
            font-semibold
            transition

            ${
              pathname === item.href
                ? "bg-orange-500 text-white shadow-lg"
                : "text-gray-300 hover:bg-white/10 hover:text-white"
            }

            `}
          >

            <div
              className="
              flex
              items-center
              gap-3
              "
            >

              {item.icon}

              <span>
                {item.name}
              </span>

            </div>

            {/* PENDING BADGE */}

            {item.badge !== undefined &&
              item.badge > 0 && (

                <span
                  className="
                  min-w-[24px]
                  rounded-full
                  bg-red-500
                  px-2
                  py-1
                  text-center
                  text-xs
                  font-black
                  text-white
                  "
                >
                  {item.badge > 99
                    ? "99+"
                    : item.badge}
                </span>

              )}

          </Link>

        ))}

      </nav>

      {/* ==================================================
          LOGOUT
      ================================================== */}

      <div
        className="
        border-t
        border-white/10
        p-4
        "
      >

        <button
          type="button"
          onClick={logoutHandler}
          className="
          flex
          w-full
          items-center
          gap-3
          rounded-xl
          px-4
          py-3
          font-bold
          text-red-400
          transition
          hover:bg-red-500/10
          "
        >

          <LogOut size={20} />

          Logout

        </button>

      </div>

    </aside>

  );
}