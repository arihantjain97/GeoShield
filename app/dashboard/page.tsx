'use client';

import { useState, useEffect } from 'react';
import { useGeoShieldStore } from '@/lib/store';
import { MapView } from '@/components/map/map-view';
import { DeviceStatusPanel } from '@/components/dashboard/device-status-panel';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { useToast } from '@/hooks/use-toast';
import { AlertType, AlertSeverity } from '@/types/alert';
import { v4 as uuidv4 } from 'uuid';
import { fetchDeviceLocations } from '@/hooks/use-device-locations';
import { fetchDeviceStatuses } from '@/hooks/use-device-statuses';
import { config } from '@/core/config';
import { Device } from '@/types/device';

export default function DashboardPage() {
  const { devices, setDevices, selectedDeviceId, setSelectedDeviceId, addAlert } = useGeoShieldStore();
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Function to update device data
  const updateDeviceData = async () => {
    try {
      // If no devices in store, add mock data
      if (devices.length === 0) {
        const mockDevices: Device[] = [
          {
            id: 'device-001',
            name: 'Armored Truck #1',
            type: 'VEHICLE',
            status: 'ACTIVE',
            simNumber: '65912345678',
            imei: '123456789012345',
            description: 'Primary CIT vehicle - North route',
            assignedTo: 'Team A',
            tags: ['CIT', 'North'],
            lastUpdated: new Date().toISOString(),
          },
          {
            id: 'device-002',
            name: 'Armored Truck #2',
            type: 'VEHICLE',
            status: 'ACTIVE',
            simNumber: '65912345679',
            imei: '123456789012346',
            description: 'Secondary CIT vehicle - East route',
            assignedTo: 'Team B',
            tags: ['CIT', 'East'],
            lastUpdated: new Date().toISOString(),
          },
          {
            id: 'device-003',
            name: 'Guard #1 Mobile',
            type: 'PERSONNEL',
            status: 'ACTIVE',
            simNumber: '65912345680',
            description: 'Lead guard mobile device',
            assignedTo: 'John Smith',
            tags: ['Personnel', 'Guard'],
            lastUpdated: new Date().toISOString(),
          },
          {
            id: 'device-004',
            name: 'High-Value Container',
            type: 'CONTAINER',
            status: 'ACTIVE',
            simNumber: '65912345681',
            description: 'Secure container with IoT tracking',
            tags: ['Container', 'High-Value'],
            lastUpdated: new Date().toISOString(),
          },
          {
            id: 'device-005',
            name: 'Backup Tracker',
            type: 'ASSET',
            status: 'INACTIVE',
            simNumber: '65912345682',
            description: 'Secondary tracking device',
            tags: ['Backup', 'Asset'],
            lastUpdated: new Date().toISOString(),
          }
        ];
        setDevices(mockDevices);
      }

      // Fetch device locations
      const locations = await fetchDeviceLocations();
      // Fetch device statuses
      const statuses = await fetchDeviceStatuses();

      // Update devices with location and status information
      const updatedDevices = devices.map(device => {
        const locationData = locations.deviceLocations.find(loc => loc.deviceId === device.id);
        const statusData = statuses.deviceStatuses.find(stat => stat.deviceId === device.id);
        
        let updatedDevice = { ...device, lastUpdated: new Date().toISOString() };
        
        // Update location if available
        if (locationData && locationData.status === 'VALID') {
          updatedDevice.lastLocation = {
            latitude: locationData.location.latitude,
            longitude: locationData.location.longitude,
            accuracy: locationData.location.accuracy,
            timestamp: locationData.location.timestamp,
          };
        }
        
        // Update network info if available
        if (statusData && statusData.status === 'REACHABLE') {
          updatedDevice.networkInfo = {
            signalStrength: statusData.networkInfo.signalStrength,
            networkType: statusData.networkInfo.networkType,
            batteryLevel: statusData.networkInfo.batteryLevel,
          };
        }
        
        return updatedDevice;
      });
      
      setDevices(updatedDevices);
      
      // Check for alerts (e.g., unreachable devices, low battery)
      statuses.deviceStatuses.forEach(status => {
        if (status.status === 'UNREACHABLE') {
          // Device is unreachable - create alert
          const device = devices.find(d => d.id === status.deviceId);
          if (device) {
            addAlert({
              id: uuidv4(),
              type: AlertType.DEVICE_OFFLINE,
              severity: AlertSeverity.ERROR,
              timestamp: new Date().toISOString(),
              deviceId: device.id,
              message: `Device ${device.name} is unreachable: ${status.error?.message || 'Unknown error'}`,
              acknowledged: false,
            });
            
            // Show toast notification
            toast({
              title: 'Device Offline',
              description: `${device.name} is unreachable`,
              variant: 'destructive',
            });
          }
        } else if (status.networkInfo?.batteryLevel < 25) {
          // Low battery - create alert
          const device = devices.find(d => d.id === status.deviceId);
          if (device) {
            addAlert({
              id: uuidv4(),
              type: AlertType.BATTERY_LOW,
              severity: AlertSeverity.WARNING,
              timestamp: new Date().toISOString(),
              deviceId: device.id,
              message: `Low battery (${status.networkInfo.batteryLevel}%) on device ${device.name}`,
              acknowledged: false,
            });
            
            // Show toast notification
            toast({
              title: 'Low Battery',
              description: `${device.name} battery at ${status.networkInfo.batteryLevel}%`,
              variant: 'warning',
            });
          }
        }
      });
      
      setLoading(false);
    } catch (error) {
      console.error('Error updating device data:', error);
      toast({
        title: 'Error',
        description: 'Failed to update device data',
        variant: 'destructive',
      });
      setLoading(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    updateDeviceData();
    
    // Set up polling interval
    const interval = setInterval(updateDeviceData, config.api.pollingInterval);
    
    // Clean up interval on unmount
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem)]">
      <DashboardHeader loading={loading} />
      
      <div className="flex flex-1 overflow-hidden">
        {/* Main map view */}
        <div className="flex-1 relative">
          <MapView devices={devices} onDeviceSelect={setSelectedDeviceId} />
        </div>
        
        {/* Side panel */}
        <div className="w-96 border-l overflow-auto">
          <DeviceStatusPanel 
            devices={devices}
            selectedDeviceId={selectedDeviceId}
            onSelectDevice={setSelectedDeviceId}
          />
        </div>
      </div>
    </div>
  );
}