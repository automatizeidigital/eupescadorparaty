import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/admin/avisos/novo')({
  component: () => <div className="p-8">Criar novo aviso em desenvolvimento...</div>,
});
