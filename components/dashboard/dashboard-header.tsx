'use client';

import { useGeoShieldStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

interface DashboardHeaderProps {
  loading: boolean;
}

export function DashboardHeader({ loading }: DashboardHeaderProps) {
  const { devices } = useGeoShieldStore();
  
  // Calculate stats with fallback for undefined devices
  const activeDevices = (devices ?? []).filter(d => d.status === 'ACTIVE').length;
  const totalDevices = devices?.length ?? 0;
  
  return (
    <div className="bg-card p-4 border-b">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Real-time monitoring of assets and geofences</p>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Stats summary */}
          <div className="flex items-center space-x-4 mr-4">
            <div>
              <Button variant="outline" size="sm" className="gap-2">
                Devices: {activeDevices}/{totalDevices}
              </Button>
            </div>
          </div>
          
          {/* Refresh button */}
          <Button 
            variant="outline" 
            size="sm" 
            disabled={loading}
            onClick={() => window.location.reload()}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Updating...' : 'Refresh'}
          </Button>
        </div>
      </div>
    </div>
  );
}