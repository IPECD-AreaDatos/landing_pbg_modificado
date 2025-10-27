// Utility function to get the correct API base URL
export function getApiUrl(path: string): string {
  // Remove leading slash if present
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  
  // Use external API URL if provided, otherwise use internal API
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL;
  
  if (apiBaseUrl) {
    // External API URL provided
    return `${apiBaseUrl}/${cleanPath}`;
  }
  
  // Internal API - use relative path (Next.js handles basePath automatically)
  return `/api/${cleanPath}`;
}

// Get the base path for the application
export function getBasePath(): string {
  return process.env.NEXT_PUBLIC_BASE_PATH || '';
}

// Get the full URL for the application
export function getAppUrl(): string {
  if (typeof window !== 'undefined') {
    return window.location.origin + getBasePath();
  }
  
  // Server-side
  const vercelUrl = process.env.VERCEL_URL;
  const basePath = getBasePath();
  
  if (vercelUrl) {
    return `https://${vercelUrl}${basePath}`;
  }
  
  return `http://localhost:3000${basePath}`;
}