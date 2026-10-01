import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";
import { createServerFn } from "@tanstack/react-start";

export const getCalendarEvents = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])

  .validator((data: unknown) => z.object({
    limit: z.number().optional().default(50),
    category: z.string().optional(),
    futureOnly: z.boolean().optional().default(true),
  }).parse(data))
  .handler(async ({ data, context }) => {
    const supabase = context.supabase;
    let query = supabase
      .from('calendar_events')
      .select('*')
      .eq('is_public', true)
      .order('starts_at', { ascending: true })
      .limit(data.limit);

    if (data.category) {
      query = query.eq('category', data.category);
    }

    if (data.futureOnly) {
      query = query.gte('starts_at', new Date().toISOString());
    }

    const { data: events, error } = await query;

    if (error) throw new Error(error.message);
    return events;
  });

