// Utility function to get the correct API base URL
export function getApiUrl(path: string): string {
  // Remove leading slash if present
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  
  // Simple relative path - no basePath complications
  return `/api/${cleanPath}`;
}

// Get the base path for the application
export function getBasePath(): string {
  return process.env.NODE_ENV === 'development' ? '' : '/pbg-dashboard';
}