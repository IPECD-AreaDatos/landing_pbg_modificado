import type { NextConfig } from "next";

// Usar variable de entorno para el basePath
// Solo aplicar basePath en production si está configurado
const basePath = process.env.NODE_ENV === 'production' 
  ? (process.env.NEXT_PUBLIC_BASE_PATH || '') 
  : '';

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  basePath: basePath,
  assetPrefix: basePath,
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  // Redirect root to basePath when basePath is configured
  async redirects() {
    if (basePath) {
      return [
        {
          source: '/',
          destination: basePath + '/',
          permanent: false,
        },
      ];
    }
    return [];
  },
};

export default nextConfig;
