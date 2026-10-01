import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";
import { createServerFn } from "@tanstack/react-start";

export const getDocumentCategories = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])

  .handler(async ({ context }) => {
    const supabase = context.supabase;
    const { data, error } = await supabase
      .from('document_categories')
      .select('*')
      .eq('active', true)
      .order('display_order', { ascending: true });

    if (error) throw new Error(error.message);
    return data;
  });

export const getUserDocuments = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])

  .handler(async ({ context }) => {
    const supabase = context.supabase;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Unauthorized");

    const { data, error } = await supabase
      .from('user_documents')
      .select(`
        *,
        document_categories(name, slug),
        boats(name)
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);
    return data;
  });

export const getDocumentById = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])

  .validator((id: string) => z.string().uuid().parse(id))
  .handler(async ({ data: id, context }) => {
    const supabase = context.supabase;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Unauthorized");

    const { data, error } = await supabase
      .from('user_documents')
      .select(`
        *,
        document_categories(name, slug),
        boats(name)
      `)
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (error) throw new Error(error.message);
    return data;
  });

export const createDocument = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])

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
  .handler(async ({ data, context }) => {
    const supabase = context.supabase;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Unauthorized");

    const { error } = await supabase
      .from('user_documents')
      .insert({
        title: data.title,
        user_id: user.id,
        category_id: data.category_id ?? null,
        boat_id: data.boat_id ?? null,
        document_number: data.document_number ?? null,
        issuer: data.issuer ?? null,
        issued_at: data.issued_at ?? null,
        expires_at: data.expires_at ?? null,
        file_url: data.file_url ?? null,
        notes: data.notes ?? null,
      });

    if (error) throw new Error(error.message);
    return { success: true };
  });

export const updateDocument = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])

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
  .handler(async ({ data, context }) => {
    const supabase = context.supabase;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Unauthorized");

    const updates: any = {};
    if (data.title !== undefined) updates.title = data.title;
    if (data.category_id !== undefined) updates.category_id = data.category_id;
    if (data.boat_id !== undefined) updates.boat_id = data.boat_id;
    if (data.document_number !== undefined) updates.document_number = data.document_number;
    if (data.issuer !== undefined) updates.issuer = data.issuer;
    if (data.issued_at !== undefined) updates.issued_at = data.issued_at;
    if (data.expires_at !== undefined) updates.expires_at = data.expires_at;
    if (data.file_url !== undefined) updates.file_url = data.file_url;
    if (data.notes !== undefined) updates.notes = data.notes;
    if (data.status !== undefined) updates.status = data.status;

    const { error } = await supabase
      .from('user_documents')
      .update(updates)
      .eq('id', data.id)
      .eq('user_id', user.id);

    if (error) throw new Error(error.message);
    return { success: true };
  });

