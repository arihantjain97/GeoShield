// project/core/http.ts

/**
 * HTTP client for API requests
 * Centralized place for all external API requests with standardized error handling
 */

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

interface FetchOptions extends RequestInit {
  params?: Record<string, string>;
}

function buildUrl(endpoint: string, params?: Record<string, string>): string {
  const url = new URL(`${BASE_URL}${endpoint}`);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });
  }
  return url.toString();
}

/**
 * Generic API fetch function
 * Wraps fetch() with URL construction, optional query params, and full error handling
 */
export async function apiFetch<T>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> {
  const { params, ...fetchOptions } = options;
  const url = buildUrl(endpoint, params);

  try {
    const response = await fetch(url, fetchOptions);

    if (!response.ok) {
      let message = `Request failed with status ${response.status}`;
      try {
        const errorData = await response.json();
        message = errorData.message || message;
      } catch (_) {
        // If response is not JSON, ignore
      }
      throw new Error(message);
    }

    return (await response.json()) as T;
  } catch (error) {
    console.error(`apiFetch error for [${url}]:`, error);
    throw new Error("An error occurred while fetching data from the server.");
  }
}