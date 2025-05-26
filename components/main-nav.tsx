'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Shield, Map, Smartphone, MapPin } from 'lucide-react';

export function MainNav() {
  const pathname = usePathname();

  return (
    <div className="mr-4 flex">
      <Link href="/" className="mr-6 flex items-center space-x-2">
        <Shield className="h-6 w-6" />
        <span className="font-bold hidden md:inline-block">GeoShield™</span>
      </Link>
      <nav className="flex items-center space-x-6 text-sm font-medium">
        <Link
          href="/dashboard"
          className={cn(
            "flex items-center transition-colors hover:text-foreground/80",
            pathname === "/dashboard" ? "text-foreground" : "text-foreground/60"
          )}
        >
          <Map className="w-4 h-4 mr-1" />
          <span>Dashboard</span>
        </Link>
        <Link
          href="/devices"
          className={cn(
            "flex items-center transition-colors hover:text-foreground/80",
            pathname === "/devices" ? "text-foreground" : "text-foreground/60"
          )}
        >
          <Smartphone className="w-4 h-4 mr-1" />
          <span>Devices</span>
        </Link>
        <Link
          href="/geofences"
          className={cn(
            "flex items-center transition-colors hover:text-foreground/80",
            pathname === "/geofences" ? "text-foreground" : "text-foreground/60"
          )}
        >
          <MapPin className="w-4 h-4 mr-1" />
          <span>Geofences</span>
        </Link>
      </nav>
    </div>
  );
}