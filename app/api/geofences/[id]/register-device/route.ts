export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { associateDeviceWithGeofence, disassociateDeviceFromGeofence, getDevicesByGeofence } from '@/lib/db';

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const geofenceId = params.id;
    const body = await req.json();
    const { deviceId } = body;

    if (!deviceId || !geofenceId) {
      console.error('Missing deviceId or geofenceId');
      return NextResponse.json({ error: 'Missing deviceId or geofenceId' }, { status: 400 });
    }

    await associateDeviceWithGeofence(deviceId, geofenceId);
    console.log(`📌 Associated device ${deviceId} with geofence ${geofenceId}`);
    return NextResponse.json({ success: true }, { status: 200 });

  } catch (err) {
    console.error('❌ Failed to associate device with geofence:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const geofenceId = params.id;
    const body = await req.json();
    const { deviceId } = body;

    if (!deviceId || !geofenceId) {
      console.error('Missing deviceId or geofenceId');
      return NextResponse.json({ error: 'Missing deviceId or geofenceId' }, { status: 400 });
    }

    await disassociateDeviceFromGeofence(deviceId, geofenceId);
    console.log(`🗑️ Disassociated device ${deviceId} from geofence ${geofenceId}`);
    return NextResponse.json({ success: true }, { status: 200 });

  } catch (err) {
    console.error('❌ Failed to disassociate device from geofence:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const geofenceId = params.id;

    const devices = await getDevicesByGeofence(geofenceId);
    return NextResponse.json({ devices }, { status: 200 });

  } catch (err) {
    console.error('❌ Failed to fetch devices for geofence:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}




/**
 * 
 * 
 * could you create an extremely simple front end page for my testing.
- a table of fetched devices
- there is a column - with a drop down list. the list is fetched geofences (just total list of geofences)
- each row there are buttons: associate, disassociate.
- - upon pressing associate: POST /api/geofences/id/register-device endpoint is called 
- - up
 */