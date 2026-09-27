"use client";
import { useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import AdminGuard from "@/components/AdminGuard";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminTopbar from "@/components/admin/AdminTopbar";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  if (pathname === "/admin/login") return children;
  return <AdminGuard><AdminShell key={pathname}>{children}</AdminShell></AdminGuard>;
}

function AdminShell({ children }: { children: ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
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
