
import { z } from "zod";
import { createServerFn } from "@tanstack/react-start";

export const getDocumentCategories = createServerFn({ method: "GET" })

  .handler(async (): Promise<any> => { throw new Error("Serviço temporariamente indisponível. A nova base está sendo preparada."); });

export const getUserDocuments = createServerFn({ method: "GET" })

  .handler(async (): Promise<any> => { throw new Error("Serviço temporariamente indisponível. A nova base está sendo preparada."); });

export const getDocumentById = createServerFn({ method: "GET" })

  .validator((id: string) => z.string().uuid().parse(id))
  .handler(async (): Promise<any> => { throw new Error("Serviço temporariamente indisponível. A nova base está sendo preparada."); });

export const createDocument = createServerFn({ method: "POST" })

  .validator((data: unknown) => z.object({
    title: z.string(),
    category_id: z.string().uuid().optional().nullable(),
    boat_id: z.string().uuid().optional().nullable(),
    document_number: z.string().optional().nullable(),
    issuer: z.string().optional().nullable(),
    issued_at: z.string().optional().nullable(),
    expires_at: z.string().optional().nullable(),
    file_url: z.string().optional().nullable(),
    notes: z.string().optional().nullable(),
  }).parse(data))
  .handler(async (): Promise<any> => { throw new Error("Serviço temporariamente indisponível. A nova base está sendo preparada."); });

export const updateDocument = createServerFn({ method: "POST" })

  .validator((data: unknown) => z.object({
    id: z.string().uuid(),
    title: z.string().optional(),
    category_id: z.string().uuid().optional().nullable(),
    boat_id: z.string().uuid().optional().nullable(),
    document_number: z.string().optional().nullable(),
    issuer: z.string().optional().nullable(),
    issued_at: z.string().optional().nullable(),
    expires_at: z.string().optional().nullable(),
    file_url: z.string().optional().nullable(),
    notes: z.string().optional().nullable(),
    status: z.enum(['valid', 'expiring', 'expired', 'pending_review', 'archived']).optional(),
  }).parse(data))
  .handler(async (): Promise<any> => { throw new Error("Serviço temporariamente indisponível. A nova base está sendo preparada."); });

