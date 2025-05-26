import { rest } from 'msw';
import { config } from '@/core/config';

export const deviceReachabilityHandlers = [
  rest.post(`${config.api.baseUrl}${config.api.endpoints.deviceReachability}`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        lastStatusTime: new Date().toISOString(),
        reachable: true,
        connectivity: ['DATA', 'SMS']
      })
    );
  }),
];