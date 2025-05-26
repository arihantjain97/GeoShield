/**
 * HTTP client for API requests
 * Centralized place for all API requests with error handling
 */

import { config } from './config';

interface FetchOptions extends RequestInit {
  params?: Record<string, string>;
}

/**
 * Enhanced fetch wrapper for API calls
 * @param endpoint API endpoint path
 * @param options Fetch options including params
 * @returns Promise with response data
 */
export async function apiFetch<T = any>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> {
  const { params, ...fetchOptions } = options;
  
  // Build URL with query parameters if provided
  let url = `${config.api.baseUrl}${endpoint}`;
  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      searchParams.append(key, value);
    });
    url += `?${searchParams.toString()}`;
  }

  // Default headers
  const headers = new Headers(fetchOptions.headers);
  if (!headers.has('Content-Type') && !(fetchOptions.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  // Log request details for debugging
  console.debug(`API Request: ${fetchOptions.method || 'GET'} ${url}`, {
    headers: Object.fromEntries(headers.entries()),
    body: fetchOptions.body,
  });

  // Execute request
  try {
    const response = await fetch(url, {
      ...fetchOptions,
      headers,
    });

    // Handle non-2xx responses
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = `[${fetchOptions.method || 'GET'} ${endpoint}] ${response.status} ${response.statusText}: ${errorData?.message || 'Unknown API error'}`;
      console.error('API Error:', {
        url,
        method: fetchOptions.method || 'GET',
        status: response.status,
        statusText: response.statusText,
        body: fetchOptions.body,
        error: errorData,
      });
      throw new Error(errorMessage);
    }

    // Parse JSON response
    return await response.json();
  } catch (error) {
    // Enhance error with request context if not already present
    if (error instanceof Error && !error.message.includes('[')) {
      error.message = `[${fetchOptions.method || 'GET'} ${endpoint}] Request failed: ${error.message}`;
    }
    console.error('API request failed:', error);
    throw error;
  }
}