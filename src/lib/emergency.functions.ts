import { createServerFn } from "@tanstack/react-start";

import { EmergencyIncident } from "./emergency.types";
import { z } from "zod";

export const emergencyInputSchema = z.object({
    trip_id: z.string().uuid().optional().nullable(),
    boat_id: z.string().uuid().optional().nullable(),
    incident_type: z.string().optional().nullable(),
    message: z.string().optional().nullable(),
    latitude: z.number().optional().nullable(),
    longitude: z.number().optional().nullable(),
    accuracy: z.number().optional().nullable(),
    location_recorded_at: z.string().optional().nullable(),
    location_source: z.string().optional().nullable(),
    client_request_id: z.string().optional().nullable(),
    contact_phone: z.string().optional().nullable(),
    emergency_contact_name: z.string().optional().nullable(),
    emergency_contact_phone: z.string().optional().nullable()
  });
export type EmergencyInput = z.infer<typeof emergencyInputSchema>;

export const createEmergencyIncident = createServerFn({ method: "POST" })

  .validator((data: unknown) => emergencyInputSchema.parse(data))
  .handler(async (): Promise<any> => { throw new Error("Serviço temporariamente indisponível. A nova base está sendo preparada."); });

export const getMyIncidents = createServerFn({ method: "GET" })

  .handler(async (): Promise<any> => { throw new Error("Serviço temporariamente indisponível. A nova base está sendo preparada."); });

export const updateIncidentStatus = createServerFn({ method: "POST" })

  .validator((data: unknown) => z.object({
    id: z.string().uuid(),
    status: z.string(),
    resolved_at: z.string().optional().nullable()
  }).parse(data))
  .handler(async (): Promise<any> => { throw new Error("Serviço temporariamente indisponível. A nova base está sendo preparada."); });


