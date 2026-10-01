import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { getAdminIncidents } from '@/lib/admin.functions'
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { AlertTriangle, MapPin, Phone, Ship } from 'lucide-react'
import { incidentTypeLabels } from '@/lib/emergency.types'

export const Route = createFileRoute('/admin/seguranca')({
  component: AdminSeguranca,
})

function AdminSeguranca() {
  const { data: incidents, isLoading } = useQuery({
    queryKey: ['admin-incidents'],
    queryFn: () => getAdminIncidents(),
  })

  if (isLoading) return <div className="p-8">Carregando incidentes...</div>

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-black uppercase tracking-tight">Segurança e SOS</h1>

      <div className="bg-white rounded-[2rem] border-2 overflow-hidden shadow-sm">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead className="font-bold">Status</TableHead>
              <TableHead className="font-bold">Data/Hora</TableHead>
              <TableHead className="font-bold">Pescador</TableHead>
              <TableHead className="font-bold">Tipo</TableHead>
              <TableHead className="font-bold">Embarcação</TableHead>
              <TableHead className="font-bold">Localização</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {incidents?.map((i) => (
              <TableRow key={i.id} className={i.status === 'open' ? 'bg-red-50/30' : ''}>
                <TableCell>
                  <Badge variant={i.status === 'open' ? 'destructive' : 'secondary'}>
                    {i.status.toUpperCase()}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm">
                  {new Date(i.created_at || "").toLocaleString()}
                </TableCell>
                <TableCell>
                  <div className="font-bold">{(i as any).profiles?.full_name}</div>
                  <div className="text-xs text-muted-foreground flex items-center gap-1">
                    <Phone size={12} /> {(i as any).profiles?.phone}
                  </div>
                </TableCell>
                <TableCell className="font-bold text-sm">
                  {i.incident_type ? incidentTypeLabels[i.incident_type as keyof typeof incidentTypeLabels] : '---'}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Ship size={14} className="text-muted-foreground" />
                    {(i as any).boats?.name || '---'}
                  </div>
                </TableCell>
                <TableCell>
                  {i.latitude ? (
                    <div className="text-xs flex items-center gap-1 text-muted-foreground">
                      <MapPin size={12} /> {i.latitude.toFixed(4)}, {i.longitude?.toFixed(4)}
                    </div>
                  ) : '---'}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
