// Utility function to get the correct API base URL
export function getApiUrl(path: string): string {
  // Remove leading slash if present
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  
  // Check if we're running in the browser
  if (typeof window !== 'undefined') {
    // Client-side: use relative URLs that respect the basePath
    return `/api/${cleanPath}`;
  }
  
  // Server-side: build full URL if needed
  if (process.env.NODE_ENV === 'development') {
    return `http://localhost:3000/api/${cleanPath}`;
  }
  
  // Production server-side
  const baseUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'https://landing-pbg-modificado.vercel.app';
  return `${baseUrl}/pbg-dashboard/api/${cleanPath}`;
}

// Get the base path for the application
export function getBasePath(): string {
  return process.env.NODE_ENV === 'development' ? '' : '/pbg-dashboard';
}