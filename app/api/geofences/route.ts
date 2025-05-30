export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { createGeofence, insertCircleGeofence, insertPolygonGeofence, fetchAllGeofencesWithShape } from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, type, shape, description = '', priority = 'Medium', active = true } = body;

    // Validate required fields
    if (!name || !type || !shape) {
      console.error('Missing fields in request body:', body);
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    const geofenceId = uuidv4();
    console.log(`Creating geofence with ID: ${geofenceId}, type: ${type}`);

    await createGeofence(geofenceId, name, type, description, priority, active);

    if (type === 'CIRCLE') {
      const { center, radius } = shape;
      if (!center || typeof center.latitude !== 'number' || typeof center.longitude !== 'number' || typeof radius !== 'number') {
        console.error('Invalid circle shape data:', shape);
        return NextResponse.json({ error: 'Invalid circle shape' }, { status: 400 });
      }
      await insertCircleGeofence(geofenceId, center.latitude, center.longitude, radius);

    } else if (type === 'POLYGON') {
      const { coordinates } = shape;
      if (!Array.isArray(coordinates) || coordinates.length < 3) {
        console.error('Polygon requires at least 3 coordinate points:', shape);
        return NextResponse.json({ error: 'Polygon must have at least 3 points' }, { status: 400 });
      }
      await insertPolygonGeofence(geofenceId, coordinates);

    } else {
      console.error('Unsupported geofence type:', type);
      return NextResponse.json({ error: 'Invalid geofence type' }, { status: 400 });
    }

    console.log(`Geofence created successfully: ${geofenceId}`);
    return NextResponse.json({ id: geofenceId }, { status: 201 });

  } catch (err) {
    console.error('Failed to create geofence:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const geofences = await fetchAllGeofencesWithShape();
    return NextResponse.json(geofences, { status: 200 });
  } catch (err) {
    console.error('Failed to fetch geofences:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}