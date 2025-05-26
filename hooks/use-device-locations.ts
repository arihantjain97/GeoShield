'use client';

import { apiFetch } from '@/core/http';
import { config } from '@/core/config';

export interface DeviceLocationResponse {
  deviceLocations: Array<{
    deviceId: string;
    location?: {
      latitude: number;
      longitude: number;
      accuracy: number;
      timestamp: string;
    };
    status: 'VALID' | 'LOCATION_UNAVAILABLE';
    error?: {
      code: string;
      message: string;
    };
  }>;
  requestId: string;
  timestamp: string;
}

/**
 * Fetch device locations from the CAMARA API
 * @param deviceIds Optional array of device IDs to fetch locations for
 * @returns Promise with device location data
 */
export async function fetchDeviceLocations(deviceIds?: string[]): Promise<DeviceLocationResponse> {
  try {
    // 🔗 External API Call starts
    const response = await apiFetch<DeviceLocationResponse>(
      config.api.endpoints.deviceLocation,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          deviceIds: deviceIds || [],
        }),
      }
    );
    // 🔚 External API Call ends
    return response;
  } catch (error) {
    console.error('Error fetching device locations:', error);
    throw error;
  }
}