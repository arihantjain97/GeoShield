'use client';

import { useRef } from 'react';
import Map, { Layer, Source, NavigationControl } from 'react-map-gl';
import { Geofence, GeofenceType } from '@/types/geofence';
import { config } from '@/core/config';
import 'mapbox-gl/dist/mapbox-gl.css';

interface GeofenceMapProps {
  geofences: Geofence[];
  onAddGeofence: () => void;
  onEditGeofence: (id: string) => void;
}

export function GeofenceMap({ geofences, onAddGeofence, onEditGeofence }: GeofenceMapProps) {
  const mapRef = useRef(null);
  
  // Generate GeoJSON features for geofences
  const generateGeofenceFeatures = () => {
    return geofences.map(geofence => {
      if (geofence.shape.type === GeofenceType.CIRCLE) {
        return {
          type: 'Feature',
          id: geofence.id,
          properties: {
            id: geofence.id,
            name: geofence.name,
            type: geofence.shape.type,
            radius: geofence.shape.radius,
            priority: geofence.priority,
            active: geofence.active,
          },
          geometry: {
            type: 'Point',
            coordinates: [geofence.shape.center.longitude, geofence.shape.center.latitude],
          },
        };
      } else if (geofence.shape.type === GeofenceType.POLYGON) {
        return {
          type: 'Feature',
          id: geofence.id,
          properties: {
            id: geofence.id,
            name: geofence.name,
            type: geofence.shape.type,
            priority: geofence.priority,
            active: geofence.active,
          },
          geometry: {
            type: 'Polygon',
            coordinates: [
              geofence.shape.coordinates.map(coord => [coord.longitude, coord.latitude]),
            ],
          },
        };
      }
      return null;
    }).filter(Boolean);
  };
  
  // Define styles for circle geofences
  const circleLayer = {
    id: 'geofence-circles',
    type: 'circle',
    paint: {
      'circle-radius': ['get', 'radius'],
      'circle-color': [
        'case',
        ['==', ['get', 'priority'], 'CRITICAL'], 'rgba(239, 68, 68, 0.2)',
        ['==', ['get', 'priority'], 'HIGH'], 'rgba(249, 115, 22, 0.2)',
        ['==', ['get', 'priority'], 'MEDIUM'], 'rgba(59, 130, 246, 0.2)',
        'rgba(107, 114, 128, 0.2)'
      ],
      'circle-stroke-width': 2,
      'circle-stroke-color': [
        'case',
        ['==', ['get', 'priority'], 'CRITICAL'], 'rgba(239, 68, 68, 0.8)',
        ['==', ['get', 'priority'], 'HIGH'], 'rgba(249, 115, 22, 0.8)',
        ['==', ['get', 'priority'], 'MEDIUM'], 'rgba(59, 130, 246, 0.8)',
        'rgba(107, 114, 128, 0.8)'
      ],
      'circle-opacity': ['case', ['get', 'active'], 0.6, 0.2],
      'circle-stroke-opacity': ['case', ['get', 'active'], 1, 0.5],
    },
    filter: ['==', ['get', 'type'], 'CIRCLE'],
  };
  
  // Define styles for polygon geofences
  const polygonFillLayer = {
    id: 'geofence-polygon-fill',
    type: 'fill',
    paint: {
      'fill-color': [
        'case',
        ['==', ['get', 'priority'], 'CRITICAL'], 'rgba(239, 68, 68, 0.2)',
        ['==', ['get', 'priority'], 'HIGH'], 'rgba(249, 115, 22, 0.2)',
        ['==', ['get', 'priority'], 'MEDIUM'], 'rgba(59, 130, 246, 0.2)',
        'rgba(107, 114, 128, 0.2)'
      ],
      'fill-opacity': ['case', ['get', 'active'], 0.4, 0.1],
    },
    filter: ['==', ['get', 'type'], 'POLYGON'],
  };
  
  const polygonLineLayer = {
    id: 'geofence-polygon-line',
    type: 'line',
    paint: {
      'line-color': [
        'case',
        ['==', ['get', 'priority'], 'CRITICAL'], 'rgba(239, 68, 68, 0.8)',
        ['==', ['get', 'priority'], 'HIGH'], 'rgba(249, 115, 22, 0.8)',
        ['==', ['get', 'priority'], 'MEDIUM'], 'rgba(59, 130, 246, 0.8)',
        'rgba(107, 114, 128, 0.8)'
      ],
      'line-width': 2,
      'line-opacity': ['case', ['get', 'active'], 1, 0.5],
    },
    filter: ['==', ['get', 'type'], 'POLYGON'],
  };
  
  return (
    <Map
      ref={mapRef}
      mapboxAccessToken={config.mapbox.token}
      mapStyle="mapbox://styles/mapbox/dark-v11"
      initialViewState={{
        longitude: config.mapbox.defaultCenter[0],
        latitude: config.mapbox.defaultCenter[1],
        zoom: config.mapbox.defaultZoom,
      }}
      style={{ width: '100%', height: '100%' }}
      interactiveLayerIds={['geofence-circles', 'geofence-polygon-fill']}
      onClick={(e) => {
        if (e.features && e.features.length > 0) {
          const feature = e.features[0];
          if (feature.properties && feature.properties.id) {
            onEditGeofence(feature.properties.id);
          }
        }
      }}
    >
      <NavigationControl position="top-right" />
      
      {/* Render geofences */}
      <Source
        id="geofences"
        type="geojson"
        data={{
          type: 'FeatureCollection',
          features: generateGeofenceFeatures(),
        }}
      >
        <Layer {...circleLayer} />
        <Layer {...polygonFillLayer} />
        <Layer {...polygonLineLayer} />
      </Source>
    </Map>
  );
}