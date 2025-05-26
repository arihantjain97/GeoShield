'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Device } from '@/types/device';
import { Geofence } from '@/types/geofence';
import { Alert } from '@/types/alert';

interface GeoShieldState {
  // Devices
  devices: Device[];
  selectedDeviceId: string | null;
  setDevices: (devices: Device[]) => void;
  addDevice: (device: Device) => void;
  updateDevice: (id: string, data: Partial<Device>) => void;
  removeDevice: (id: string) => void;
  setSelectedDeviceId: (id: string | null) => void;
  
  // Geofences
  geofences: Geofence[];
  selectedGeofenceId: string | null;
  addGeofence: (geofence: Geofence) => void;
  updateGeofence: (id: string, data: Partial<Geofence>) => void;
  removeGeofence: (id: string) => void;
  setSelectedGeofenceId: (id: string | null) => void;
  
  // Alerts
  alerts: Alert[];
  addAlert: (alert: Alert) => void;
  clearAlerts: () => void;
}

export const useGeoShieldStore = create<GeoShieldState>()(
  persist(
    (set) => ({
      // Devices
      devices: [],
      selectedDeviceId: null,
      setDevices: (devices) => set({ devices }),
      addDevice: (device) => set((state) => ({ 
        devices: [...state.devices, device] 
      })),
      updateDevice: (id, data) => set((state) => ({
        devices: state.devices.map((device) => 
          device.id === id ? { ...device, ...data } : device
        ),
      })),
      removeDevice: (id) => set((state) => ({
        devices: state.devices.filter((device) => device.id !== id),
        selectedDeviceId: state.selectedDeviceId === id ? null : state.selectedDeviceId,
      })),
      setSelectedDeviceId: (id) => set({ selectedDeviceId: id }),
      
      // Geofences
      geofences: [],
      selectedGeofenceId: null,
      addGeofence: (geofence) => set((state) => ({ 
        geofences: [...state.geofences, geofence] 
      })),
      updateGeofence: (id, data) => set((state) => ({
        geofences: state.geofences.map((geofence) => 
          geofence.id === id ? { ...geofence, ...data } : geofence
        ),
      })),
      removeGeofence: (id) => set((state) => ({
        geofences: state.geofences.filter((geofence) => geofence.id !== id),
        selectedGeofenceId: state.selectedGeofenceId === id ? null : state.selectedGeofenceId,
      })),
      setSelectedGeofenceId: (id) => set({ selectedGeofenceId: id }),
      
      // Alerts
      alerts: [],
      addAlert: (alert) => set((state) => ({ 
        alerts: [alert, ...state.alerts].slice(0, 100) // Keep only the most recent 100 alerts
      })),
      clearAlerts: () => set({ alerts: [] }),
    }),
    {
      name: 'geoshield-storage',
      partialize: (state) => ({
        devices: state.devices,
        geofences: state.geofences,
        // Don't persist alerts or selection state
      }),
    }
  )
);