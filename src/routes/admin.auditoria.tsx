import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from "@tanstack/react-query"
import { getAuditLogs } from "@/lib/audit.functions"
import { Card, CardContent } from "@/components/ui/card"
import { AlertCircle, History, Clock, User, Activity } from "lucide-react"
import { Button } from "@/components/ui/button"
import { format, parseISO } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Skeleton } from "@/components/ui/skeleton"

export const Route = createFileRoute('/admin/auditoria')({
  head: () => ({
    meta: [
      { title: "Logs de Auditoria - Admin | EU PESCADOR!" },
    ],
  }),
  component: AdminAuditoria,
})

function AdminAuditoria() {
  const { data: logs, isLoading, refetch } = useQuery({
    queryKey: ['admin-audit-logs'],
    queryFn: () => getAuditLogs({ data: { limit: 50 } }),
  })

  return (
    <div className="p-6 space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tighter">Auditoria</h1>
          <p className="text-muted-foreground">Registros reais de ações no sistema.</p>
        </div>
        <Button 
          variant="outline" 
          className="rounded-xl border-2"
          onClick={() => refetch()}
        >
          <Activity className="mr-2 h-4 w-4" /> Atualizar
        </Button>
      </header>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => <Skeleton key={i} className="h-24 w-full rounded-2xl" />)}
        </div>
      ) : logs && logs.length > 0 ? (
        <div className="grid gap-4">
          {logs.map((log: any) => (
            <Card key={log.id} className="border-2 rounded-2xl overflow-hidden hover:border-primary/20 transition-colors">
              <CardContent className="p-4 flex items-start gap-4">
                <div className="p-3 bg-slate-100 rounded-xl">
                  <History className="h-5 w-5 text-slate-500" />
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 uppercase text-xs tracking-wider">
                      {log.action}
                    </span>
                    <span className="text-[10px] text-muted-foreground flex items-center gap-1 font-mono">
                      <Clock className="h-3 w-3" />
                      {format(parseISO(log.created_at), "dd MMM yyyy 'às' HH:mm", { locale: ptBR })}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600">
                    Ação em <span className="font-semibold text-slate-900">{log.entity_type}</span>
                    {log.entity_id && <span className="text-muted-foreground font-mono ml-1">({log.entity_id.substring(0, 8)})</span>}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <User className="h-3 w-3 text-primary" />
                    <span className="text-xs font-medium text-primary">
                      {log.admin?.full_name || 'Sistema'}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="border-2 rounded-3xl">
          <CardContent className="p-12 text-center space-y-4">
            <AlertCircle className="mx-auto h-12 w-12 text-muted-foreground opacity-20" />
            <p className="text-muted-foreground font-medium">Nenhum registro de auditoria encontrado.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

