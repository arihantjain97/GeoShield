import { DeviceLocationResponse } from '@/types/api/device-location';
import { DeviceStatusResponse } from '@/types/api/device-status';
import { getDeviceLocations, getDeviceStatuses } from '@/lib/db';

export async function getAllDeviceLocations(deviceIds: string[]): Promise<DeviceLocationResponse[]> {
  const response = await getDeviceLocations(deviceIds);
  // Return array to match existing API structure
  return [response];
}

export async function getAllDeviceStatuses(deviceIds: string[]): Promise<DeviceStatusResponse[]> {
  const response = await getDeviceStatuses(deviceIds);
  // Return array to match existing API structure
  return [response];
}