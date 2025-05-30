export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { getDeviceStatuses,deleteDeviceByPhoneNumber} from '@/lib/db';
import {getCAMARADeviceStatus} from '@/lib/camaraAPI';

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

export async function GET(_: NextRequest, { params }: { params: { simNumber: string } }) {
  try {
    const { simNumber } = params;
    const devicesStatus = await getCAMARADeviceStatus(simNumber);
    return NextResponse.json(devicesStatus);
  } catch (error) {
    console.error("API /api/devices failed:", error);
    return NextResponse.json({ error: 'Failed to fetch devices' }, { status: 500 });
  }
}

export async function DELETE(_: NextRequest,{ params }: { params: { simNumber: string } }) {
  try {
    const { simNumber } = params;

    if (!simNumber) {
      return NextResponse.json(
        { error: 'simNumber parameter is required' },
        { status: 400 }
      );
    }

    await deleteDeviceByPhoneNumber(simNumber);

    return NextResponse.json(
      { message: `Device with simNumber ${simNumber} deleted successfully.` },
      { status: 200 }
    );
  } catch (error) {
    console.error('API /api/device delete failed:', error);
    return NextResponse.json(
      { error: 'Failed to delete device' },
      { status: 500 }
    );
  }
}