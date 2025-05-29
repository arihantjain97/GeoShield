// app/api/devices/route.ts
import { NextResponse } from 'next/server';
import { getAllDevices } from '@/lib/db';

export async function GET() {
  try {
    const devices = await getAllDevices();
    
    return NextResponse.json(devices);
  } catch (error) {
    console.error("API /api/devices failed:", error);
    return NextResponse.json({ error: 'Failed to fetch devices' }, { status: 500 });
  }
}