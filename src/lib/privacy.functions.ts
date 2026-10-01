import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export const getConsents = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])

  .handler(async ({ context }) => {
    const supabase = context.supabase;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Unauthorized");

    const { data, error } = await supabase
      .from("user_consents")
      .select("*")
      .eq("user_id", user.id);

    if (error) throw error;
    return data;
  });

export const updateConsent = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])

  .validator((data) => z.object({
    consent_type: z.enum(['location', 'trip_location', 'notifications', 'privacy_policy', 'terms']),
    granted: z.boolean(),
    version: z.string().optional()
  }).parse(data))
  .handler(async ({ data, context }) => {
    const supabase = context.supabase;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Unauthorized");

    const { error } = await supabase
      .from("user_consents")
      .upsert({
        user_id: user.id,
        consent_type: data.consent_type,
        granted: data.granted,
        version: data.version || "1.0",
        granted_at: data.granted ? new Date().toISOString() : null,
        revoked_at: !data.granted ? new Date().toISOString() : null,
      }, {
        onConflict: 'user_id,consent_type,version'
      });

    if (error) throw error;
    return { success: true };
  });

