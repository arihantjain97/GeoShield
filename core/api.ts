import { config } from './config';
import { DeviceLocationResponse } from '@/types/api/device-location';
import { DeviceStatusResponse } from '@/types/api/device-status';

/**
 * Base API request handler with error handling and logging
 */
async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${config.api.baseUrl}${endpoint}`;
  const headers = new Headers(options.headers);
  
  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  try {
    // 🔗 External API Call starts
    const response = await fetch(url, {
      ...options,
      headers,
    });
    // 🔚 External API Call ends

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`API Error: ${response.status} ${response.statusText} - ${errorData.message || 'Unknown error'}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
}

/**
 * Device Location API
 */
export async function getDeviceLocations(deviceIds?: string[]): Promise<DeviceLocationResponse> {
  return apiRequest(config.api.endpoints.deviceLocation, {
    method: 'POST',
    body: JSON.stringify({ deviceIds: deviceIds || [] }),
  });
}

/**
 * Device Status API
 */
export async function getDeviceStatuses(deviceIds?: string[]): Promise<DeviceStatusResponse> {
  return apiRequest(config.api.endpoints.deviceStatus, {
    method: 'POST',
    body: JSON.stringify({ deviceIds: deviceIds || [] }),
  });
}