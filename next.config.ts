import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    inlineIssues: false,
  },

  transpilePackages: ["framer-motion"],
};

export default nextConfig;
