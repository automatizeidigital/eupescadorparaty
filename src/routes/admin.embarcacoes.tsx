import { createFileRoute, Link } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { getAdminBoats } from '@/lib/admin.functions'
import { Button } from '@/components/ui/button'
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Ship, User, MapPin } from 'lucide-react'

export const Route = createFileRoute('/admin/embarcacoes')({
  component: AdminEmbarcacoes,
})

function AdminEmbarcacoes() {
  const { data: boats, isLoading } = useQuery({
    queryKey: ['admin-boats'],
    queryFn: () => getAdminBoats({ data: {} }),
  })

  if (isLoading) return <div className="p-8">Carregando embarcações...</div>

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-black uppercase tracking-tight">Embarcações</h1>

      <div className="bg-white rounded-[2rem] border-2 overflow-hidden shadow-sm">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead className="font-bold">Nome</TableHead>
              <TableHead className="font-bold">Proprietário</TableHead>
              <TableHead className="font-bold">Registro</TableHead>
              <TableHead className="font-bold">Tipo</TableHead>
              <TableHead className="font-bold">Porto/Base</TableHead>
              <TableHead className="font-bold">Status</TableHead>
              <TableHead className="text-right font-bold">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {boats?.map((b) => (
              <TableRow key={b.id}>
                <TableCell className="font-bold flex items-center gap-2">
                  <Ship size={16} className="text-primary" />
                  {b.name}
                  {b.is_primary && <Badge variant="outline" className="text-[8px] h-4">PRINCIPAL</Badge>}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <User size={14} className="text-muted-foreground" />
                    {(b as any).profiles?.full_name || '---'}
                  </div>
                </TableCell>
                <TableCell className="font-mono text-xs">{b.registration_number || '---'}</TableCell>
                <TableCell className="capitalize">{b.boat_type || '---'}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin size={14} className="text-muted-foreground" />
                    {b.home_port || '---'}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={b.status === 'active' ? 'default' : 'secondary'}>
                    {b.status?.toUpperCase() || 'ATIVO'}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Link to="/admin/embarcacoes/$id" params={{ id: b.id }}>
                    <Button variant="outline" size="sm" className="rounded-lg font-bold">Detalhes</Button>
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
