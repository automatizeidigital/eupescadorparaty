import { z } from "zod";

export const incidentTypeEnum = z.enum([
  "boat_problem",
  "drift",
  "out_of_fuel",
  "injury",
  "health_emergency",
  "fire",
  "grounded",
  "no_comm",
  "other"
]);

export type IncidentType = z.infer<typeof incidentTypeEnum>;

export const emergencyStatusEnum = z.enum([
  "open",
  "acknowledged",
  "in_progress",
  "resolved",
  "cancelled"
]);

export type EmergencyStatus = z.infer<typeof emergencyStatusEnum>;

export const locationSourceEnum = z.enum(["current", "trip_last_known", "none"]);

export type LocationSource = z.infer<typeof locationSourceEnum>;

export const emergencyIncidentSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  trip_id: z.string().uuid().nullable(),
  boat_id: z.string().uuid().nullable(),
  incident_type: incidentTypeEnum.nullable(),
  message: z.string().nullable(),
  status: emergencyStatusEnum,
  priority: z.enum(["normal", "high", "critical"]),
  latitude: z.number().nullable(),
  longitude: z.number().nullable(),
  accuracy: z.number().nullable(),
  location_recorded_at: z.string().nullable(),
  location_source: locationSourceEnum.nullable(),
  contact_phone: z.string().nullable(),
  emergency_contact_name: z.string().nullable(),
  emergency_contact_phone: z.string().nullable(),
  client_request_id: z.string().nullable(),
  sos_number: z.string().nullable(),
  created_at: z.string(),
  updated_at: z.string(),
  acknowledged_at: z.string().nullable(),
  resolved_at: z.string().nullable(),
});

export type EmergencyIncident = z.infer<typeof emergencyIncidentSchema>;

export const incidentTypeLabels: Record<IncidentType, string> = {
  boat_problem: "Problema na embarcação",
  drift: "Deriva / sem controle",
  out_of_fuel: "Sem combustível",
  injury: "Pessoa ferida",
  health_emergency: "Emergência de saúde",
  fire: "Incêndio",
  grounded: "Encalhado",
  no_comm: "Sem comunicação",
  other: "Outro"
};
