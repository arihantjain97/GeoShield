// app/api/device-status/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getDeviceStatuses } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { deviceIds } = body;

    if (!Array.isArray(deviceIds)) {
      return NextResponse.json({ error: "deviceIds must be an array" }, { status: 400 });
    }

    const statusData = await getDeviceStatuses(deviceIds);
    return NextResponse.json(statusData);
  } catch (e) {
    console.error("Failed to fetch device statuses:", e);
    return NextResponse.json({ error: 'Failed to fetch device statuses' }, { status: 500 });
  }
}