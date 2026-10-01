import React, { createContext, useContext, ReactNode } from 'react';
import { MapPosition } from '@/lib/map.types';

interface MapContextType {
  provider: 'google' | 'leaflet';
  apiKey?: string | undefined;
}

const MapContext = createContext<MapContextType | undefined>(undefined);

export const MapProvider = ({ 
  children, 
  provider = 'google',
  apiKey 
}: { 
  children: ReactNode; 
  provider?: 'google' | 'leaflet';
  apiKey?: string;
}) => {
  return (
    <MapContext.Provider value={{ provider, apiKey }}>
      {children}
    </MapContext.Provider>
  );
};

export const useMap = () => {
  const context = useContext(MapContext);
  if (!context) {
    throw new Error('useMap must be used within a MapProvider');
  }
  return context;
};
