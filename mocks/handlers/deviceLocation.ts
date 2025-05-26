import { rest } from 'msw';
import { config } from '@/core/config';
import { mockDeviceLocations } from '../data/deviceLocations';

export const deviceLocationHandlers = [
  rest.post(`${config.api.baseUrl}${config.api.endpoints.deviceLocation}`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        deviceLocations: mockDeviceLocations,
        requestId: 'mock-request-id-' + Date.now(),
        timestamp: new Date().toISOString(),
      })
    );
  }),
];