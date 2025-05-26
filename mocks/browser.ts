import { setupWorker } from 'msw';
import { deviceLocationHandlers } from './handlers/deviceLocation';
import { deviceStatusHandlers } from './handlers/deviceStatus';
import { deviceReachabilityHandlers } from './handlers/deviceReachability';

// Combine all handlers
const handlers = [
  ...deviceLocationHandlers, 
  ...deviceStatusHandlers,
  ...deviceReachabilityHandlers
];

// Create the worker instance
export const worker = setupWorker(...handlers);

// Export initialization function for use in app startup
export const initMocks = () => worker.start({
  onUnhandledRequest: 'bypass', // Don't warn about unhandled requests
});