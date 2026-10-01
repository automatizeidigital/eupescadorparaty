import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/admin/avisos')({
  component: () => <div className="p-8">Gerenciamento de Avisos em desenvolvimento...</div>,
});
