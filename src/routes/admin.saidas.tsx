import { createFileRoute, Link } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { getAdminTrips } from '@/lib/admin.functions'
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Waves, Clock, Ship, User, MapPin, AlertCircle, Wifi, WifiOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { evaluateTripMonitoring } from '@/lib/trip-monitoring.functions'

export const Route = createFileRoute('/admin/saidas')({
  component: AdminSaidas,
})

function AdminSaidas() {
  const { data: allTrips, isLoading } = useQuery({
    queryKey: ['admin-trips'],
    queryFn: () => getAdminTrips({ data: {} }),
  })

  if (isLoading) return <div className="p-8">Carregando saídas...</div>

  const monitoredTrips = allTrips?.map(t => ({ ...t, monitoring: evaluateTripMonitoring(t) })) || []
  
  const activeTrips = monitoredTrips.filter(t => t.status === 'active' && t.monitoring.status === 'on_time')
  const returnApproaching = monitoredTrips.filter(t => t.status === 'active' && t.monitoring.status === 'return_approaching')
  const overdueTrips = monitoredTrips.filter(t => t.status === 'active' && t.monitoring.status.includes('overdue'))
  const needsAttention = monitoredTrips.filter(t => t.status === 'active' && t.monitoring.status === 'needs_attention')
  const staleLocation = monitoredTrips.filter(t => t.status === 'active' && t.monitoring.locationFreshness === 'stale')
  const completedTrips = monitoredTrips.filter(t => t.status === 'completed') || []

  const TripTable = ({ trips }: { trips: any[] }) => (
    <div className="bg-white rounded-[2rem] border-2 overflow-hidden shadow-sm mt-6">
      <Table>
        <TableHeader className="bg-slate-50">
          <TableRow>
            <TableHead className="font-bold">Pescador</TableHead>
            <TableHead className="font-bold">Embarcação</TableHead>
            <TableHead className="font-bold text-center">Comunicação</TableHead>
            <TableHead className="font-bold">Retorno Previsto</TableHead>
            <TableHead className="font-bold">Atraso</TableHead>
            <TableHead className="font-bold">Status</TableHead>
            <TableHead className="text-right font-bold">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {trips.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">Nenhuma viagem encontrada.</TableCell>
            </TableRow>
          ) : trips.map((t) => (
            <TableRow key={t.id}>
              <TableCell>
                <div className="font-bold">{t.profiles?.full_name}</div>
                <div className="text-xs text-muted-foreground">{t.profiles?.community}</div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Ship size={14} className="text-muted-foreground" />
                  {t.boats?.name}
                </div>
              </TableCell>
              <TableCell className="text-center">
                <div className={`flex justify-center ${
                  t.monitoring.locationFreshness === 'fresh' ? 'text-green-500' : 
                  t.monitoring.locationFreshness === 'stale' ? 'text-orange-500' : 'text-slate-300'
                }`}>
                  {t.monitoring.locationFreshness === 'fresh' ? <Wifi size={18} /> : <WifiOff size={18} />}
                </div>
              </TableCell>
              <TableCell className="text-sm">
                <div className="font-bold">{t.expected_return_at ? new Date(t.expected_return_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '---'}</div>
                <div className="text-[10px] text-muted-foreground uppercase">{t.expected_return_at ? new Date(t.expected_return_at).toLocaleDateString() : ''}</div>
              </TableCell>
              <TableCell>
                {t.status === 'active' && new Date(t.expected_return_at || '') < new Date() ? (
                  <Badge variant="destructive" className="font-black">
                    {Math.round((new Date().getTime() - new Date(t.expected_return_at).getTime()) / 60000)} min
                  </Badge>
                ) : <span className="text-muted-foreground">-</span>}
              </TableCell>
              <TableCell>
                <Badge variant={t.emergency_incidents?.some((i: any) => i.status === 'open') ? 'destructive' : t.status === 'active' ? (new Date(t.expected_return_at || '') < new Date() ? 'destructive' : 'default') : 'secondary'} className="font-bold">
                  {t.emergency_incidents?.some((i: any) => i.status === 'open') ? 'SOS' : t.status === 'active' ? (new Date(t.expected_return_at || '') < new Date() ? 'ATRASADA' : 'NO MAR') : 'FINALIZADA'}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <Link to="/admin/saidas/$id" params={{ id: t.id }}>
                  <Button variant="outline" size="sm" className="rounded-lg font-bold">Detalhes</Button>
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3">
        <Waves className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-black uppercase tracking-tight">Gestão de Saídas</h1>
      </div>

      <Tabs defaultValue="active" className="w-full">
        <TabsList className="bg-slate-100 p-1 rounded-xl h-auto flex-wrap">
          <TabsTrigger value="active" className="rounded-lg font-bold py-2 px-4 data-[state=active]:bg-white">
            Ativas ({activeTrips.length})
          </TabsTrigger>
          <TabsTrigger value="approaching" className="rounded-lg font-bold py-2 px-4 data-[state=active]:bg-yellow-400">
            Próx. Retorno ({returnApproaching.length})
          </TabsTrigger>
          <TabsTrigger value="overdue" className="rounded-lg font-bold py-2 px-4 data-[state=active]:bg-orange-500 data-[state=active]:text-white">
            Atrasadas ({overdueTrips.length})
          </TabsTrigger>
          <TabsTrigger value="attention" className="rounded-lg font-bold py-2 px-4 data-[state=active]:bg-destructive data-[state=active]:text-white">
            Atenção ({needsAttention.length})
          </TabsTrigger>
          <TabsTrigger value="stale" className="rounded-lg font-bold py-2 px-4 data-[state=active]:bg-slate-700 data-[state=active]:text-white">
            Sem Posição ({staleLocation.length})
          </TabsTrigger>
          <TabsTrigger value="completed" className="rounded-lg font-bold py-2 px-4 data-[state=active]:bg-white">
            Finalizadas ({completedTrips.length})
          </TabsTrigger>
        </TabsList>
        <TabsContent value="active">
          <TripTable trips={activeTrips} />
        </TabsContent>
        <TabsContent value="approaching">
          <TripTable trips={returnApproaching} />
        </TabsContent>
        <TabsContent value="overdue">
          <TripTable trips={overdueTrips} />
        </TabsContent>
        <TabsContent value="attention">
          <TripTable trips={needsAttention} />
        </TabsContent>
        <TabsContent value="stale">
          <TripTable trips={staleLocation} />
        </TabsContent>
        <TabsContent value="completed">
          <TripTable trips={completedTrips} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
