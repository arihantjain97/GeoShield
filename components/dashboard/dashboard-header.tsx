'use client';

import { useGeoShieldStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { RefreshCw, AlertTriangle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { AlertSeverity } from '@/types/alert';
import { useRouter } from 'next/navigation';

interface DashboardHeaderProps {
  loading: boolean;
}

export function DashboardHeader({ loading }: DashboardHeaderProps) {
  const { devices, alerts } = useGeoShieldStore();
  const router = useRouter();
  
  // Count active alerts by severity
  const criticalAlerts = alerts.filter(a => a.severity === AlertSeverity.CRITICAL && !a.acknowledged).length;
  const errorAlerts = alerts.filter(a => a.severity === AlertSeverity.ERROR && !a.acknowledged).length;
  const warningAlerts = alerts.filter(a => a.severity === AlertSeverity.WARNING && !a.acknowledged).length;
  
  // Calculate stats
  const activeDevices = devices.filter(d => d.status === 'ACTIVE').length;
  const totalDevices = devices.length;
  const alertsExist = criticalAlerts > 0 || errorAlerts > 0 || warningAlerts > 0;
  
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
              <Badge variant="outline" className="px-2 py-1">
                Devices: {activeDevices}/{totalDevices}
              </Badge>
            </div>
            
            {alertsExist && (
              <Button 
                variant="outline" 
                size="sm" 
                className="gap-2"
                onClick={() => router.push('/alerts')}
              >
                <AlertTriangle className="h-4 w-4 text-destructive" />
                {criticalAlerts > 0 && (
                  <Badge variant="destructive" className="px-1.5 py-0 h-5 text-xs">
                    {criticalAlerts}
                  </Badge>
                )}
                {errorAlerts > 0 && (
                  <Badge variant="destructive" className="px-1.5 py-0 h-5 text-xs">
                    {errorAlerts}
                  </Badge>
                )}
                {warningAlerts > 0 && (
                  <Badge variant="default" className="bg-yellow-500 px-1.5 py-0 h-5 text-xs">
                    {warningAlerts}
                  </Badge>
                )}
              </Button>
            )}
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