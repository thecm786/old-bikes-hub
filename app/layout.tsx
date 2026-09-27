import type { Metadata, Viewport } from "next";

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

const siteUrl = "https://www.oldbikeshub.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),

  title: {
    default: "Old Bikes Hub | Buy & Sell Used Bikes in India",
    template: "%s | Old Bikes Hub",
  },

  description:
    "Buy verified second hand bikes and sell your old bike with Old Bikes Hub. Find used motorcycles at the best prices in Muzaffarpur, Bihar and across India.",

  applicationName: "Old Bikes Hub",

  keywords: [
    "Old Bikes Hub",
    "used bikes",
    "second hand bikes",
    "old bikes",
    "buy used bikes",
    "sell used bikes",
    "used motorcycles",
    "second hand motorcycles",
    "pre owned bikes",
    "used bikes in India",
    "second hand bikes in India",
    "used bikes in Bihar",
    "second hand bikes in Bihar",
    "used bikes in Muzaffarpur",
    "second hand bikes in Muzaffarpur",
    "buy used bikes in Muzaffarpur",
    "sell old bikes in Muzaffarpur",
  ],

  authors: [
    {
      name: "Old Bikes Hub",
      url: siteUrl,
    },
  ],

  creator: "Old Bikes Hub",

  publisher: "Old Bikes Hub",

  category: "automotive",

  alternates: {
    canonical: "/",
  },

  icons: {
    icon: [
      {
        url: "/icon.png",
        type: "image/png",
      },
    ],

    shortcut: "/icon.png",

    apple: [
      {
        url: "/icon.png",
        type: "image/png",
      },
    ],
  },

  openGraph: {
    type: "website",

    locale: "en_IN",

    url: siteUrl,

    siteName: "Old Bikes Hub",

    title: "Old Bikes Hub | Buy & Sell Used Bikes in India",

    description:
      "Buy verified second hand bikes and sell your old bike with Old Bikes Hub. Find trusted used motorcycles at the best prices.",

    images: [
      {
        url: "/icon.png",
        width: 512,
        height: 512,
        alt: "Old Bikes Hub - Used Bike Marketplace",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",

    title: "Old Bikes Hub | Buy & Sell Used Bikes in India",

    description:
      "Buy verified second hand bikes and sell your old bike with Old Bikes Hub.",

    images: ["/icon.png"],
  },

  robots: {
    index: true,
    follow: true,

    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
  themeColor: "#ffffff",
  colorScheme: "light",
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