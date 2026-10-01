import { getRequest } from '@tanstack/react-start/server';

export function getSupabaseServerConfig() {
  const request = getRequest() as Request & {
    runtime?: { cloudflare?: { env?: Record<string, unknown> } };
  };
  const env = request.runtime?.cloudflare?.env;
  const url = env?.['SUPABASE_URL'] ?? process.env['SUPABASE_URL'];
  const key = env?.['SUPABASE_PUBLISHABLE_KEY'] ?? process.env['SUPABASE_PUBLISHABLE_KEY'];
  if (typeof url !== 'string' || typeof key !== 'string' || !url || !key) {
    throw new Error('A conexão com o banco ainda não foi configurada.');
  }
  if (key.startsWith('sb_secret_')) throw new Error('Use uma chave publicável para o acesso autenticado.');
  return { url, key };
}

