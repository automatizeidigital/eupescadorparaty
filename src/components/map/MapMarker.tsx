import React, { useEffect, useState } from 'react';
import { useMapInstance } from './GoogleMapsProvider';
import { MapPosition } from '@/lib/map.types';

interface MapMarkerProps {
  position: MapPosition;
  title?: string;
  icon?: string;
}

export const MapMarker: React.FC<MapMarkerProps> = ({ position, title, icon }) => {
  const map = useMapInstance();
  const markerRef = React.useRef<any>(null);

  useEffect(() => {
    if (map && window.google && window.google.maps) {
      if (markerRef.current) {
        markerRef.current.setMap(null);
      }

      markerRef.current = new window.google.maps.Marker({
        position,
        map,
        title,
        icon: icon ? {
          url: icon,
          scaledSize: new window.google.maps.Size(32, 32)
        } : undefined
      });
    }

    return () => {
      if (markerRef.current) {
        markerRef.current.setMap(null);
      }
    };
  }, [map, position, title, icon]);

  return null;
};
