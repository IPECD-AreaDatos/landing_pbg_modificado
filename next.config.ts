import type { NextConfig } from "next";

// Usar variable de entorno para el basePath
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  basePath: basePath,
  assetPrefix: basePath,
  trailingSlash: true,
  images: {
    unoptimized: true
  }
};

export default nextConfig;
