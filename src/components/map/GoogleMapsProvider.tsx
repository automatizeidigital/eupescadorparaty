import React, { useEffect, useRef, useState } from 'react';
import { MapProviderProps, MapPosition } from '@/lib/map.types';
import { useMap } from './MapProvider';
import { Loader2 } from 'lucide-react';
import { OfflineMapFallback } from './OfflineMapFallback';
import { readMapSnapshot, saveMapSnapshot, type OfflineMapSnapshot } from '@/lib/map-offline-cache';

declare global {
  interface Window {
    google: any;
    initMap: () => void;
  }
}

export const GoogleMapsProvider: React.FC<MapProviderProps> = ({
  center,
  zoom,
  children,
  onMapClick,
  className,
  offlineScope = 'default',
  offlinePoints
}) => {
  const { apiKey } = useMap();
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isOffline, setIsOffline] = useState(false);
  const [snapshot, setSnapshot] = useState<OfflineMapSnapshot | null>(null);

  // Estado de rede: a Maps JS API não opera sem conexão e seus tiles não podem
  // ser cacheados (Termos de Serviço), então usamos a carta esquemática local.
  useEffect(() => {
    const sync = () => setIsOffline(!navigator.onLine);
    sync();
    window.addEventListener('online', sync);
    window.addEventListener('offline', sync);
    return () => {
      window.removeEventListener('online', sync);
      window.removeEventListener('offline', sync);
    };
  }, []);

  // Persiste as posições operacionais sempre que houver dados frescos.
  useEffect(() => {
    if (!offlinePoints || isOffline) return;
    saveMapSnapshot(offlineScope, { center, zoom, points: offlinePoints });
  }, [offlinePoints, offlineScope, center, zoom, isOffline]);

  // Carrega o snapshot ao entrar em modo offline (ou quando o script falha).
  useEffect(() => {
    if (isOffline || error) {
      setSnapshot(readMapSnapshot(offlineScope));
    }
  }, [isOffline, error, offlineScope]);

  useEffect(() => {
    if (isOffline) {
      setLoading(false);
      return;
    }
    if (!apiKey) {
      setError('Google Maps API Key não configurada.');
      setLoading(false);
      return;
    }

    const loadScript = () => {
      if (window.google && window.google.maps) {
        initMap();
        return;
      }

      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=geometry`;
      script.async = true;
      script.defer = true;
      script.onload = initMap;
      script.onerror = () => setError('Erro ao carregar o script do Google Maps.');
      document.head.appendChild(script);
    };

    const initMap = () => {
      if (mapRef.current && window.google && window.google.maps) {
        const newMap = new window.google.maps.Map(mapRef.current, {
          center,
          zoom,
          disableDefaultUI: true,
          zoomControl: true,
          styles: [
            {
              featureType: 'water',
              elementType: 'geometry',
              stylers: [{ color: '#e9e9e9' }, { lightness: 17 }]
            },
            {
              featureType: 'landscape',
              elementType: 'geometry',
              stylers: [{ color: '#f5f5f5' }, { lightness: 20 }]
            },
            // Estilos simplificados para o mar
          ]
        });

        if (onMapClick) {
          newMap.addListener('click', (e: any) => {
            onMapClick({ lat: e.latLng.lat(), lng: e.latLng.lng() });
          });
        }

        setMap(newMap);
        setLoading(false);
      }
    };

    loadScript();
  }, [apiKey, isOffline]);

  useEffect(() => {
    if (map) {
      map.setCenter(center);
    }
  }, [center, map]);

  useEffect(() => {
    if (map) {
      map.setZoom(zoom);
    }
  }, [zoom, map]);

  const showOffline = isOffline || (!!error && !map);

  return (
    <div className={`relative w-full h-full ${className}`}>
      {showOffline && <OfflineMapFallback snapshot={snapshot} />}
      {loading && !showOffline && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/50 z-10">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      )}
      {error && !showOffline && (
        <div className="absolute inset-0 flex items-center justify-center bg-destructive/10 text-destructive z-10 p-4 text-center">
          {error}
        </div>
      )}
      <div ref={mapRef} className="w-full h-full" />
      {map && children && (
        <MapInstanceContext.Provider value={map}>
          {children}
        </MapInstanceContext.Provider>
      )}
    </div>
  );
};

const MapInstanceContext = React.createContext<any>(null);
export const useMapInstance = () => React.useContext(MapInstanceContext);
