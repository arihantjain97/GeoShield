// lib/db.ts
//'use server';

import { Pool } from 'pg';
import { DeviceLocationResponse } from '@/types/api/device-location';
import { DeviceStatusResponse } from '@/types/api/device-status';
import { Device, DeviceType, DeviceStatus } from '@/types/device';

const pool = new Pool({
  host: process.env.POSTGRES_HOST,
  port: Number(process.env.POSTGRES_PORT),
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DATABASE,
  ssl: false, // Set to true if needed
});

// Fetches all devices from the database
export async function getAllDevices(): Promise<Device[]> {
  try {
    const result = await pool.query(`
      SELECT 
        d.id,
        d.name,
        d.type,
        d.status,
        d.phone_number as "simNumber",
        d.last_updated as "lastUpdated"
      FROM devices d
    `);

    return result.rows.map(row => ({
      id: row.id,
      name: row.name,
      type: row.type as DeviceType,
      status: row.status as DeviceStatus,
      simNumber: row.simNumber,
      lastUpdated: row.lastUpdated.toISOString(),
    }));
  } catch (error) {
    console.error("Failed to fetch devices from database:", error);
    throw new Error("Unable to load devices from the database.");
  }
}

// Fetches location data for a list of device IDs
export async function getDeviceLocations(deviceIds: string[]): Promise<DeviceLocationResponse> {
  try {
    const result = await pool.query(`
      SELECT 
        d.id as device_id,
        dl.latitude,
        dl.longitude,
        dl.radius as accuracy,
        dl.last_updated as timestamp
      FROM devices d
      LEFT JOIN device_location dl ON d.id = dl.device_id
      WHERE d.id = ANY($1)
    `, [deviceIds]);

    const deviceLocations = result.rows.map(row => ({
      deviceId: row.device_id,
      location: row.latitude ? {
        latitude: row.latitude,
        longitude: row.longitude,
        accuracy: row.accuracy,
        timestamp: row.timestamp.toISOString(),
      } : undefined,
      status: row.latitude ? 'VALID' : 'LOCATION_UNAVAILABLE',
    }));

    return {
      deviceLocations,
      requestId: 'local-' + Date.now(),
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error("Failed to fetch device locations:", error);
    throw new Error("Unable to load device location data.");
  }
}

// Fetches network status data for a list of device IDs
export async function getDeviceStatuses(deviceIds: string[]): Promise<DeviceStatusResponse> {
  try {
    const result = await pool.query(`
      SELECT 
        d.id as device_id,
        ds.signal_strength,
        ds.network_type,
        ds.battery_level,
        ds.connectivity_status,
        ds.last_updated as timestamp
      FROM devices d
      LEFT JOIN device_status ds ON d.id = ds.device_id
      WHERE d.id = ANY($1)
    `, [deviceIds]);

    const deviceStatuses = result.rows.map(row => {
      const batteryLevel = parseInt(row.battery_level) || 0;
      const signalStrength = row.signal_strength === 'N/A' ? 'NONE' :
        batteryLevel > 80 ? 'EXCELLENT' :
        batteryLevel > 60 ? 'GOOD' :
        batteryLevel > 40 ? 'FAIR' : 'POOR';

      return {
        deviceId: row.device_id,
        status: row.connectivity_status === 'CONNECTED_DATA' ? 'REACHABLE' : 'UNREACHABLE',
        networkInfo: {
          signalStrength,
          networkType: row.network_type as '5G' | '4G' | '3G' | 'UNKNOWN',
          batteryLevel,
        },
        timestamp: row.timestamp.toISOString(),
      };
    });

    return {
      deviceStatuses,
      requestId: 'local-' + Date.now(),
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error("Failed to fetch device statuses:", error);
    throw new Error("Unable to load device status data.");
  }
}