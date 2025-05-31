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


function haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const toRad = (x: number) => x * Math.PI / 180;
  const R = 6371000; // Earth's radius in meters
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = Math.sin(dLat/2)**2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon/2)**2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function isPointInPolygon(point: [number, number], polygon: { latitude: number; longitude: number }[]) {
  const x = point[0], y = point[1];
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i].latitude, yi = polygon[i].longitude;
    const xj = polygon[j].latitude, yj = polygon[j].longitude;
    const intersect = ((yi > y) !== (yj > y)) &&
      (x < ((xj - xi) * (y - yi)) / (yj - yi) + xi);
    if (intersect) inside = !inside;
  }
  return inside;
}

export async function associateGeofenceWithCellSectors(
  geofenceId: string,
  type: 'CIRCLE' | 'POLYGON',
  shape: any
): Promise<void> {
  const { rows: sectors } = await pool.query(`
    SELECT eci, latitude, longitude FROM cell_sectors
  `);

  const matched: { eci: string; validity: 'FULL' | 'PARTIAL' }[] = [];

  if (type === 'CIRCLE') {
    const { center_latitude, center_longitude, radius } = shape;
    console.log("📏 Geofence center and radius:", center_latitude, center_longitude, radius);

    for (const s of sectors) {
      const dist = haversineDistance(center_latitude, center_longitude, s.latitude, s.longitude);
      console.log(`📡 Distance to sector ${s.eci} [${s.latitude}, ${s.longitude}]: ${dist.toFixed(2)} meters`);
      if (dist <= radius) {
        matched.push({ eci: s.eci, validity: 'FULL' });
      }
    }
  }

  if (type === 'POLYGON') {
    const polygon = shape.coordinates;
    for (const s of sectors) {
      const inside = isPointInPolygon([s.latitude, s.longitude], polygon);
      if (inside) {
        matched.push({ eci: s.eci, validity: 'FULL' });
      }
    }
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await client.query(`DELETE FROM geofence_cells WHERE geofence_id = $1`, [geofenceId]);

    for (const m of matched) {
      await client.query(`
        INSERT INTO geofence_cells (geofence_id, eci, validity)
        VALUES ($1, $2, $3)
      `, [geofenceId, m.eci, m.validity]);
    }

    await client.query('COMMIT');
    console.log(`Associated ${matched.length} cell sectors with geofence ${geofenceId}`);
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Failed to associate geofence with cells:', err);
    throw err;
  } finally {
    client.release();
  }
}

// Fetch all geofences with their shape details
export async function fetchAllGeofencesWithShape(): Promise<any[]> {
  const client = await pool.connect();
  try {
    console.log('Fetching all geofences with shape data...');
    const result = await client.query(`
      SELECT
        g.id,
        g.name,
        g.geofence_type,
        g.description,
        g.priority,
        g.active,
        gc.center_latitude,
        gc.center_longitude,
        gc.radius,
        gp.point_order,
        gp.latitude as poly_latitude,
        gp.longitude as poly_longitude
      FROM geofences g
      LEFT JOIN geofence_circle gc ON g.id = gc.geofence_id
      LEFT JOIN geofence_polygon gp ON g.id = gp.geofence_id
      ORDER BY g.id, gp.point_order
    `);

    const geofenceMap: Record<string, any> = {};

    for (const row of result.rows) {
      if (!geofenceMap[row.id]) {
        geofenceMap[row.id] = {
          id: row.id,
          name: row.name,
          type: row.geofence_type,
          description: row.description,
          priority: row.priority,
          active: row.active,
          shape: row.geofence_type === 'CIRCLE' ? {
            type: 'CIRCLE',
            center: {
              latitude: row.center_latitude,
              longitude: row.center_longitude
            },
            radius: row.radius
          } : {
            type: 'POLYGON',
            coordinates: []
          }
        };
      }

      if (row.geofence_type === 'POLYGON' && row.poly_latitude !== null && row.poly_longitude !== null) {
        geofenceMap[row.id].shape.coordinates.push({
          latitude: row.poly_latitude,
          longitude: row.poly_longitude
        });
      }
    }

    const geofences = Object.values(geofenceMap);
    console.log(`Retrieved ${geofences.length} geofences.`);
    return geofences;
  } catch (err) {
    console.error('Error fetching geofences with shape:', err);
    throw new Error('Unable to retrieve geofence data.');
  } finally {
    client.release();
  }
}

//Update Geofence (Metadata only)
export async function updateGeofence(
  id: string,
  name: string,
  description: string,
  priority: string,
  active: boolean
): Promise<void> {
  try {
    await pool.query(`
      UPDATE geofences
      SET name = $2, description = $3, priority = $4, active = $5
      WHERE id = $1
    `, [id, name, description, priority, active]);
    console.log(`Updated geofence ${id}`);
  } catch (err) {
    console.error('Error updating geofence:', err);
    throw err;
  }
}

export async function updateCircleShape(
  geofenceId: string,
  lat: number,
  lng: number,
  radius: number
): Promise<void> {
  await pool.query(`
    UPDATE geofence_circle
    SET center_latitude = $2, center_longitude = $3, radius = $4
    WHERE geofence_id = $1
  `, [geofenceId, lat, lng, radius]);
}

export async function updatePolygonShape(
  geofenceId: string,
  coordinates: { latitude: number; longitude: number }[]
): Promise<void> {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await client.query(`DELETE FROM geofence_polygon WHERE geofence_id = $1`, [geofenceId]);

    for (const coord of coordinates) {
      await client.query(`
        INSERT INTO geofence_polygon (geofence_id, latitude, longitude)
        VALUES ($1, $2, $3)
      `, [geofenceId, coord.latitude, coord.longitude]);
    }

    await client.query('COMMIT');
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

// Delete a geofence record from the main geofences table
export async function deleteGeofence(geofenceId: string): Promise<void> {
  try {
    await pool.query(`DELETE FROM geofences WHERE id = $1`, [geofenceId]);
    console.log(`Deleted geofence ${geofenceId}`);
  } catch (err) {
    console.error('Error deleting geofence:', err);
    throw err;
  }
}


// Insert a new geofence record into the main geofences table
export async function createGeofence(
  id: string,
  name: string,
  type: string,
  description: string,
  priority: string,
  active: boolean
): Promise<void> {
  try {
    await pool.query(`
      INSERT INTO geofences (id, name, geofence_type, description, priority, active)
      VALUES ($1, $2, $3, $4, $5, $6)
    `, [id, name, type, description, priority, active]);
    console.log(`Inserted geofence: ${id}, name: ${id}, type: ${type}, description: ${description}, priority: ${priority}, active: ${active}`);
  } catch (err) {
    console.error('Error inserting geofence:', err);
    throw err;
  }
}

// Insert geofence details for a circular geofence
export async function insertCircleGeofence(geofenceId: string, latitude: number, longitude: number, radius: number): Promise<void> {
  try {
    await pool.query(`
      INSERT INTO geofence_circle (geofence_id, center_latitude, center_longitude, radius)
      VALUES ($1, $2, $3, $4)
    `, [geofenceId, latitude, longitude, radius]);
    console.log(`Inserted circle geofence data for: ${geofenceId}`);
  } catch (err) {
    console.error('Error inserting circle geofence:', err);
    throw err;
  }
}

// Insert geofence details for a polygon geofence
export async function insertPolygonGeofence(
  geofenceId: string,
  coordinates: { latitude: number, longitude: number }[]
): Promise<void> {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    for (let i = 0; i < coordinates.length; i++) {
      const { latitude, longitude } = coordinates[i];
      await client.query(`
        INSERT INTO geofence_polygon (geofence_id, point_order, latitude, longitude)
        VALUES ($1, $2, $3, $4)
      `, [geofenceId, i, latitude, longitude]);
    }

    await client.query('COMMIT');
    console.log(`Inserted polygon geofence data for: ${geofenceId}`);
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error inserting polygon geofence:', err);
    throw err;
  } finally {
    client.release();
  }
}

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
      //const batteryLevel = parseInt(row.battery_level) || 0;
      const batteryLevel = row.battery_level ? parseInt(row.battery_level.replace('%', '')) : 0;
      
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