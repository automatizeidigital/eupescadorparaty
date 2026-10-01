import { defineConfig, loadEnv } from 'vite';
import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { nitro } from 'nitro/vite';
import { fileURLToPath } from 'node:url';

export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const publicEnv = {
    VITE_SUPABASE_URL: env['VITE_SUPABASE_URL'] || process.env['VITE_SUPABASE_URL'] || env['SUPABASE_URL'] || process.env['SUPABASE_URL'],
    VITE_SUPABASE_PUBLISHABLE_KEY: env['VITE_SUPABASE_PUBLISHABLE_KEY'] || process.env['VITE_SUPABASE_PUBLISHABLE_KEY'] || env['SUPABASE_PUBLISHABLE_KEY'] || process.env['SUPABASE_PUBLISHABLE_KEY'],
  };
  if (command === 'build' && Object.values(publicEnv).some(value => !value)) {
    throw new Error('Configure a URL e a chave publicável do Supabase antes de compilar.');
  }
  return {
    resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } },
    define: Object.fromEntries(Object.entries(publicEnv).filter(([,value]) => value).map(([key,value]) => [`import.meta.env.${key}`, JSON.stringify(value)])),
    plugins: [
      tanstackStart({ server: { entry: 'server' } }), react(), tailwindcss(),
      ...(command === 'build' ? [nitro({
        preset: 'cloudflare-module',
        output: { dir: 'dist', serverDir: 'dist/server', publicDir: 'dist/client' },
        cloudflare: { nodeCompat: true },
      })] : []),
    ],
  };
});

