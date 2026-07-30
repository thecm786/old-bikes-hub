import type { Metadata } from "next";

import {
  Geist,
  Geist_Mono,
} from "next/font/google";

import "./globals.css";

import {
  AuthProvider,
} from "@/providers/AuthProvider";

import { Toaster } from "react-hot-toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Old Bikes Hub",
  description: "Buy, Sell & Exchange Verified Used Bikes",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html
      lang="en"
      className={`
        ${geistSans.variable}
        ${geistMono.variable}
        h-full
        antialiased
      `}
    >
      <body className="min-h-screen">

        <AuthProvider>

          {children}

          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                borderRadius: "12px",
                background: "#111827",
                color: "#ffffff",
              },
            }}
          />

        </AuthProvider>

      </body>
    </html>
  );
}