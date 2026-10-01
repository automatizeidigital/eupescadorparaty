import { cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

// Use the Sites validator and native Windows tar, keeping staging in the project.
const [helper, archive] = process.argv.slice(2);
if (!helper || !archive || !path.isAbsolute(helper) || !path.isAbsolute(archive)) {
  throw new Error('Informe o validador Sites e o arquivo de saída como caminhos absolutos.');
}
const project = process.cwd();
const runtime = path.join(project, '.sites-runtime');
mkdirSync(runtime, { recursive: true });
const stage = mkdtempSync(path.join(runtime, 'package-'));
const target = path.join(stage, 'dist');
const prepared = spawnSync(process.execPath, [helper, project, target], { encoding: 'utf8' });
if (prepared.status !== 0) throw new Error(prepared.stderr || 'Falha na validação do pacote.');
mkdirSync(path.join(target, '.openai'), { recursive: true });
const manifest = JSON.parse(readFileSync(path.join(project, '.openai/hosting.json'), 'utf8'));
writeFileSync(path.join(target, '.openai/hosting.json'), JSON.stringify(manifest, null, 2));
if (existsSync(path.join(project, 'drizzle'))) {
  cpSync(path.join(project, 'drizzle'), path.join(target, '.openai/drizzle'), { recursive: true });
}
const packed = spawnSync('C:/Windows/System32/tar.exe', ['-C', stage, '-czf', archive, 'dist'], { encoding: 'utf8' });
if (packed.status !== 0) throw new Error(packed.stderr || 'Falha ao criar arquivo.');
const listed = spawnSync('C:/Windows/System32/tar.exe', ['-tzf', archive], { encoding: 'utf8' });
if (listed.status !== 0 || !listed.stdout.includes('dist/.openai/hosting.json') ||
    !listed.stdout.includes('dist/server/index.js')) throw new Error('Pacote incompleto.');
if (listed.stdout.split('\n').some(p => /(^|\/)\.env($|\.)|(^|\/)node_modules\//.test(p))) {
  throw new Error('O pacote contém arquivos que não devem ser publicados.');
}
console.log(JSON.stringify({ archive, validated: true }));
