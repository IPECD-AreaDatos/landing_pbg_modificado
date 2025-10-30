// Utility function to get the correct API base URL
export function getApiUrl(path: string): string {
  const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || '';
  
  // Remove leading slash if present
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  
  // Return path with basePath prefix
  return `${BASE_PATH}/api/${cleanPath}`;
}
