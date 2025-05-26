'use client';

import { formatDistanceToNow } from 'date-fns';
import { Device } from '@/types/device';
import { SignalHigh, SignalMedium, SignalLow, SignalZero, Battery, Smartphone } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

interface DeviceStatusPanelProps {
  devices: Device[];
  selectedDeviceId: string | null;
  onSelectDevice: (id: string | null) => void;
}

export function DeviceStatusPanel({ 
  devices, 
  selectedDeviceId, 
  onSelectDevice 
}: DeviceStatusPanelProps) {
  // Get selected device
  const selectedDevice = selectedDeviceId 
    ? devices.find(d => d.id === selectedDeviceId) 
    : null;
  
  // Helper function to render signal strength icon
  const renderSignalIcon = (strength: string | undefined) => {
    if (!strength) return <SignalZero className="h-4 w-4 text-destructive" />;
    
    switch (strength) {
      case 'EXCELLENT':
        return <SignalHigh className="h-4 w-4 text-emerald-500" />;
      case 'GOOD':
        return <SignalHigh className="h-4 w-4 text-emerald-400" />;
      case 'FAIR':
        return <SignalMedium className="h-4 w-4 text-yellow-500" />;
      case 'POOR':
        return <SignalLow className="h-4 w-4 text-orange-500" />;
      default:
        return <SignalZero className="h-4 w-4 text-destructive" />;
    }
  };
  
  // Helper function to get battery color
  const getBatteryColor = (level: number | undefined) => {
    if (level === undefined) return 'bg-destructive';
    if (level > 60) return 'bg-emerald-500';
    if (level > 30) return 'bg-yellow-500';
    return 'bg-destructive';
  };
  
  // Helper function to format last updated time
  const formatLastUpdated = (timestamp: string | undefined) => {
    if (!timestamp) return 'Unknown';
    try {
      return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
    } catch (e) {
      return 'Invalid date';
    }
  };
  
  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">Device Status</h2>
        <p className="text-sm text-muted-foreground">
          {selectedDevice 
            ? `Viewing details for ${selectedDevice.name}`
            : `Select a device to view details (${devices.length} total)`}
        </p>
      </div>
      
      {selectedDevice ? (
        <div className="flex-1 p-4">
          <div className="mb-6">
            <h3 className="text-xl font-semibold">{selectedDevice.name}</h3>
            <div className="flex items-center text-sm text-muted-foreground mt-1">
              <Smartphone className="h-4 w-4 mr-1" />
              <span>ID: {selectedDevice.id}</span>
            </div>
            {selectedDevice.description && (
              <p className="text-sm mt-2">{selectedDevice.description}</p>
            )}
            <div className="mt-2 flex flex-wrap gap-1">
              {selectedDevice.tags?.map(tag => (
                <span key={tag} className="px-2 py-0.5 bg-secondary text-secondary-foreground rounded-md text-xs">
                  {tag}
                </span>
              ))}
            </div>
          </div>
          
          <div className="space-y-6">
            {/* Network Status */}
            <div>
              <h4 className="text-sm font-medium mb-2">Network Status</h4>
              <div className="bg-card rounded-lg border p-3 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Signal Strength</span>
                  <div className="flex items-center">
                    {renderSignalIcon(selectedDevice.networkInfo?.signalStrength)}
                    <span className="text-sm ml-1">
                      {selectedDevice.networkInfo?.signalStrength || 'N/A'}
                    </span>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm">Network Type</span>
                  <span className="text-sm font-medium">
                    {selectedDevice.networkInfo?.networkType || 'Unknown'}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm">Last Updated</span>
                  <span className="text-sm">
                    {formatLastUpdated(selectedDevice.lastUpdated)}
                  </span>
                </div>
              </div>
            </div>
            
            {/* Battery Status */}
            <div>
              <h4 className="text-sm font-medium mb-2">Battery Status</h4>
              <div className="bg-card rounded-lg border p-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <Battery className="h-4 w-4 mr-1" />
                    <span className="text-sm">Battery Level</span>
                  </div>
                  <span className="text-sm font-medium">
                    {selectedDevice.networkInfo?.batteryLevel !== undefined 
                      ? `${selectedDevice.networkInfo.batteryLevel}%` 
                      : 'Unknown'}
                  </span>
                </div>
                <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                  <div 
                    className={cn(
                      "h-full transition-all duration-300",
                      getBatteryColor(selectedDevice.networkInfo?.batteryLevel)
                    )}
                    style={{ 
                      width: `${selectedDevice.networkInfo?.batteryLevel ?? 0}%`
                    }}
                  />
                </div>
              </div>
            </div>
            
            {/* Location Information */}
            <div>
              <h4 className="text-sm font-medium mb-2">Location Information</h4>
              <div className="bg-card rounded-lg border p-3 space-y-3">
                {selectedDevice.lastLocation ? (
                  <>
                    <div className="flex justify-between">
                      <span className="text-sm">Latitude</span>
                      <span className="text-sm font-medium">
                        {selectedDevice.lastLocation.latitude.toFixed(6)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Longitude</span>
                      <span className="text-sm font-medium">
                        {selectedDevice.lastLocation.longitude.toFixed(6)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Accuracy</span>
                      <span className="text-sm font-medium">
                        {selectedDevice.lastLocation.accuracy} m
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Last Location Update</span>
                      <span className="text-sm">
                        {formatLastUpdated(selectedDevice.lastLocation.timestamp)}
                      </span>
                    </div>
                  </>
                ) : (
                  <div className="py-2 text-center text-sm text-muted-foreground">
                    No location data available
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <ScrollArea className="flex-1">
          <div className="p-4 space-y-2">
            {devices.map(device => (
              <div 
                key={device.id}
                className={cn(
                  "p-3 rounded-lg border cursor-pointer transition-colors",
                  "hover:bg-accent hover:text-accent-foreground"
                )}
                onClick={() => onSelectDevice(device.id)}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-medium">{device.name}</h3>
                    <div className="text-xs text-muted-foreground mt-1">
                      {device.type} • {device.simNumber}
                    </div>
                  </div>
                  <div className="flex items-center">
                    {renderSignalIcon(device.networkInfo?.signalStrength)}
                    {device.networkInfo?.batteryLevel !== undefined && (
                      <div className="ml-2 flex items-center">
                        <Battery className="h-4 w-4 mr-1" />
                        <span className={cn(
                          "text-xs",
                          device.networkInfo.batteryLevel < 30 && "text-destructive"
                        )}>
                          {device.networkInfo.batteryLevel}%
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="mt-2 text-xs">
                  <span className="text-muted-foreground">Last updated: </span>
                  <span>{formatLastUpdated(device.lastUpdated)}</span>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  );
}