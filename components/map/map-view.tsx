'use client';

import { useRef, useState, useEffect } from 'react';
import Map, { Marker, Popup, NavigationControl } from 'react-map-gl';
import { config } from '@/core/config';
import { Device } from '@/types/device';
import { useGeoShieldStore } from '@/lib/store';
import { MapPin, Truck, User, Package, HardDrive, AlertTriangle } from 'lucide-react';
import 'mapbox-gl/dist/mapbox-gl.css';

interface MapViewProps {
  devices: Device[];
  onDeviceSelect: (id: string | null) => void;
}

export function MapView({ devices, onDeviceSelect }: MapViewProps) {
  const mapRef = useRef(null);
  const [popupInfo, setPopupInfo] = useState<Device | null>(null);
  const { geofences } = useGeoShieldStore();
  
  // Default to Singapore location if no devices have location
  const [viewState, setViewState] = useState({
    latitude: config.mapbox.defaultCenter[1],
    longitude: config.mapbox.defaultCenter[0],
    zoom: config.mapbox.defaultZoom,
  });
  
  // Update map center based on devices with location
  useEffect(() => {
    const devicesWithLocation = devices.filter(d => d.lastLocation);
    if (devicesWithLocation.length > 0) {
      // Center on first device with location
      const device = devicesWithLocation[0];
      setViewState({
        latitude: device.lastLocation!.latitude,
        longitude: device.lastLocation!.longitude,
        zoom: 12,
      });
    }
  }, [devices]);
  
  // Get device icon based on type
  const getDeviceIcon = (device: Device) => {
    const isOffline = !device.networkInfo;
    const iconClass = `p-1 rounded-full ${isOffline ? 'bg-destructive/20' : 'bg-background/90'} shadow-md`;
    
    switch (device.type) {
      case 'VEHICLE':
        return (
          <div className={iconClass}>
            <Truck className={`h-5 w-5 ${isOffline ? 'text-destructive' : 'text-primary'}`} />
          </div>
        );
      case 'PERSONNEL':
        return (
          <div className={iconClass}>
            <User className={`h-5 w-5 ${isOffline ? 'text-destructive' : 'text-primary'}`} />
          </div>
        );
      case 'CONTAINER':
        return (
          <div className={iconClass}>
            <Package className={`h-5 w-5 ${isOffline ? 'text-destructive' : 'text-primary'}`} />
          </div>
        );
      case 'ASSET':
        return (
          <div className={iconClass}>
            <HardDrive className={`h-5 w-5 ${isOffline ? 'text-destructive' : 'text-primary'}`} />
          </div>
        );
      default:
        return (
          <div className={iconClass}>
            <MapPin className={`h-5 w-5 ${isOffline ? 'text-destructive' : 'text-primary'}`} />
          </div>
        );
    }
  };
  
  // Format battery level for display
  const formatBatteryLevel = (level: number | undefined) => {
    if (level === undefined) return 'Unknown';
    return `${level}%`;
  };
  
  // Check if a device is offline
  const isDeviceOffline = (device: Device) => {
    return !device.networkInfo;
  };
  
  return (
    <Map
      ref={mapRef}
      mapboxAccessToken={config.mapbox.token || 'pk.eyJ1IjoiZ2Vvc2hpZWxkIiwiYSI6ImNsaDVnZ3VqZTAyY3AzZHBsNDh4YXczcGcifQ.WZmfQ6Qh4aGoqGe9LYzlrg'}
      mapStyle="mapbox://styles/mapbox/dark-v11"
      {...viewState}
      onMove={evt => setViewState(evt.viewState)}
      style={{ width: '100%', height: '100%' }}
    >
      <NavigationControl position="top-right" />
      
      {/* Render device markers */}
      {devices.map(device => {
        if (!device.lastLocation) return null;
        
        return (
          <Marker
            key={device.id}
            latitude={device.lastLocation.latitude}
            longitude={device.lastLocation.longitude}
            onClick={e => {
              e.originalEvent.stopPropagation();
              setPopupInfo(device);
              onDeviceSelect(device.id);
            }}
          >
            {getDeviceIcon(device)}
          </Marker>
        );
      })}
      
      {/* Popup for selected device */}
      {popupInfo && popupInfo.lastLocation && (
        <Popup
          anchor="bottom"
          latitude={popupInfo.lastLocation.latitude}
          longitude={popupInfo.lastLocation.longitude}
          onClose={() => setPopupInfo(null)}
          closeOnClick={false}
          className="z-10"
        >
          <div className="p-1">
            <h3 className="font-medium text-sm">{popupInfo.name}</h3>
            <div className="text-xs text-muted-foreground mt-1">{popupInfo.type}</div>
            
            {isDeviceOffline(popupInfo) ? (
              <div className="flex items-center mt-2 text-xs text-destructive">
                <AlertTriangle className="h-3 w-3 mr-1" />
                Device offline
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-2 text-xs">
                <div>Signal:</div>
                <div>{popupInfo.networkInfo?.signalStrength || 'N/A'}</div>
                <div>Battery:</div>
                <div>{formatBatteryLevel(popupInfo.networkInfo?.batteryLevel)}</div>
                <div>Network:</div>
                <div>{popupInfo.networkInfo?.networkType || 'Unknown'}</div>
              </div>
            )}
          </div>
        </Popup>
      )}
    </Map>
  );
}