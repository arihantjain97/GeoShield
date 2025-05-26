// Types for geofence data

export enum GeofenceType {
  CIRCLE = 'CIRCLE',
  POLYGON = 'POLYGON',
}

export enum GeofencePriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

export interface CircleGeofence {
  type: GeofenceType.CIRCLE;
  center: {
    latitude: number;
    longitude: number;
  };
  radius: number; // in meters
}

export interface PolygonGeofence {
  type: GeofenceType.POLYGON;
  coordinates: Array<{
    latitude: number;
    longitude: number;
  }>;
}

export interface Geofence {
  id: string;
  name: string;
  description?: string;
  shape: CircleGeofence | PolygonGeofence;
  priority: GeofencePriority;
  active: boolean;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  appliesTo?: string[]; // device IDs this geofence applies to
}