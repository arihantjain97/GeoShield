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
    const response = await fetch(url, {
      ...options,
      headers,
    });

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
 * Device Location API - Single device request
 */
export async function getDeviceLocation(deviceId: string): Promise<DeviceLocationResponse> {
  return apiRequest(config.api.endpoints.deviceLocation + `/${deviceId}`, {
    method: 'GET'
  });
}

/**
 * Device Status API - Single device request
 */
export async function getDeviceStatus(deviceId: string): Promise<DeviceStatusResponse> {
  return apiRequest(config.api.endpoints.deviceStatus + `/${deviceId}`, {
    method: 'GET'
  });
}

/**
 * Batch process device locations
 */
export async function getAllDeviceLocations(deviceIds: string[]): Promise<DeviceLocationResponse[]> {
  const promises = deviceIds.map(id => getDeviceLocation(id));
  return Promise.all(promises);
}

/**
 * Batch process device statuses
 */
export async function getAllDeviceStatuses(deviceIds: string[]): Promise<DeviceStatusResponse[]> {
  const promises = deviceIds.map(id => getDeviceStatus(id));
  return Promise.all(promises);
}