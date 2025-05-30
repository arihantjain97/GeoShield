export interface DeviceNetworkInfo {
  signalStrength: 'EXCELLENT' | 'GOOD' | 'FAIR' | 'POOR' | 'NONE';
  networkType: '5G' | '4G' | '3G' | 'UNKNOWN';
  batteryLevel: number;
}

export interface DeviceStatusData {
  deviceId: string;
  status: 'REACHABLE' | 'UNREACHABLE';
  networkInfo?: DeviceNetworkInfo;
  error?: {
    code: string;
    message: string;
  };
  timestamp: string;
}

export interface DeviceStatusResponse {
  deviceStatuses: DeviceStatusData[];
  timestamp: string;
}