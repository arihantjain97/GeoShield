import { rest } from 'msw';
import { config } from '@/core/config';
import { mockDeviceStatuses } from '../data/deviceStatuses';

export const deviceStatusHandlers = [
  rest.post(`${config.api.baseUrl}${config.api.endpoints.deviceStatus}`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        deviceStatuses: mockDeviceStatuses,
        requestId: 'mock-request-id-' + Date.now(),
        timestamp: new Date().toISOString(),
      })
    );
  }),
];