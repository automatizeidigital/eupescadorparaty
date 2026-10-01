import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";


export const logAdminAction = createServerFn({ method: "POST" })

  .validator((data: unknown) => z.object({
    action: z.string(),
    module: z.string(),
    entity_type: z.string().optional().nullable(),
    entity_id: z.string().optional().nullable(),
    metadata: z.record(z.any()).optional().nullable(),
  }).parse(data))
  .handler(async (): Promise<any> => { throw new Error("Serviço temporariamente indisponível. A nova base está sendo preparada."); });


export const getAuditLogs = createServerFn({ method: "GET" })

  .validator((data: unknown) => z.object({
    limit: z.number().optional().default(50),
    offset: z.number().optional().default(0),
  }).parse(data))
  .handler(async (): Promise<any> => { throw new Error("Serviço temporariamente indisponível. A nova base está sendo preparada."); });


