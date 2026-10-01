import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";
import { createServerFn } from "@tanstack/react-start";

export const getProfile = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])

  .handler(async ({ context }) => {
    const supabase = context.supabase;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null; // Safe to return null for profile if not logged in

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error) throw error;
    return data;
  });

export const updateProfile = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])

  .validator((data: unknown) => z.object({
    full_name: z.string().optional().nullable(),
    phone: z.string().optional().nullable(),
    community: z.string().optional().nullable(),
    locality: z.string().optional().nullable(),
    cpf: z.string().optional().nullable(),
    fishing_type: z.string().optional().nullable(),
    emergency_contact_name: z.string().optional().nullable(),
    emergency_contact_phone: z.string().optional().nullable(),
    emergency_contact_relation: z.string().optional().nullable(),
    avatar_url: z.string().optional().nullable(),
    registration_completed: z.boolean().optional().nullable(),
  }).parse(data))
  .handler(async ({ data, context }) => {
    const supabase = context.supabase;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.warn("Update attempt without session in server function");
      return { success: false, error: "Authentication required" };
    }

    // Filter out undefined values to avoid TS/Supabase conflicts with null
    const updates = Object.fromEntries(
      Object.entries(data).filter(([_, v]) => v !== undefined)
    );

    const { error } = await supabase
      .from('profiles')
      .update(updates as any)
      .eq('id', user.id);

    if (error) throw error;
    return { success: true };
  });

