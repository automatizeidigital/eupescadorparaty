import { requireAdminAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";
import { createServerFn } from "@tanstack/react-start";

export const getAdminStats = createServerFn({ method: "GET" })
  .middleware([requireAdminAuth])

  .handler(async ({ context }) => {
    const supabase = context.supabase;
    const [
      { count: profilesCount },
      { count: activeProfilesCount },
      { count: pendingProfilesCount },
      { count: boatsCount },
      { count: activeTripsCount },
      { count: openSosCount },
      { count: expiringDocsCount },
      { count: pendingSolicitationsCount },
      { count: activeNoticesCount },
    ] = await Promise.all([
      supabase.from('profiles').select('*', { count: 'exact', head: true }),
      supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('registration_completed', true),
      supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('registration_completed', false),
      supabase.from('boats').select('*', { count: 'exact', head: true }),
      supabase.from('fishing_trips').select('*', { count: 'exact', head: true }).eq('status', 'active'),
      supabase.from('emergency_incidents').select('*', { count: 'exact', head: true }).eq('status', 'open'),
      supabase.from('user_documents').select('*', { count: 'exact', head: true }).eq('status', 'expiring'),
      supabase.from('external_content_queue').select('*', { count: 'exact', head: true }).eq('review_status', 'pending'),
      supabase.from('notices').select('*', { count: 'exact', head: true }).eq('status', 'published'),
    ]);

    return {
      totalPescadores: profilesCount || 0,
      pescadoresAtivos: activeProfilesCount || 0,
      cadastrosPendentes: pendingProfilesCount || 0,
      totalEmbarcacoes: boatsCount || 0,
      saidasAtivas: activeTripsCount || 0,
      sosAbertos: openSosCount || 0,
      documentosVencendo: expiringDocsCount || 0,
      solicitacoesPendentes: pendingSolicitationsCount || 0,
      avisosAtivos: activeNoticesCount || 0,
      notificacoesHoje: 0,
    };
  });

export const getAdminPescadores = createServerFn({ method: "GET" })
  .middleware([requireAdminAuth])

  .validator((data: unknown) => z.object({
    search: z.string().optional(),
    community: z.string().optional(),
    status: z.string().optional(),
    limit: z.number().optional().default(50),
    offset: z.number().optional().default(0),
  }).parse(data))
  .handler(async ({ data, context }) => {
    const supabase = context.supabase;
    let query = supabase
      .from('profiles')
      .select(`
        *,
        boats(name, registration_number)
      `)
      .order('full_name', { ascending: true })
      .range(data.offset, data.offset + data.limit - 1);

    if (data.search) {
      query = query.or(`full_name.ilike.%${data.search}%,municipal_registration.ilike.%${data.search}%,cpf.ilike.%${data.search}%`);
    }

    if (data.community) {
      query = query.eq('community', data.community);
    }

    if (data.status) {
      query = query.eq('registration_completed', data.status === 'active');
    }

    const { data: profiles, error } = await query;
    if (error) throw error;
    return profiles;
  });

export const getAdminPescadorById = createServerFn({ method: "GET" })
  .middleware([requireAdminAuth])

  .validator((data: unknown) => z.object({
    id: z.string().uuid(),
  }).parse(data))
  .handler(async ({ data, context }) => {
    const supabase = context.supabase;
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.id)
      .single();

    if (profileError) throw profileError;

    const [
      { data: boats },
      { data: documents },
      { data: trips },
      { data: incidents }
    ] = await Promise.all([
      supabase.from('boats').select('*').eq('owner_id', data.id),
      supabase.from('user_documents').select('*').eq('user_id', data.id),
      supabase.from('fishing_trips').select('*').eq('user_id', data.id).order('started_at', { ascending: false }),
      supabase.from('emergency_incidents').select('*').eq('user_id', data.id).order('created_at', { ascending: false })
    ]);

    return {
      ...profile,
      boats: boats || [],
      user_documents: documents || [],
      fishing_trips: trips || [],
      emergency_incidents: incidents || []
    };
  });

export const getAdminBoats = createServerFn({ method: "GET" })
  .middleware([requireAdminAuth])

  .validator((data: unknown) => z.object({
    status: z.string().optional(),
    type: z.string().optional(),
    community: z.string().optional(),
  }).parse(data))
  .handler(async ({ data, context }) => {
    const supabase = context.supabase;
    let query = supabase
      .from('boats')
      .select(`
        *,
        owner:profiles!owner_id(full_name, community)
      `)
      .order('name', { ascending: true });

    if (data.status) query = query.eq('status', data.status);
    if (data.type) query = query.eq('boat_type', data.type);

    const { data: boats, error } = await query;
    if (error) throw error;
    return boats;
  });

export const getAdminBoatById = createServerFn({ method: "GET" })
  .middleware([requireAdminAuth])

  .validator((data: unknown) => z.object({
    id: z.string().uuid(),
  }).parse(data))
  .handler(async ({ data, context }) => {
    const supabase = context.supabase;
    const { data: boat, error: boatError } = await supabase
      .from('boats')
      .select('*')
      .eq('id', data.id)
      .single();

    if (boatError) throw boatError;

    const [
      { data: owner },
      { data: trips },
      { data: documents }
    ] = await Promise.all([
      supabase.from('profiles').select('*').eq('id', boat.owner_id).single(),
      supabase.from('fishing_trips').select('*').eq('boat_id', data.id).order('started_at', { ascending: false }),
      supabase.from('user_documents').select('*').eq('boat_id', data.id)
    ]);

    return {
      ...boat,
      profiles: owner || null,
      fishing_trips: trips || [],
      user_documents: documents || []
    };
  });

export const getAdminIncidents = createServerFn({ method: "GET" })
  .middleware([requireAdminAuth])

  .handler(async ({ context }) => {
    const supabase = context.supabase;
    const { data, error } = await supabase
      .from('emergency_incidents')
      .select(`
        *,
        profiles:user_id(full_name, phone, community),
        boats(name, registration_number)
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  });

export const getAdminTrips = createServerFn({ method: "GET" })
  .middleware([requireAdminAuth])

  .validator((data: unknown) => z.object({
    status: z.enum(['active', 'overdue', 'completed', 'cancelled']).optional()
  }).parse(data))
  .handler(async ({ data, context }) => {
    const supabase = context.supabase;
    const now = new Date().toISOString();
    let query = supabase
      .from('fishing_trips')
      .select(`
        *,
        profiles:user_id(full_name, phone, community),
        boats(name, registration_number),
        emergency_incidents(status)
      `);

    if (data.status === 'active') {
      query = query.eq('status', 'active').gte('expected_return_at', now);
    } else if (data.status === 'overdue') {
      query = query.eq('status', 'active').lt('expected_return_at', now);
    } else if (data.status) {
      query = query.eq('status', data.status);
    }

    const { data: trips, error } = await query;
    if (error) throw error;
    return trips;
  });

export const getAdminTripById = createServerFn({ method: "GET" })
  .middleware([requireAdminAuth])

  .validator((data: unknown) => z.object({
    id: z.string().uuid(),
  }).parse(data))
  .handler(async ({ data, context }) => {
    const supabase = context.supabase;
    const { data: trip, error: tripError } = await supabase
      .from('fishing_trips')
      .select(`
        *,
        emergency_incidents(*)
      `)
      .eq('id', data.id)
      .single();

    if (tripError) throw tripError;

    const [
      { data: profile },
      { data: boat },
      { data: locations }
    ] = await Promise.all([
      supabase.from('profiles').select('*').eq('id', trip.user_id).single(),
      supabase.from('boats').select('*').eq('id', trip.boat_id).single(),
      supabase.from('trip_locations').select('*').eq('trip_id', data.id).order('recorded_at', { ascending: false })
    ]);

    return {
      ...trip,
      profiles: profile || null,
      boats: boat || null,
      trip_locations: locations || []
    };
  });

export const logAdminAction = createServerFn({ method: "POST" })
  .middleware([requireAdminAuth])

  .validator((data: unknown) => z.object({
    action: z.string(),
    target_id: z.string().uuid(),
    target_type: z.string(),
    details: z.record(z.any()).optional(),
  }).parse(data))
  .handler(async ({ data, context }) => {
    const supabase = context.supabase;
    const user = { id: context.userId };
    if (!user) throw new Error("Unauthorized");

    const { error } = await supabase.rpc('log_admin_action', {
      _action: data.action, _module: data.target_type,
      _entity_type: data.target_type, _entity_id: data.target_id,
      _metadata: data.details ?? {}
    });
    if (error) throw error;
    return { success: true };
  });

export const updateProfileStatus = createServerFn({ method: "POST" })
  .middleware([requireAdminAuth])

  .validator((data: unknown) => z.object({
    id: z.string().uuid(),
    registration_completed: z.boolean(),
  }).parse(data))
  .handler(async ({ data, context }) => {
    const supabase = context.supabase;
    const { error } = await supabase
      .from('profiles')
      .update({ registration_completed: data.registration_completed })
      .eq('id', data.id);
    
    if (error) throw error;
    return { success: true };
  });

export const regenerateMunicipalRegistration = createServerFn({ method: "POST" })
  .middleware([requireAdminAuth])

  .validator((data: unknown) => z.object({
    id: z.string().uuid(),
  }).parse(data))
  .handler(async ({ data, context }) => {
    const supabase = context.supabase;
    throw new Error('A geração de matrícula ainda não está disponível.');
  });


/**
 * Últimas posições conhecidas das saídas ativas.
 * Usada no mapa operacional e persistida localmente para leitura offline.
 */
export const getFleetPositions = createServerFn({ method: "GET" })
  .middleware([requireAdminAuth])

  .handler(async ({ context }) => {
    const supabase = context.supabase;
    const { data: trips, error: tripsError } = await supabase
      .from('fishing_trips')
      .select('id, user_id, profiles:user_id(full_name), boats(name)')
      .eq('status', 'active');

    if (tripsError) throw tripsError;
    if (!trips || trips.length === 0) return [];

    const tripIds = trips.map((t) => t.id);
    const { data: locations, error: locError } = await supabase
      .from('trip_locations')
      .select('trip_id, latitude, longitude, recorded_at')
      .in('trip_id', tripIds)
      .order('recorded_at', { ascending: false });

    if (locError) throw locError;

    const latestByTrip = new Map<string, { latitude: number; longitude: number; recorded_at: string }>();
    for (const loc of locations ?? []) {
      if (!latestByTrip.has(loc.trip_id)) {
        latestByTrip.set(loc.trip_id, {
          latitude: loc.latitude,
          longitude: loc.longitude,
          recorded_at: loc.recorded_at,
        });
      }
    }

    return trips.flatMap((t) => {
      const loc = latestByTrip.get(t.id);
      if (!loc) return [];
      return [{
        trip_id: t.id,
        label: (t.profiles as any)?.full_name ?? (t.boats as any)?.name ?? 'Embarcação',
        latitude: loc.latitude,
        longitude: loc.longitude,
        recorded_at: loc.recorded_at,
      }];
    });
  });

