import { createFileRoute } from '@tanstack/react-router'
import { Card, CardContent } from '@/components/ui/card'
import { useQuery } from '@tanstack/react-query'
import { getAdminStats } from '@/lib/admin.functions'
import { 
  Users, Ship, AlertTriangle, FileText, Megaphone, 
  Waves, MessageSquare, LayoutDashboard, Plus, Anchor,
  Bell, Briefcase, Calendar, Fish
} from 'lucide-react'

import { Button } from '@/components/ui/button'

export const Route = createFileRoute('/admin/')({
  component: AdminDashboard,
})

function AdminDashboard() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: () => getAdminStats(),
  })

  if (isLoading) return <div className="p-8">Carregando indicadores...</div>

  const cards = [
    { label: 'Total Pescadores', value: stats?.totalPescadores, icon: Users, color: 'text-blue-600' },
    { label: 'Pescadores Ativos', value: stats?.pescadoresAtivos, icon: Users, color: 'text-green-600' },
    { label: 'Embarcações', value: stats?.totalEmbarcacoes, icon: Ship, color: 'text-cyan-600' },
    { label: 'Saídas Ativas', value: stats?.saidasAtivas, icon: Waves, color: 'text-indigo-600' },
    { label: 'SOS Abertos', value: stats?.sosAbertos, icon: AlertTriangle, color: 'text-red-600' },
    { label: 'Docs Vencendo', value: stats?.documentosVencendo, icon: FileText, color: 'text-orange-600' },
    { label: 'Solicitações', value: stats?.solicitacoesPendentes, icon: MessageSquare, color: 'text-purple-600' },
    { label: 'Avisos Ativos', value: stats?.avisosAtivos, icon: Megaphone, color: 'text-amber-600' },
  ]

  const quickActions = [
    { label: 'Novo Aviso', icon: Megaphone },
    { label: 'Nova Postagem', icon: MessageSquare },
    { label: 'Nova Notificação', icon: Bell },
    { label: 'Novo Serviço', icon: Briefcase },
    { label: 'Novo Evento', icon: Calendar },
    { label: 'Nova Regra Defeso', icon: Fish },
  ]

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <LayoutDashboard className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-black uppercase tracking-tight">Dashboard Administrativo</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, i) => (
          <Card key={i} className="rounded-2xl border-2 hover:shadow-lg transition-shadow">
            <CardContent className="p-6 flex items-center gap-4">
              <div className={`p-4 rounded-xl bg-slate-100 ${card.color}`}>
                <card.icon size={28} />
              </div>
              <div>
                <p className="text-sm font-bold text-muted-foreground uppercase">{card.label}</p>
                <p className="text-3xl font-black">{card.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="bg-white p-8 rounded-3xl border shadow-sm">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
          <Plus className="text-primary" /> Ações Rápidas
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {quickActions.map((action, i) => (
            <Button key={i} variant="outline" className="h-auto py-6 flex flex-col gap-3 rounded-2xl hover:border-primary hover:text-primary transition-all">
              <action.icon size={24} />
              <span className="font-bold text-xs uppercase">{action.label}</span>
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
}

