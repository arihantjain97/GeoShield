export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { getDeviceStatuses } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log("Received body:", body);

    const { deviceIds } = body;

    if (!Array.isArray(deviceIds)) {
      console.warn("deviceIds is not an array:", deviceIds);
      return NextResponse.json({ error: "deviceIds must be an array" }, { status: 400 });
    }

    const statusData = await getDeviceStatuses(deviceIds);
    console.log("Status data fetched:", statusData);

    if (!statusData) {
      throw new Error("getDeviceStatuses returned null/undefined");
    }

    return NextResponse.json(statusData);
  } catch (e) {
    console.error("Failed to fetch device statuses:", e);
    return NextResponse.json({ error: 'Failed to fetch device statuses' }, { status: 500 });
  }
}