// Types for alert data

export enum AlertType {
  GEOFENCE_ENTRY = 'GEOFENCE_ENTRY',
  GEOFENCE_EXIT = 'GEOFENCE_EXIT',
  DEVICE_OFFLINE = 'DEVICE_OFFLINE',
  DEVICE_ONLINE = 'DEVICE_ONLINE',
  BATTERY_LOW = 'BATTERY_LOW',
  SIGNAL_LOST = 'SIGNAL_LOST',
  SIGNAL_DEGRADED = 'SIGNAL_DEGRADED',
  TAMPER_DETECTED = 'TAMPER_DETECTED',
}

export enum AlertSeverity {
  INFO = 'INFO',
  WARNING = 'WARNING',
  ERROR = 'ERROR',
  CRITICAL = 'CRITICAL',
}

export interface Alert {
  id: string;
  type: AlertType;
  severity: AlertSeverity;
  timestamp: string; // ISO date string
  deviceId: string;
  message: string;
  acknowledged: boolean;
  geofenceId?: string; // Only for geofence-related alerts
  metadata?: Record<string, any>; // Additional context data
}