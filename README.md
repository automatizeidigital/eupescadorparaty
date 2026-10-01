# Eu Pescador! — Paraty

Portal para cadastros de pescadores, embarcações, documentos, viagens, avisos e administração.

## Estado atual

Interface em React e TanStack Start, publicada no Sites. A antiga integração foi removida. Login e cadastro exibem aviso de reconstrução; as áreas restritas bloqueiam o acesso até a nova integração ser concluída.

Uma nova base Supabase, eupescadorparaty, foi configurada com 24 tabelas, controle de acesso por usuário e documentos privados. O esquema está em database/schema.sql. O usuário MASTER foi criado na base, mas suas credenciais não fazem parte deste repositório.

## Desenvolvimento

Instale as dependências com bun install --frozen-lockfile. Execute bun run dev para desenvolver e bun run build para gerar a versão de produção.

## Publicação

O site utiliza Sites. A configuração em .openai/hosting.json identifica o site existente. A publicação é feita pelo fluxo do Sites; este repositório não tem publicação automática configurada.

## Próxima etapa

Conectar o site à nova base e restaurar os fluxos de login, cadastro e administração, validando as permissões de cada usuário.

Não versionar senhas, arquivos .env, chaves secretas, sessões, dados pessoais ou cópias do banco de produção.
