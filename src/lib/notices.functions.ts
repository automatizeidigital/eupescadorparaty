
import { z } from "zod";
import { createServerFn } from "@tanstack/react-start";

export const noticeSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  summary: z.string().nullable(),
  content: z.string(),
  category: z.enum([
    'secretaria_pesca', 
    'prefeitura', 
    'seguranca', 
    'clima', 
    'evento', 
    'beneficio', 
    'documentacao', 
    'defeso', 
    'saude', 
    'meio_ambiente', 
    'outro'
  ]),
  priority: z.enum(['low', 'normal', 'high', 'critical']),
  status: z.enum(['draft', 'scheduled', 'published', 'archived']),
  source_type: z.enum(['manual', 'instagram', 'facebook', 'website', 'external']),
  source_name: z.string().nullable(),
  source_url: z.string().nullable(),
  image_url: z.string().nullable(),
  published_at: z.string().nullable(),
  expires_at: z.string().nullable(),
  pinned: z.boolean(),
  created_at: z.string(),
});

export type Notice = z.infer<typeof noticeSchema>;

export const getNotices = createServerFn({ method: "GET" })

  .validator((data) => z.object({
    category: z.string().optional(),
    limit: z.number().optional().default(20),
  }).parse(data))
  .handler(async (): Promise<any> => { throw new Error("Serviço temporariamente indisponível. A nova base está sendo preparada."); });

export const getNoticeById = createServerFn({ method: "GET" })

  .validator((data) => z.string().uuid().parse(data))
  .handler(async (): Promise<any> => { throw new Error("Serviço temporariamente indisponível. A nova base está sendo preparada."); });

