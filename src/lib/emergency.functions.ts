import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
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
  .middleware([requireSupabaseAuth])

  .validator((data: unknown) => emergencyInputSchema.parse(data))
  .handler(async ({ data, context }) => {
    const supabase = context.supabase;
    const session = { user: { id: context.userId } };
    if (!session) throw new Error("Unauthorized");

    const { data: incident, error } = await supabase
      .from('emergency_incidents')
      .insert({
        user_id: session.user.id,
        trip_id: data.trip_id ?? null,
        boat_id: data.boat_id ?? null,
        incident_type: data.incident_type ?? null,
        message: data.message ?? null,
        latitude: data.latitude ?? null,
        longitude: data.longitude ?? null,
        accuracy: data.accuracy ?? null,
        location_recorded_at: data.location_recorded_at ?? null,
        location_source: data.location_source ?? null,
        client_request_id: data.client_request_id ?? null,
        contact_phone: data.contact_phone ?? null,
        emergency_contact_name: data.emergency_contact_name ?? null,
        emergency_contact_phone: data.emergency_contact_phone ?? null,
        status: 'open',
        priority: 'high'
      })
      .select()
      .single();

    if (error) {
      if (error.code === '23505' && data.client_request_id) {
        const { data: existing } = await supabase
          .from('emergency_incidents')
          .select('*')
          .eq('client_request_id', data.client_request_id)
          .single();
        if (existing) return existing as EmergencyIncident;
      }
      throw error;
    }
    
    return incident as EmergencyIncident;
  });

export const getMyIncidents = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])

  .handler(async ({ context }) => {
    const supabase = context.supabase;
    const session = { user: { id: context.userId } };
    if (!session) throw new Error("Unauthorized");

    const { data, error } = await supabase
      .from('emergency_incidents')
      .select('*')
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as EmergencyIncident[];
  });

export const updateIncidentStatus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])

  .validator((data: unknown) => z.object({
    id: z.string().uuid(),
    status: z.string(),
    resolved_at: z.string().optional().nullable()
  }).parse(data))
  .handler(async ({ data, context }) => {
    const supabase = context.supabase;
    const { data: incident, error } = await supabase
      .from('emergency_incidents')
      .update({
        status: data.status,
        updated_at: new Date().toISOString(),
        acknowledged_at: data.status === 'acknowledged' ? new Date().toISOString() : null,
        resolved_at: data.status === 'resolved' ? (data.resolved_at || new Date().toISOString()) : null
      })
      .eq('id', data.id)
      .select()
      .single();

    if (error) throw error;
    return incident as EmergencyIncident;
  });


