# Eu Pescador! — Paraty

Portal em React e TanStack Start para pescadores, embarcações, documentos, viagens e administração.

## Estado atual

A integração com a nova base Supabase eupescadorparaty foi restaurada. Login MASTER, identificação da permissão e carregamento do painel administrativo foram verificados no ambiente local. A atualização publicada no Sites ainda está pendente.

## Desenvolvimento

Instale com bun install --frozen-lockfile. Copie .env.example para .env e preencha a URL e a chave publicável da sua base. Execute bun run dev ou bun run build.

## Segurança e publicação

Não versionar senhas, chaves secretas ou arquivos .env. O esquema da base está em database/schema.sql; ele não inclui contas ou credenciais. Configure os valores de produção pelo Sites. O repositório não possui publicação automática configurada.
