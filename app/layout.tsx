import type { Metadata } from "next";

import {
  Geist,
  Geist_Mono,
} from "next/font/google";

import "./globals.css";

import { AuthProvider } from "@/providers/AuthProvider";

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
  metadataBase: new URL("https://www.oldbikeshub.com"),

  title: {
    default: "Old Bikes Hub",
    template: "%s | Old Bikes Hub",
  },

  description:
    "Find your dream used bike. Buy verified second hand bikes, sell your old bike and get trusted support from Old Bikes Hub.",

  applicationName: "Old Bikes Hub",

  keywords: [
    "used bikes",
    "second hand bikes",
    "used bikes in Bihar",
    "used bikes in Muzaffarpur",
    "buy used bikes",
    "sell old bikes",
    "Old Bikes Hub",
  ],

  icons: {
    icon: [
      {
        url: "/icon.png",
        type: "image/png",
      },
    ],
    apple: "/icon.png",
  },

  openGraph: {
    title: "Old Bikes Hub",
    description:
      "Buy verified second hand bikes, sell your old bike and get trusted support.",
    url: "https://www.oldbikeshub.com",
    siteName: "Old Bikes Hub",
    type: "website",
  },

  twitter: {
    card: "summary",
    title: "Old Bikes Hub",
    description:
      "Buy verified second hand bikes, sell your old bike and get trusted support.",
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
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