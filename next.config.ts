import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  basePath: '/pbg-dashboard',
  assetPrefix: '/pbg-dashboard',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  // Configuración para proxy reverso
  async rewrites() {
    return [
      {
        source: '/pbg-dashboard/:path*',
        destination: '/:path*',
      },
    ]
  },
};

export default nextConfig;
