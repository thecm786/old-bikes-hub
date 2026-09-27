import type { Metadata } from "next";
import AdminLayout from "./AdminLayout";
export const metadata: Metadata = { title: "Admin", robots: { index: false, follow: false }, alternates: { canonical: null } };
export default function Layout({ children }: { children: React.ReactNode }) { return <AdminLayout>{children}</AdminLayout>; }
