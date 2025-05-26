'use client';

import { apiFetch } from '@/core/http';
import { config } from '@/core/config';

export interface DeviceStatusResponse {
  deviceStatuses: Array<{
    deviceId: string;
    status: 'REACHABLE' | 'UNREACHABLE';
    networkInfo?: {
      signalStrength: 'EXCELLENT' | 'GOOD' | 'FAIR' | 'POOR' | 'NONE';
      networkType: '5G' | '4G' | '3G' | 'UNKNOWN';
      batteryLevel: number;
    };
    error?: {
      code: string;
      message: string;
    };
    timestamp: string;
  }>;
  requestId: string;
  timestamp: string;
}

/**
 * Fetch device statuses from the CAMARA API
 * @param deviceIds Optional array of device IDs to fetch statuses for
 * @returns Promise with device status data
 */
export async function fetchDeviceStatuses(deviceIds?: string[]): Promise<DeviceStatusResponse> {
  try {
    const response = await apiFetch<DeviceStatusResponse>(
      config.api.endpoints.deviceStatus,
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
    return response;
  } catch (error) {
    console.error('Error fetching device statuses:', error);
    throw error;
  }
}