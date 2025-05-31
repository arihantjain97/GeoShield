export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { getGeofenceWithDevices, getDeviceLocations, haversineDistance, isPointInPolygon} from '@/lib/db';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const geofenceId = params.id;

  try {
    const geofence = await getGeofenceWithDevices(geofenceId);
    if (!geofence) {
      return NextResponse.json({ error: 'Geofence not found' }, { status: 404 });
    }

    const locations = await getDeviceLocations(geofence.deviceIds);
    
    const results = locations.deviceLocations.map(loc => {
      if (!loc.location || loc.location.latitude == null || loc.location.longitude == null) {
        return {
          deviceId: loc.deviceId,
          inside: "UNKNOWN",
          latitude: null,
          longitude: null,
          lastSeen: loc.location?.timestamp || null
        };
      }

      let inside = "FALSE";
      const lat = loc.location.latitude;
      const lng = loc.location.longitude;

      if (geofence.type === 'CIRCLE') {
        const dist = haversineDistance(
          geofence.shape.center_latitude,
          geofence.shape.center_longitude,
          lat,
          lng
        );
        if (dist <= geofence.shape.radius) inside = "TRUE";
      } else if (geofence.type === 'POLYGON') {
        const point: [number, number] = [lat, lng];
        if (isPointInPolygon(point, geofence.shape.coordinates)) inside = "TRUE";
      }

      return {
        deviceId: loc.deviceId,
        inside,
        latitude: lat,
        longitude: lng,
        lastSeen: loc.location.timestamp
      };
    });

    return NextResponse.json({ devices: results }, { status: 200 });

  } catch (err) {
    console.error('❌ Error verifying geofence devices:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}