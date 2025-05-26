export interface DeviceLocation {
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: string;
}

export interface DeviceLocationData {
  deviceId: string;
  location?: DeviceLocation;
  status: 'VALID' | 'LOCATION_UNAVAILABLE';
  error?: {
    code: string;
    message: string;
  };
}

export interface DeviceLocationResponse {
  deviceLocations: DeviceLocationData[];
  requestId: string;
  timestamp: string;
}