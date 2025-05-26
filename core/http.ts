// project/core/http.ts

/**
 * HTTP client for API requests
 * Centralized place for all API requests with error handling
 */

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? ""

interface FetchOptions extends RequestInit {
  params?: Record<string, string>
}

function buildUrl(endpoint: string, params?: Record<string, string>): string {
  const url = new URL(`${BASE_URL}${endpoint}`)
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, value)
    })
  }
  return url.toString()
}

export async function apiFetch<T>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> {
  const { params, ...fetchOptions } = options
  const url = buildUrl(endpoint, params)

  try {
    // External API Call starts
    const response = await fetch(url, fetchOptions)
    // External API Call ends

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(
        errorData.message || `Request failed with status ${response.status}`
      )
    }

    return response.json() as Promise<T>
  } catch (error) {
    console.error("API fetch error:", error)
    throw error
  }
}