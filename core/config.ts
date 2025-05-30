/**
 * Application configuration
 * Central place for all configuration values
 */

export const config = {
  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || '',
    pollingInterval: 30000, // 30 seconds
    endpoints: {
      deviceLocation: '/device-location/v1/retrieve',
      deviceStatus: '/device-status/v1/retrieve',
      deviceReachability: '/device-reachability-status/v1/retrieve',
      deviceRoaming: '/device-roaming-status/v1/retrieve',
      connectedNetworkType: '/connected-network-type/v1/retrieve',
    },
  },
  mapbox: {
    token: process.env.NEXT_PUBLIC_MAPBOX_TOKEN || 'pk.eyJ1Ijoic3VoYWlsYXJpaGFudCIsImEiOiJjbWIwZ2U3Y3UwY29vMmlzMXoxdXR0cHhkIn0.0GF1WXsRKXlqDzyCw3239g',
    defaultCenter: [103.8198, 1.3521], // Singapore
    defaultZoom: 12,
  },
};