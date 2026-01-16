import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  devIndicators: {
    buildActivityPosition: "top-right",
  },
  allowedDevOrigins: ["*"],
};

export default nextConfig;
