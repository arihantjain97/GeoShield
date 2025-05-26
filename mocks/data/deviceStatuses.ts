// Mock data for device statuses based on CAMARA API spec
export const mockDeviceStatuses = [
  {
    deviceId: 'device-001',
    status: 'REACHABLE',
    networkInfo: {
      signalStrength: 'EXCELLENT',
      networkType: '5G',
      batteryLevel: 87,
    },
    timestamp: new Date().toISOString(),
  },
  {
    deviceId: 'device-002',
    status: 'REACHABLE',
    networkInfo: {
      signalStrength: 'GOOD',
      networkType: '4G',
      batteryLevel: 65,
    },
    timestamp: new Date().toISOString(),
  },
  {
    deviceId: 'device-003',
    status: 'REACHABLE',
    networkInfo: {
      signalStrength: 'FAIR',
      networkType: '4G',
      batteryLevel: 42,
    },
    timestamp: new Date().toISOString(),
  },
  {
    deviceId: 'device-004',
    status: 'REACHABLE',
    networkInfo: {
      signalStrength: 'EXCELLENT',
      networkType: '5G',
      batteryLevel: 91,
    },
    timestamp: new Date().toISOString(),
  },
  {
    deviceId: 'device-005',
    status: 'UNREACHABLE',
    error: {
      code: 'DEVICE_POWERED_OFF',
      message: 'Device appears to be powered off or out of coverage',
    },
    timestamp: new Date().toISOString(),
  },
];