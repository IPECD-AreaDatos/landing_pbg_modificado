// Utility function to get the correct API base URL
export function getApiUrl(path: string): string {
  // Remove leading slash if present
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  
  // When using basePath, Next.js automatically handles the routing
  // We just need to use relative paths and Next.js will handle the rest
  return `/api/${cleanPath}`;
}

// Get the base path for the application
export function getBasePath(): string {
  return process.env.NODE_ENV === 'development' ? '' : '/pbg-dashboard';
}