// app/api/devices/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { addDevice,getAllDevices,updateDevice } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { name,type,status,phone_number } = body;

    const statusData = await addDevice(name,type,status,phone_number);
    console.log("Status data fetched:", statusData);

    return NextResponse.json(statusData);
  } catch (e) {
    console.error("Failed to add devices", e);
    return NextResponse.json({ error: 'Failed to add devices' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, type, status, phone_number } = body;

    if (!name || !type || !status || !phone_number) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    const updated = await updateDevice(name, type, status, phone_number);

    return NextResponse.json({ message: 'Device updated', updated });
  } catch (e) {
    console.error("Failed to update device", e);
    return NextResponse.json({ error: 'Failed to update device' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const devices = await getAllDevices();
    
    return NextResponse.json(devices);
  } catch (error) {
    console.error("API /api/devices failed:", error);
    return NextResponse.json({ error: 'Failed to fetch devices' }, { status: 500 });
  }
}