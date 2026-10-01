import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";
import { createServerFn } from "@tanstack/react-start";

// Configuration for trip monitoring
export const TRIP_MONITORING_CONFIG = {
  REMINDER_BEFORE_RETURN_MINUTES: 30,
  FIRST_OVERDUE_REMINDER_MINUTES: 15,
  SIGNIFICANT_OVERDUE_MINUTES: 60,
  ADMIN_ATTENTION_MINUTES: 120,
  LOCATION_FRESH_MINUTES: 10,
  LOCATION_STALE_MINUTES: 20,
};

export type TripMonitoringStatus = 
  | 'on_time' 
  | 'return_approaching' 
  | 'overdue' 
  | 'significantly_overdue' 
  | 'location_stale' 
  | 'offline' 
  | 'needs_attention';

export interface TripMonitoringResult {
  status: TripMonitoringStatus;
  delayMinutes: number;
  locationFreshness: 'fresh' | 'little_recent' | 'stale' | 'none';
  lastSeenMinutes: number | null;
  isOnline: boolean;
}

export function evaluateTripMonitoring(trip: any): TripMonitoringResult {
  const now = new Date();
  const expectedReturn = new Date(trip.expected_return_at);
  const startedAt = new Date(trip.started_at);
  
  const diffMs = now.getTime() - expectedReturn.getTime();
  const diffMinutes = Math.floor(diffMs / 60000);
  
  const lastLocationAt = trip.last_location_at ? new Date(trip.last_location_at) : null;
  const lastLocationDiffMs = lastLocationAt ? now.getTime() - lastLocationAt.getTime() : null;
  const lastLocationDiffMinutes = lastLocationDiffMs ? Math.floor(lastLocationDiffMs / 60000) : null;

  let status: TripMonitoringStatus = 'on_time';
  let locationFreshness: TripMonitoringResult['locationFreshness'] = 'none';

  // Evaluate location freshness
  if (lastLocationDiffMinutes !== null) {
    if (lastLocationDiffMinutes <= TRIP_MONITORING_CONFIG.LOCATION_FRESH_MINUTES) {
      locationFreshness = 'fresh';
    } else if (lastLocationDiffMinutes <= TRIP_MONITORING_CONFIG.LOCATION_STALE_MINUTES) {
      locationFreshness = 'little_recent';
    } else {
      locationFreshness = 'stale';
    }
  }

  // Evaluate status
  if (trip.status !== 'active') {
    return {
      status: 'on_time',
      delayMinutes: 0,
      locationFreshness,
      lastSeenMinutes: lastLocationDiffMinutes,
      isOnline: locationFreshness === 'fresh'
    };
  }

  if (diffMinutes >= TRIP_MONITORING_CONFIG.ADMIN_ATTENTION_MINUTES) {
    status = 'needs_attention';
  } else if (diffMinutes >= TRIP_MONITORING_CONFIG.SIGNIFICANT_OVERDUE_MINUTES) {
    status = 'significantly_overdue';
  } else if (diffMinutes > 0) {
    status = 'overdue';
  } else if (Math.abs(diffMinutes) <= TRIP_MONITORING_CONFIG.REMINDER_BEFORE_RETURN_MINUTES) {
    status = 'return_approaching';
  }

  return {
    status,
    delayMinutes: Math.max(0, diffMinutes),
    locationFreshness,
    lastSeenMinutes: lastLocationDiffMinutes,
    isOnline: locationFreshness === 'fresh'
  };
}

export const updateTripReturnTime = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])

  .validator((data: unknown) => z.object({
    tripId: z.string().uuid(),
    newReturnTime: z.string(),
    reason: z.string().optional(),
  }).parse(data))
  .handler(async ({ data, context }) => {
    const supabase = context.supabase;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Unauthorized");

    const { data: trip, error: tripError } = await supabase
      .from('fishing_trips')
      .select('expected_return_at')
      .eq('id', data.tripId)
      .single();

    if (tripError) throw tripError;

    const oldReturnTime = trip.expected_return_at;

    const { error: updateError } = await supabase
      .from('fishing_trips')
      .update({ expected_return_at: data.newReturnTime })
      .eq('id', data.tripId);

    if (updateError) throw updateError;

    // Log the event
    await (supabase as any).from('trip_timeline_events').insert({
      trip_id: data.tripId,
      event_type: 'expected_return_changed',
      actor_id: user.id,
      metadata: {
        old_return_time: oldReturnTime,
        new_return_time: data.newReturnTime,
        reason: data.reason
      }
    });

    return { success: true };
  });

export const confirmFisherAtSea = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])

  .validator((data: unknown) => z.object({
    tripId: z.string().uuid(),
  }).parse(data))
  .handler(async ({ data, context }) => {
    const supabase = context.supabase;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Unauthorized");

    await (supabase as any).from('trip_timeline_events').insert({
      trip_id: data.tripId,
      event_type: 'fisher_confirmed_at_sea',
      actor_id: user.id,
    });

    return { success: true };
  });

export const getTripTimeline = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])

  .validator((data: unknown) => z.object({
    tripId: z.string().uuid(),
  }).parse(data))
  .handler(async ({ data, context }) => {
    const supabase = context.supabase;
    const { data: events, error } = await (supabase as any)
      .from('trip_timeline_events')
      .select('*')
      .eq('trip_id', data.tripId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return events;
  });

export const logAdminContactAttempt = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])

  .validator((data: unknown) => z.object({
    tripId: z.string().uuid(),
    notes: z.string(),
  }).parse(data))
  .handler(async ({ data, context }) => {
    const supabase = context.supabase;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Unauthorized");

    await (supabase as any).from('trip_timeline_events').insert({
      trip_id: data.tripId,
      event_type: 'contact_attempt',
      actor_id: user.id,
      metadata: { notes: data.notes }
    });

    return { success: true };
  });

