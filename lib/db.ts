import { sql } from '@vercel/postgres';
import { DeviceLocationResponse } from '@/types/api/device-location';
import { DeviceStatusResponse } from '@/types/api/device-status';

export async function getDeviceLocations(deviceIds: string[]): Promise<DeviceLocationResponse> {
  const result = await sql`
    SELECT 
      d.id as device_id,
      dl.latitude,
      dl.longitude,
      dl.radius as accuracy,
      dl.last_updated as timestamp
    FROM devices d
    LEFT JOIN device_location dl ON d.id = dl.device_id
    WHERE d.id = ANY(${deviceIds})
  `;

  const deviceLocations = result.rows.map(row => ({
    deviceId: row.device_id,
    location: row.latitude ? {
      latitude: row.latitude,
      longitude: row.longitude,
      accuracy: row.accuracy,
      timestamp: row.timestamp.toISOString()
    } : undefined,
    status: row.latitude ? 'VALID' : 'LOCATION_UNAVAILABLE'
  }));

  return {
    deviceLocations,
    requestId: 'local-' + Date.now(),
    timestamp: new Date().toISOString()
  };
}

export async function getDeviceStatuses(deviceIds: string[]): Promise<DeviceStatusResponse> {
  const result = await sql`
    SELECT 
      d.id as device_id,
      ds.signal_strength,
      ds.network_type,
      ds.battery_level,
      ds.connectivity_status,
      ds.last_updated as timestamp
    FROM devices d
    LEFT JOIN device_status ds ON d.id = ds.device_id
    WHERE d.id = ANY(${deviceIds})
  `;

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
        batteryLevel
      },
      timestamp: row.timestamp.toISOString()
    };
  });

  return {
    deviceStatuses,
    requestId: 'local-' + Date.now(),
    timestamp: new Date().toISOString()
  };
}