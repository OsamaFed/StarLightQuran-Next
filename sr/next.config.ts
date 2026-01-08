import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  devIndicators: {
    appIsrStatus: false,
  },
  // Allow all origins in dev to prevent cross-origin reload issues on Replit
  experimental: {
    // allowedReplicatedOrigins is not a valid key in some Next.js versions
  },
  // Ensure we can access public assets properly
  async rewrites() {
    return [
      {
        source: '/audio/:path*',
        destination: '/audio/:path*',
      },
    ];
  },
} as any;

export default nextConfig;
