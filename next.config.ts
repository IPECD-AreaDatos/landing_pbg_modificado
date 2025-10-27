import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  basePath: '/pbg-dashboard',
  assetPrefix: '/pbg-dashboard',
  trailingSlash: true,
  images: {
    unoptimized: true
  }
};

export default nextConfig;
