"use client";

import { useEffect, useState } from "react";
import { onIdTokenChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import { auth } from "@/firebase/firebase";

export default function CrmGuard({ children }: { children: React.ReactNode }) {
  const [authorized, setAuthorized] = useState(false);
  const router = useRouter();

  useEffect(() => {
    let active = true;
    const unsubscribe = onIdTokenChanged(auth, async (user) => {
      setAuthorized(false);
      try {
        const token = await user?.getIdTokenResult();
        if (!active) return;
        if (token?.claims.admin === true || token?.claims.crmAgent === true) {
          setAuthorized(true);
        } else {
          router.replace("/crm/login");
        }
      } catch (error) {
        console.error("Unable to verify CRM access:", error);
        if (active) router.replace("/crm/login");
      }
    });
    return () => {
      active = false;
      unsubscribe();
    };
  }, [router]);

  if (!authorized) {
    return <div className="flex min-h-screen items-center justify-center bg-slate-50 font-semibold text-slate-600">Checking CRM access...</div>;
  }

  return children;
}
