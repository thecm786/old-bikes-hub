import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Firebase Admin includes Node-only dependencies. Keep it external to the
  // Next.js server bundle so Vercel loads it in the Node runtime correctly.
  serverExternalPackages: ["firebase-admin"],
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "(www\\.)?oldbikeshub\\.in" }],
        destination: "https://www.oldbikeshub.com/:path*",
        permanent: true,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
};

export default nextConfig;
