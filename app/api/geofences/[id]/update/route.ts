export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import {
  associateGeofenceWithCellSectors,
  updateGeofence,
  updateCircleShape,
  updatePolygonShape
} from '@/lib/db';
import { GeofenceType } from '@/types/geofence';

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const { name, description, priority, active, type, shape } = await req.json();

    await updateGeofence(params.id, name, description, priority, active);

    if (type === GeofenceType.CIRCLE) {
      const { center, radius } = shape;
      await updateCircleShape(params.id, center.latitude, center.longitude, radius);
      await associateGeofenceWithCellSectors(params.id, 'CIRCLE', {
        center_latitude: center.latitude,
        center_longitude: center.longitude,
        radius,
      });
    } else if (type === GeofenceType.POLYGON) {
      const { coordinates } = shape;
      await updatePolygonShape(params.id, coordinates); // see step 2
      await associateGeofenceWithCellSectors(params.id, 'POLYGON', {
        coordinates,
      });
    }

    console.log(`Successfully updated geofence ${params.id}`);
    return NextResponse.json({ success: true, id: params.id });
  } catch (err) {
    console.error('Failed to update geofence', err);
    return NextResponse.json({ error: 'Failed to update geofence' }, { status: 500 });
  }
}