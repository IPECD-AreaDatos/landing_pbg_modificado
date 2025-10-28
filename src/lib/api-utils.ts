// Utility function to get the correct API base URL
export function getApiUrl(path: string): string {
  // Remove leading slash if present
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  
  // Simple relative path - works in all environments
  return `/api/${cleanPath}`;
}