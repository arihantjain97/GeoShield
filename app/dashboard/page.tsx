'use client';

import React, { useRef, useState, useEffect } from "react";
import { useGeoShieldStore } from '@/lib/store';
import { MapView } from '@/components/map/map-view';
import { DeviceStatusPanel } from '@/components/dashboard/device-status-panel';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { config } from '@/core/config';

export default function DashboardPage() {
  const { devices, setDevices, selectedDeviceId, setSelectedDeviceId } = useGeoShieldStore();
  const [loading, setLoading] = useState(true);

  const updateDeviceData = async () => {
  try {
    const devicesRes = await fetch('/api/devices');
    const dbDevices = await devicesRes.json();

    if (dbDevices.length > 0) {
      const deviceIds = dbDevices.map((d: any) => d.id);

      const [locationsRes, statusesRes] = await Promise.all([
        fetch('/api/device-location', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ deviceIds }),
        }),
        fetch('/api/device-status', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ deviceIds }),
        }),
      ]);

      const locationsData = await locationsRes.json();
      const statusesData = await statusesRes.json();

      const updatedDevices = dbDevices.map((device: any) => {
        const locationData = locationsData.deviceLocations?.find((l: any) => l.deviceId === device.id);
        const statusData = statusesData.deviceStatuses?.find((s: any) => s.deviceId === device.id);

        let updatedDevice = { ...device, lastUpdated: new Date().toISOString() };

        if (locationData && locationData.status === 'VALID') {
          updatedDevice.lastLocation = {
            latitude: locationData.location!.latitude,
            longitude: locationData.location!.longitude,
            accuracy: locationData.location!.accuracy,
            timestamp: locationData.location!.timestamp,
          };
        }

        if (statusData && statusData.status === 'REACHABLE') {
          updatedDevice.networkInfo = {
            signalStrength: statusData.networkInfo!.signalStrength,
            networkType: statusData.networkInfo!.networkType,
            batteryLevel: statusData.networkInfo!.batteryLevel,
          };
        }

        return updatedDevice;
      });

      setDevices(updatedDevices);
    }
  } catch (error) {
    console.error("DashboardPage: Failed to update device data:", error);
  } finally {
    setLoading(false);
  }
};



  
  // Load data once and poll periodically
  useEffect(() => {
    updateDeviceData();
    const interval = setInterval(updateDeviceData, config.api.pollingInterval);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem)]">
      <DashboardHeader loading={loading} />
      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 relative">
          <MapView devices={devices} onDeviceSelect={setSelectedDeviceId} />
        </div>
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