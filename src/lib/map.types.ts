import { z } from "zod";

export const fishingTripSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  boat_id: z.string().uuid(),
  destination_description: z.string().nullable(),
  crew_count: z.number().int().min(1),
  expected_return_at: z.string().nullable(),
  started_at: z.string(),
  ended_at: z.string().nullable(),
  status: z.enum(["active", "completed", "cancelled"]),
  location_sharing_enabled: z.boolean(),
  last_location_at: z.string().nullable(),
  created_at: z.string(),
  updated_at: z.string(),
});

export type FishingTrip = z.infer<typeof fishingTripSchema>;

export const tripLocationSchema = z.object({
  id: z.string().uuid(),
  trip_id: z.string().uuid(),
  user_id: z.string().uuid(),
  latitude: z.number(),
  longitude: z.number(),
  accuracy: z.number().nullable(),
  speed: z.number().nullable(),
  heading: z.number().nullable(),
  recorded_at: z.string(),
  received_at: z.string(),
});

export type TripLocation = z.infer<typeof tripLocationSchema>;

export interface MapPosition {
  lat: number;
  lng: number;
}

export interface MapProviderProps {
  center: MapPosition;
  zoom: number;
  children?: React.ReactNode;
  onMapClick?: (pos: MapPosition) => void;
  className?: string;
  /** Chave do cache offline (ex.: 'fisher-trip', 'admin-fleet'). */
  offlineScope?: string;
  /** Pontos operacionais a persistir para leitura offline. */
  offlinePoints?: import('./map-offline-cache').OfflineMapPoint[];
}
