// Types for device data

export enum DeviceType {
  VEHICLE = 'VEHICLE',
  PERSONNEL = 'PERSONNEL',
  CONTAINER = 'CONTAINER',
  ASSET = 'ASSET',
}

export enum DeviceStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  MAINTENANCE = 'MAINTENANCE',
}

export enum NetworkType {
  FIVEG = '5G',
  FOURG = '4G',
  THREEG = '3G',
  UNKNOWN = 'UNKNOWN',
}

export enum SignalStrength {
  EXCELLENT = 'EXCELLENT',
  GOOD = 'GOOD',
  FAIR = 'FAIR',
  POOR = 'POOR',
  NONE = 'NONE',
}

export interface DeviceNetworkInfo {
  signalStrength: SignalStrength;
  networkType: NetworkType;
  batteryLevel: number; // 0-100
}

export interface DeviceLocation {
  latitude: number;
  longitude: number;
  accuracy: number; // in meters
  timestamp: string; // ISO date string
}

export interface Device {
  id: string;
  name: string;
  type: DeviceType;
  status: DeviceStatus;
  simNumber: string;
  imei?: string;
  description?: string;
  assignedTo?: string;
  tags?: string[];
  lastUpdated: string; // ISO date string
  lastLocation?: DeviceLocation;
  networkInfo?: DeviceNetworkInfo;
}