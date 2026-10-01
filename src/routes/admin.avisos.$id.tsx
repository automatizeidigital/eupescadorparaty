import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/admin/avisos/$id')({
  component: () => <div className="p-8">Editar aviso em desenvolvimento...</div>,
});
