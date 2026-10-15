"use client";

import { usePathname } from "next/navigation";
import CrmGuard from "@/components/CrmGuard";

export default function CrmLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (pathname === "/crm/login") return children;
  return <CrmGuard>{children}</CrmGuard>;
}
