// Mock data for device locations based on CAMARA API spec
export const mockDeviceLocations = [
  {
    deviceId: 'device-001',
    location: {
      latitude: 1.3521,
      longitude: 103.8198,
      accuracy: 10,
      timestamp: new Date().toISOString(),
    },
    status: 'VALID',
  },
  {
    deviceId: 'device-002',
    location: {
      latitude: 1.3423,
      longitude: 103.8353,
      accuracy: 15,
      timestamp: new Date().toISOString(),
    },
    status: 'VALID',
  },
  {
    deviceId: 'device-003',
    location: {
      latitude: 1.3644,
      longitude: 103.9915,
      accuracy: 5,
      timestamp: new Date().toISOString(),
    },
    status: 'VALID',
  },
  {
    deviceId: 'device-004',
    location: {
      latitude: 1.2929,
      longitude: 103.8547,
      accuracy: 12,
      timestamp: new Date().toISOString(),
    },
    status: 'VALID',
  },
  {
    deviceId: 'device-005',
    status: 'LOCATION_UNAVAILABLE',
    error: {
      code: 'DEVICE_UNREACHABLE',
      message: 'Device is not reachable',
    },
  },
];