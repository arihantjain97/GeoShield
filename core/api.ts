import { DeviceLocationResponse } from '@/types/api/device-location';
import { DeviceStatusResponse } from '@/types/api/device-status';
import { Device } from '@/types/device';
import { getDeviceLocations, getDeviceStatuses, getAllDevices } from '@/lib/db';
import axios from 'axios';

// Wrapper to fetch device location data with error handling
export async function getAllDeviceLocations(deviceIds: string[]): Promise<DeviceLocationResponse[]> {
  try {
    //currently set to DB mode
    const response = await getDeviceLocations(deviceIds);
    return [response];
  } catch (error) {
    console.error("Failed to load device locations from DB:", error);
    throw new Error("Unable to retrieve device location data.");
  }
}

Wrapper to fetch device status data with error handling
export async function getAllDeviceStatuses(deviceIds: string[]): Promise<DeviceStatusResponse[]> {
  try {
    //currently set to DB mode
    const response = await getDeviceStatuses(deviceIds);
    return [response];
  } catch (error) {
    console.error("Failed to load device statuses from DB:", error);
    throw new Error("Unable to retrieve device status data.");
  }
}

// Wrapper to fetch all devices with error handling
export async function getAllDevicesWithMetadata(): Promise<Device[]> {
  try {
    //currently set to DB mode
    const devices = await getAllDevices();
    return devices;
  } catch (error) {
    console.error("Failed to load devices from DB:", error);
    throw new Error("Unable to retrieve device metadata.");
  }
}
