import { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Shield } from 'lucide-react';
import { buttonVariants } from "@/components/ui/button"; 

export const metadata: Metadata = {
  title: 'GeoShield™ - Enterprise Geofencing & Device Monitoring',
  description: 'Carrier-grade geofencing and device-health monitoring for high-value mobile assets and field workers',
};

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-3.5rem)] px-4 py-10 bg-gradient-to-b from-background to-muted">
      <div className="max-w-3xl mx-auto text-center space-y-6">
        <div className="inline-block p-3 rounded-full bg-primary/10 mb-6">
          <Shield className="h-12 w-12 text-primary" />
        </div>
        
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground">
          GeoShield<span className="text-primary">™</span>
        </h1>
        
        <p className="text-xl md:text-2xl text-muted-foreground">
          Real-time, carrier-grade geofencing and device-health monitoring for high-value mobile assets and field workers
        </p>
        
        <div className="flex justify-center gap-4 mt-8">
          <Button asChild size="lg" variant="outline" className="text-md px-8">
            <Link href="/dashboard">Enter Dashboard</Link>
          </Button>

          <Button asChild variant="outline" size="lg" className="text-md px-8">
            <Link href="/devices">Manage Devices</Link>
          </Button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-16">
          <div className="p-6 rounded-lg border bg-card">
            <h3 className="text-lg font-semibold mb-2">Real-time Monitoring</h3>
            <p className="text-muted-foreground">Network-native visibility that outperforms GPS trackers or over-the-top SDKs</p>
          </div>
          <div className="p-6 rounded-lg border bg-card">
            <h3 className="text-lg font-semibold mb-2">Tampering Detection</h3>
            <p className="text-muted-foreground">Instant alerts for signal loss or device manipulation attempts</p>
          </div>
          <div className="p-6 rounded-lg border bg-card">
            <h3 className="text-lg font-semibold mb-2">SLA-bound Tracking</h3>
            <p className="text-muted-foreground">Enforce corridor tracking with automated alerts to prevent delays and fines</p>
          </div>
        </div>
      </div>
    </div>
  );
}