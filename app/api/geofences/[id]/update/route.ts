export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { updateGeofence } from '@/lib/db';

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const { name, description, priority, active } = await req.json();
    await updateGeofence(params.id, name, description, priority, active);
    console.log(`Updated geofence with ID: ${params.id}`);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Failed to update geofence', err);
    return NextResponse.json({ error: 'Failed to update geofence' }, { status: 500 });
  }
}