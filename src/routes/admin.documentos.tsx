import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/documentos')({
  component: () => (
    <div className="space-y-8">
      <h1 className="text-3xl font-black uppercase tracking-tight">Gestão de Documentos</h1>
      <div className="bg-white p-12 rounded-[2rem] border-2 border-dashed text-center space-y-4">
        <div className="h-16 w-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto text-slate-400">
          <FileText size={32} />
        </div>
        <div>
          <h3 className="text-xl font-bold">Módulo em Desenvolvimento</h3>
          <p className="text-muted-foreground">A revisão documental centralizada será disponibilizada em breve.</p>
        </div>
      </div>
    </div>
  )
})

import { FileText } from 'lucide-react'
