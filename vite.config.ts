import { defineConfig } from 'vite';
import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { nitro } from 'nitro/vite';
import { fileURLToPath } from 'node:url';

export default defineConfig(({ command, mode }) => {
  return {
    resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } },
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

