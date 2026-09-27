"use client";

import { useEffect, useState } from "react";
import { onIdTokenChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import { auth } from "@/firebase/firebase";

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const [authorized, setAuthorized] = useState(false);
  const router = useRouter();
  useEffect(() => {
    let active = true;
    let revision = 0;
    const unsubscribe = onIdTokenChanged(auth, async (user) => {
      const current = ++revision;
      setAuthorized(false);
      try {
        const token = await user?.getIdTokenResult();
        if (!active || current !== revision) return;
        if (token?.claims.admin === true) {
          setAuthorized(true);
        } else {
          router.replace("/admin/login");
        }
      } catch (error) {
        console.error("Unable to verify admin access:", error);
        if (active && current === revision) router.replace("/admin/login");
      }
    });
    return () => { active = false; unsubscribe(); };
  }, [router]);

  if (!authorized) return <div className="flex min-h-screen items-center justify-center">Checking Admin Access...</div>;
  return children;
}
