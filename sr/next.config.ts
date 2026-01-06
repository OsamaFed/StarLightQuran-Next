import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  devIndicators: {
    appIsrStatus: false,
  },
  // Allow all origins in dev to prevent cross-origin reload issues on Replit
  experimental: {
    allowedReplicatedOrigins: ["*"],
  },
} as any;

export default nextConfig;
