import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireAdminAuth } from "@/integrations/supabase/auth-middleware";

export const logAdminAction = createServerFn({ method: "POST" })
  .middleware([requireAdminAuth])

  .validator((data: unknown) => z.object({
    action: z.string(),
    module: z.string(),
    entity_type: z.string().optional().nullable(),
    entity_id: z.string().optional().nullable(),
    metadata: z.record(z.any()).optional().nullable(),
  }).parse(data))
  .handler(async ({ data, context }) => {
    // Verificar se o usuário tem role administrativa no banco de dados via RPC (security definer)
    const { data: isAdmin, error: roleError } = await context.supabase.rpc('is_any_admin' as any, {
      _user_id: context.userId
    });

    if (roleError || !isAdmin) {
      console.error("Tentativa de log de auditoria negada por falta de privilégios:", context.userId);
      throw new Error("Não autorizado");
    }

    const { error } = await context.supabase
      .from('admin_audit_logs')
      .insert({
        actor_id: context.userId,
        action: data.action,
        module: data.module,
        entity_type: data.entity_type ?? null,
        entity_id: data.entity_id ?? null,
        metadata: data.metadata ?? null,
      });

    if (error) {
      console.error("Erro ao registrar log de auditoria:", error);
      throw new Error("Erro ao registrar log");
    }

    return { success: true };
  });


export const getAuditLogs = createServerFn({ method: "GET" })
  .middleware([requireAdminAuth])

  .validator((data: unknown) => z.object({
    limit: z.number().optional().default(50),
    offset: z.number().optional().default(0),
  }).parse(data))
  .handler(async ({ data, context }) => {
    const { data: logs, error } = await context.supabase
      .from('admin_audit_logs')
      .select(`
        *,
        admin:profiles!actor_id(full_name)
      `)
      .order('created_at', { ascending: false })
      .range(data.offset, data.offset + (data.limit || 50) - 1);

    if (error) {
      console.error("Erro ao buscar logs de auditoria:", error);
      throw new Error("Erro ao buscar logs");
    }

    return logs;
  });


