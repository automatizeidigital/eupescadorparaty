import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/solicitacoes')({
  component: () => (
    <div className="space-y-8">
      <h1 className="text-3xl font-black uppercase tracking-tight">Solicitações de Serviço</h1>
      <div className="bg-white p-12 rounded-[2rem] border-2 border-dashed text-center space-y-4">
        <div className="h-16 w-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto text-slate-400">
          <MessageSquare size={32} />
        </div>
        <div>
          <h3 className="text-xl font-bold">Central de Atendimento</h3>
          <p className="text-muted-foreground">A triagem e resposta de protocolos administrativos está em fase de homologação.</p>
        </div>
      </div>
    </div>
  )
})

import { MessageSquare } from 'lucide-react'
