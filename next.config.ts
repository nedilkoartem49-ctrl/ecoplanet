import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: { unoptimized: true },
  devIndicators: false,
  experimental: { useTypeScriptCli: false },
};

export default nextConfig;
