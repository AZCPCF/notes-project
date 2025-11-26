const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export const fetcher = (endpoint: string, init: RequestInit) =>
  fetch(`${BASE_URL}${endpoint}`, init);
