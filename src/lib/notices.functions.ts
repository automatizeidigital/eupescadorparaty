import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
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
  .middleware([requireSupabaseAuth])

  .validator((data) => z.object({
    category: z.string().optional(),
    limit: z.number().optional().default(20),
  }).parse(data))
  .handler(async ({ data, context }) => {
    const supabase = context.supabase;
    let query = supabase
      .from('notices')
      .select(`
        *,
        notice_audiences(*)
      `)
      .eq('status', 'published')
      .order('priority', { ascending: false })
      .order('pinned', { ascending: false })
      .order('published_at', { ascending: false })
      .limit(data.limit);

    if (data.category) {
      query = query.eq('category', data.category);
    }

    const { data: notices, error } = await query;

    if (error) throw new Error(error.message);
    return notices as Notice[];
  });

export const getNoticeById = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])

  .validator((data) => z.string().uuid().parse(data))
  .handler(async ({ data: id, context }) => {
    const supabase = context.supabase;
    const { data: notice, error } = await supabase
      .from('notices')
      .select(`
        *,
        notice_audiences(*)
      `)
      .eq('id', id)
      .single();

    if (error) throw new Error(error.message);
    return notice as Notice;
  });

