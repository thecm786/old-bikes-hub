import type { Metadata } from "next";
import CrmGuard from "@/components/CrmGuard";

export const metadata: Metadata = {
  title: "CRM | Old Bikes Hub",
  robots: { index: false, follow: false },
  alternates: { canonical: null },
};

export default function CrmLayout({ children }: { children: React.ReactNode }) {
  return <CrmGuard>{children}</CrmGuard>;
}
