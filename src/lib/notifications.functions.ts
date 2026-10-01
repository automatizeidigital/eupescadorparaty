import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

type NotificationPreferences = {
  secretaria_enabled: boolean;
  prefeitura_enabled: boolean;
  weather_enabled: boolean;
  marine_enabled: boolean;
  trip_enabled: boolean;
  sos_enabled: boolean;
  events_enabled: boolean;
  quiet_hours_enabled: boolean;
  quiet_hours_start: string | null;
  quiet_hours_end: string | null;
};

export const getNotificationPreferences = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])

  .handler(async ({ context }): Promise<NotificationPreferences> => {
    const supabase = context.supabase;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Unauthorized");

    const { data, error } = await supabase
      .from('notification_preferences')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    
    return data ? {
      secretaria_enabled: data.secretaria_enabled ?? true,
      prefeitura_enabled: data.prefeitura_enabled ?? true,
      weather_enabled: data.weather_enabled ?? true,
      marine_enabled: data.marine_enabled ?? true,
      trip_enabled: data.trip_enabled ?? true,
      sos_enabled: data.sos_enabled ?? true,
      events_enabled: data.events_enabled ?? true,
      quiet_hours_enabled: data.quiet_hours_enabled ?? false,
      quiet_hours_start: data.quiet_hours_start ?? null,
      quiet_hours_end: data.quiet_hours_end ?? null,
    } : {
      secretaria_enabled: true,
      prefeitura_enabled: true,
      weather_enabled: true,
      marine_enabled: true,
      trip_enabled: true,
      sos_enabled: true,
      events_enabled: true,
      quiet_hours_enabled: false,
      quiet_hours_start: null,
      quiet_hours_end: null,
    };
  });

export const updateNotificationPreferences = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])

  .validator((data: unknown) => z.object({
    secretaria_enabled: z.boolean().optional(),
    prefeitura_enabled: z.boolean().optional(),
    weather_enabled: z.boolean().optional(),
    marine_enabled: z.boolean().optional(),
    trip_enabled: z.boolean().optional(),
    sos_enabled: z.boolean().optional(),
    events_enabled: z.boolean().optional(),
    quiet_hours_enabled: z.boolean().optional(),
    quiet_hours_start: z.string().nullable().optional(),
    quiet_hours_end: z.string().nullable().optional(),
  }).parse(data))
  .handler(async ({ data, context }) => {
    const supabase = context.supabase;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Unauthorized");

    // Clean data for Supabase (handle null vs undefined)
    const updateData: any = {
      user_id: user.id,
      updated_at: new Date().toISOString(),
    };
    
    if (data.secretaria_enabled !== undefined) updateData.secretaria_enabled = data.secretaria_enabled;
    if (data.prefeitura_enabled !== undefined) updateData.prefeitura_enabled = data.prefeitura_enabled;
    if (data.weather_enabled !== undefined) updateData.weather_enabled = data.weather_enabled;
    if (data.marine_enabled !== undefined) updateData.marine_enabled = data.marine_enabled;
    if (data.trip_enabled !== undefined) updateData.trip_enabled = data.trip_enabled;
    if (data.sos_enabled !== undefined) updateData.sos_enabled = data.sos_enabled;
    if (data.events_enabled !== undefined) updateData.events_enabled = data.events_enabled;
    if (data.quiet_hours_enabled !== undefined) updateData.quiet_hours_enabled = data.quiet_hours_enabled;
    if (data.quiet_hours_start !== undefined) updateData.quiet_hours_start = data.quiet_hours_start;
    if (data.quiet_hours_end !== undefined) updateData.quiet_hours_end = data.quiet_hours_end;

    const { error } = await supabase
      .from('notification_preferences')
      .upsert(updateData);

    if (error) throw error;
    return { success: true };
  });

export const registerPushToken = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])

  .validator((data: unknown) => z.object({
    token: z.string(),
    provider: z.string(),
    platform: z.string().optional(),
    deviceName: z.string().optional(),
  }).parse(data))
  .handler(async ({ data, context }) => {
    const supabase = context.supabase;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Unauthorized");

    const { error } = await supabase
      .from('push_subscriptions')
      .upsert({
        user_id: user.id,
        device_token: data.token,
        provider: data.provider,
        platform: data.platform ?? null,
        device_name: data.deviceName ?? null,
        active: true,
        last_seen_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'user_id,device_token'
      });

    if (error) throw error;
    return { success: true };
  });

export const getNotificationHistory = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])

  .validator((data: unknown) => z.object({
    limit: z.number().default(20),
  }).parse(data))
  .handler(async ({ data, context }) => {
    const supabase = context.supabase;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Unauthorized");

    const { data: notifications, error } = await supabase
      .from('notifications')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(data.limit);

    if (error) throw error;
    return notifications;
  });

