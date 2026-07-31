"use client";

import {
  ReactNode,
  useEffect,
  useState,
} from "react";

import {
  useRouter,
  usePathname,
} from "next/navigation";

import {
  onAuthStateChanged,
} from "firebase/auth";

import {
  auth,
} from "@/firebase/firebase";

import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminTopbar from "@/components/admin/AdminTopbar";

import {
  Menu,
  X,
} from "lucide-react";


export default function AdminLayout({

  children,

}: {

  children: ReactNode;

}) {


  const router = useRouter();

  const pathname = usePathname();


  const [loading, setLoading] =
    useState(true);


  const [mobileOpen, setMobileOpen] =
    useState(false);


  /*
  |--------------------------------------------------------------------------
  | LOGIN PAGE
  |--------------------------------------------------------------------------
  */

  const isLoginPage =
    pathname === "/admin/login";


  /*
  |--------------------------------------------------------------------------
  | AUTH CHECK
  |--------------------------------------------------------------------------
  */

  useEffect(() => {

    // Login page ko auth protection se bypass karo
    if (isLoginPage) {

      setLoading(false);

      return;

    }


    const unsubscribe =
      onAuthStateChanged(

        auth,

        async (user) => {

          if (!user) {

            router.replace(
              "/admin/login"
            );

            return;

          }

          try {

            const tokenResult =
              await user.getIdTokenResult(true);

            if (tokenResult.claims.admin !== true) {

              await auth.signOut();

              router.replace(
                "/admin/login"
              );

              return;

            }

          } catch (error) {

            console.error(
              "Unable to verify admin access:",
              error
            );

            await auth.signOut();

            router.replace(
              "/admin/login"
            );

            return;

          }

          setLoading(false);

        }

      );


    return () =>
      unsubscribe();

  }, [
    router,
    isLoginPage,
  ]);


  /*
  |--------------------------------------------------------------------------
  | MOBILE SIDEBAR CLOSE
  |--------------------------------------------------------------------------
  */

  useEffect(() => {

    setMobileOpen(false);

  }, [
    pathname,
  ]);


  /*
  |--------------------------------------------------------------------------
  | LOGIN PAGE
  |--------------------------------------------------------------------------
  */

  if (isLoginPage) {

    return (
      <>
        {children}
      </>
    );

  }


  /*
  |--------------------------------------------------------------------------
  | AUTH LOADING
  |--------------------------------------------------------------------------
  */

  if (loading) {

    return (

      <div
        className="
        flex
        min-h-screen
        items-center
        justify-center
        bg-gray-100
        "
      >

        <div
          className="
          text-center
          "
        >

          <div
            className="
            mx-auto
            h-12
            w-12
            animate-spin
            rounded-full
            border-4
            border-orange-500
            border-t-transparent
            "
          />


          <p
            className="
            mt-4
            font-bold
            text-gray-600
            "
          >

            Checking Admin Access...

          </p>

        </div>

      </div>

    );

  }


  /*
  |--------------------------------------------------------------------------
  | ADMIN PANEL
  |--------------------------------------------------------------------------
  */

  return (

    <div
      className="
      flex
      min-h-screen
      bg-gray-100
      "
    >


      {/* =========================================================
          DESKTOP SIDEBAR
      ========================================================= */}

      <aside
        className="
        hidden
        w-72
        lg:block
        "
      >

        <div
          className="
          fixed
          h-screen
          w-72
          "
        >

          <AdminSidebar />

        </div>

      </aside>


      {/* =========================================================
          MOBILE SIDEBAR
      ========================================================= */}

      {mobileOpen && (

        <div
          className="
          fixed
          inset-0
          z-50
          lg:hidden
          "
        >

          {/* Overlay */}

          <div
            onClick={() =>
              setMobileOpen(false)
            }
            className="
            absolute
            inset-0
            bg-black/50
            "
          />


          {/* Sidebar */}

          <div
            className="
            relative
            h-full
            w-72
            "
          >

            <button
              onClick={() =>
                setMobileOpen(false)
              }
              className="
              absolute
              right-3
              top-3
              z-10
              rounded-lg
              bg-white
              p-2
              "
            >

              <X
                size={20}
              />

            </button>


            <AdminSidebar />

          </div>

        </div>

      )}


      {/* =========================================================
          MAIN CONTENT
      ========================================================= */}

      <main
        className="
        flex-1
        "
      >


        {/* =====================================================
            MOBILE HEADER
        ===================================================== */}

        <div
          className="
          flex
          items-center
          gap-3
          bg-white
          p-4
          lg:hidden
          "
        >

          <button
            onClick={() =>
              setMobileOpen(true)
            }
            className="
            rounded-xl
            bg-black
            p-2
            text-white
            "
          >

            <Menu
              size={22}
            />

          </button>


          <h2
            className="
            font-black
            text-orange-500
            "
          >

            Old Bikes Hub

          </h2>

        </div>


        {/* =====================================================
            TOPBAR
        ===================================================== */}

        <AdminTopbar />


        {/* =====================================================
            PAGE CONTENT
        ===================================================== */}

        <div
          className="
          p-5
          md:p-8
          "
        >

          {children}

        </div>


      </main>


    </div>

  );

}
