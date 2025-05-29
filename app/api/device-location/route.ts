// app/api/device-location/route.ts
export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { getDeviceLocations } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log("Received body:", body);

    const { deviceIds } = body;

    if (!Array.isArray(deviceIds)) {
      console.warn("deviceIds is not an array:", deviceIds);
      return NextResponse.json({ error: "deviceIds must be an array" }, { status: 400 });
    }

    const locationData = await getDeviceLocations(deviceIds);
    console.log("location data fetched:", locationData);

    if (!locationData) {
      throw new Error("getDeviceLocations returned null/undefined");
    }    

    return NextResponse.json(locationData);
  } catch (e) {
    console.error("Failed to fetch device locations:", e);
    return NextResponse.json({ error: 'Failed to fetch device locations' }, { status: 500 });
  }
}