export function getApiBaseUrl() {
  const url = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!url) {
    // Fall back to local backend for dev/test runs.
    return "http://localhost:4000";
  }
  return url;
}
