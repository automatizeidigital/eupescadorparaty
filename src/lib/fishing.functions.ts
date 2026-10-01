import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";
import { createServerFn } from "@tanstack/react-start";

export const getFishSpecies = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])

  .validator((search: string | undefined) => z.string().optional().parse(search))
  .handler(async ({ data: search, context }) => {
    const supabase = context.supabase;
    let query = supabase
      .from('fish_species')
      .select('*')
      .eq('active', true)
      .order('common_name', { ascending: true });

    if (search) {
      query = query.ilike('common_name', `%${search}%`);
    }

    const { data, error } = await query;

    if (error) throw new Error(error.message);
    return data;
  });

export const getFishingRegulations = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])

  .validator((speciesId: string | undefined) => z.string().uuid().optional().parse(speciesId))
  .handler(async ({ data: speciesId, context }) => {
    const supabase = context.supabase;
    let query = supabase
      .from('fishing_regulations')
      .select(`
        *,
        fish_species(common_name, scientific_name)
      `)
      .eq('status', 'active')
      .order('updated_at', { ascending: false });

    if (speciesId) {
      query = query.eq('species_id', speciesId);
    }

    const { data, error } = await query;

    if (error) throw new Error(error.message);
    return data;
  });

