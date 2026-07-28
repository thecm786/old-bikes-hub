"use client";

import { signOut } from "firebase/auth";
import { auth } from "@/firebase/firebase";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    const confirmLogout = window.confirm("Are you sure you want to logout?");

    if (!confirmLogout) return;

    try {
      await signOut(auth);

      alert("Logged out successfully");

      router.replace("/admin/login");
    } catch (error) {
      console.error(error);
      alert("Logout failed");
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="rounded-xl bg-red-600 px-5 py-3 font-bold text-white hover:bg-red-700"
    >
      Logout
    </button>
  );
}