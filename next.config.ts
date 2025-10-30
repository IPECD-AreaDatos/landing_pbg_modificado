import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  basePath: '/pbg-dashboard',
  reactCompiler: true,
  trailingSlash: true,
  images: {
    unoptimized: true
  }
};

export default nextConfig;
