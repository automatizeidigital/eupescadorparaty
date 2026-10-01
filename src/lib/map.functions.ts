import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { FishingTrip } from "./map.types";
import { z } from "zod";

export const getActiveTrip = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])

  .handler(async ({ context }) => {
    const supabase = context.supabase;
    const session = { user: { id: context.userId } };
    if (!session) return null;

    const { data, error } = await supabase
      .from('fishing_trips')
      .select('*')
      .eq('user_id', session.user.id)
      .eq('status', 'active')
      .maybeSingle();

    if (error) throw error;
    return data as FishingTrip | null;
  });

export const startTrip = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])

  .validator((data: any) => z.object({
    boat_id: z.string().uuid(),
    destination_description: z.string().optional(),
    crew_count: z.number().int().min(1),
    expected_return_at: z.string().optional(),
    location_sharing_enabled: z.boolean().default(false)
  }).parse(data))
  .handler(async ({ data, context }) => {
    const supabase = context.supabase;
    const session = { user: { id: context.userId } };
    if (!session) throw new Error("Unauthorized");

    const { data: trip, error } = await supabase
      .from('fishing_trips')
      .insert({
        user_id: session.user.id,
        boat_id: data.boat_id,
        destination_description: data.destination_description ?? null,
        crew_count: data.crew_count,
        expected_return_at: data.expected_return_at ?? null,
        location_sharing_enabled: data.location_sharing_enabled,
        status: 'active'
      })
      .select()
      .single();

    if (error) throw error;
    return trip as FishingTrip;
  });

export const endTrip = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])

  .validator((data: any) => z.object({
    trip_id: z.string().uuid()
  }).parse(data))
  .handler(async ({ data, context }) => {
    const supabase = context.supabase;
    const { data: trip, error } = await supabase
      .from('fishing_trips')
      .update({
        status: 'completed',
        ended_at: new Date().toISOString()
      })
      .eq('id', data.trip_id)
      .select()
      .single();

    if (error) throw error;
    return trip as FishingTrip;
  });

export const logLocation = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])

  .validator((data: any) => z.object({
    trip_id: z.string().uuid(),
    latitude: z.number(),
    longitude: z.number(),
    accuracy: z.number().optional(),
    speed: z.number().optional(),
    heading: z.number().optional()
  }).parse(data))
  .handler(async ({ data, context }) => {
    const supabase = context.supabase;
    // A implementação real do log deve suportar idempotência se necessário,
    // mas trip_locations geralmente aceita duplicatas de tempo diferente.
    const session = { user: { id: context.userId } };
    if (!session) throw new Error("Unauthorized");

    const { error } = await supabase
      .from('trip_locations')
      .insert({
        user_id: session.user.id,
        trip_id: data.trip_id,
        latitude: data.latitude,
        longitude: data.longitude,
        accuracy: data.accuracy ?? null,
        speed: data.speed ?? null,
        heading: data.heading ?? null,
        recorded_at: new Date().toISOString()
      });
    
    // Sucesso ou log silencioso em caso de erro (offline sync lidará com isso no futuro)

    if (error) throw error;
    return { success: true };
  });

