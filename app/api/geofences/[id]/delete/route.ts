export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { deleteGeofence } from '@/lib/db';

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    await deleteGeofence(params.id);
    console.log(`deleted geofence with ID: ${params.id}`);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Failed to delete geofence', err);
    return NextResponse.json({ error: 'Failed to delete geofence' }, { status: 500 });
  }
}