import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export const getMyRoles = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])

  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', context.userId);

    if (error) {
      console.error("Error fetching roles:", error);
      return [];
    }

    return (data as any[]).map(r => r.role);
  });

export const checkIsMasterAdmin = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])

  .handler(async ({ context }) => {
    const { data, error } = await context.supabase.rpc('has_role' as any, {
      _user_id: context.userId,
      _role: 'master_admin'
    });

    if (error) {
      console.error("Error checking master role:", error);
      return false;
    }

    return !!data;
  });

export const checkIsAdmin = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])

  .handler(async ({ context }) => {
    const { data, error } = await context.supabase.rpc('is_any_admin' as any, {
      _user_id: context.userId
    });

    if (error) {
      console.error("Error checking admin role:", error);
      return false;
    }

    return !!data;
  });


