import { createServerFn } from "@tanstack/react-start";

import { FishingTrip } from "./map.types";
import { z } from "zod";

export const getActiveTrip = createServerFn({ method: "GET" })

  .handler(async (): Promise<any> => { throw new Error("Serviço temporariamente indisponível. A nova base está sendo preparada."); });

export const startTrip = createServerFn({ method: "POST" })

  .validator((data: any) => z.object({
    boat_id: z.string().uuid(),
    destination_description: z.string().optional(),
    crew_count: z.number().int().min(1),
    expected_return_at: z.string().optional(),
    location_sharing_enabled: z.boolean().default(false)
  }).parse(data))
  .handler(async (): Promise<any> => { throw new Error("Serviço temporariamente indisponível. A nova base está sendo preparada."); });

export const endTrip = createServerFn({ method: "POST" })

  .validator((data: any) => z.object({
    trip_id: z.string().uuid()
  }).parse(data))
  .handler(async (): Promise<any> => { throw new Error("Serviço temporariamente indisponível. A nova base está sendo preparada."); });

export const logLocation = createServerFn({ method: "POST" })

  .validator((data: any) => z.object({
    trip_id: z.string().uuid(),
    latitude: z.number(),
    longitude: z.number(),
    accuracy: z.number().optional(),
    speed: z.number().optional(),
    heading: z.number().optional()
  }).parse(data))
  .handler(async (): Promise<any> => { throw new Error("Serviço temporariamente indisponível. A nova base está sendo preparada."); });

