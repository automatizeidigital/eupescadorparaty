import { createFileRoute } from '@tanstack/react-router'
import { Card, CardContent } from '@/components/ui/card'
import { ShieldCheck, Anchor, RefreshCcw, XCircle, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table'

export const Route = createFileRoute('/admin/carteirinhas')({
  component: AdminCarteirinhas,
})

function AdminCarteirinhas() {
  // Mock data for initial layout
  const carteirinhas = [
    { id: '1', name: 'João Pescador', registration: 'PES-000001', status: 'active', issued_at: '2026-08-01', token: 'TK-8821' },
    { id: '2', name: 'Maria do Mar', registration: 'PES-000002', status: 'active', issued_at: '2026-08-05', token: 'TK-9912' },
  ]

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3">
        <ShieldCheck className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-black uppercase tracking-tight">Gestão de Carteirinhas</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="rounded-3xl border-2">
          <CardContent className="p-6">
            <p className="text-xs font-bold text-slate-500 uppercase mb-1">Emitidas</p>
            <p className="text-3xl font-black">152</p>
          </CardContent>
        </Card>
        <Card className="rounded-3xl border-2">
          <CardContent className="p-6">
            <p className="text-xs font-bold text-slate-500 uppercase mb-1">Ativas</p>
            <p className="text-3xl font-black text-green-600">148</p>
          </CardContent>
        </Card>
        <Card className="rounded-3xl border-2">
          <CardContent className="p-6">
            <p className="text-xs font-bold text-slate-500 uppercase mb-1">Revogadas</p>
            <p className="text-3xl font-black text-red-600">4</p>
          </CardContent>
        </Card>
      </div>

      <div className="bg-white rounded-[2rem] border-2 overflow-hidden shadow-sm">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead className="font-bold uppercase text-xs tracking-wider">Pescador</TableHead>
              <TableHead className="font-bold uppercase text-xs tracking-wider">Registro</TableHead>
              <TableHead className="font-bold uppercase text-xs tracking-wider">Status</TableHead>
              <TableHead className="font-bold uppercase text-xs tracking-wider">Token</TableHead>
              <TableHead className="font-bold uppercase text-xs tracking-wider">Emissão</TableHead>
              <TableHead className="text-right font-bold uppercase text-xs tracking-wider">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {carteirinhas.map((c) => (
              <TableRow key={c.id}>
                <TableCell className="font-bold">{c.name}</TableCell>
                <TableCell className="font-mono text-xs">{c.registration}</TableCell>
                <TableCell>
                  <Badge variant="default" className="bg-green-100 text-green-700 hover:bg-green-100 uppercase text-[10px] font-black tracking-widest">
                    {c.status}
                  </Badge>
                </TableCell>
                <TableCell className="font-mono text-xs text-slate-500">{c.token}</TableCell>
                <TableCell className="text-xs">{new Date(c.issued_at).toLocaleDateString()}</TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button variant="outline" size="sm" className="rounded-xl font-bold text-[10px] uppercase tracking-wider">
                      <RefreshCcw className="mr-1 h-3 w-3" /> Regerar
                    </Button>
                    <Button variant="ghost" size="sm" className="rounded-xl font-bold text-[10px] uppercase tracking-wider text-red-500">
                      <XCircle className="mr-1 h-3 w-3" /> Revogar
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
