import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
mkdirSync('dist/server', { recursive: true });
if (!existsSync('dist/server/index.mjs') || !existsSync('dist/client')) {
  throw new Error('A compilação não produziu o servidor e os recursos esperados pelo Sites.');
}
writeFileSync('dist/server/index.js', "export { default } from './index.mjs';\n");
