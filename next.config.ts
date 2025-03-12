import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**", // ✅ Allows all domains
      },
      {
        protocol: "http",
        hostname: "**", // ✅ Allows all domains over HTTP
      },
    ],
  },
};

export default nextConfig;
