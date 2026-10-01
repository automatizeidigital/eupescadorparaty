import { createFileRoute, Link } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { getAdminPescadores } from '@/lib/admin.functions'
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { useState } from 'react'
import { Search, Filter, Eye, EyeOff, MoreVertical, CheckCircle2, XCircle, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { updateProfileStatus } from '@/lib/admin.functions'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'


export const Route = createFileRoute('/admin/pescadores')({
  component: AdminPescadores,
})

function AdminPescadores() {
  const [search, setSearch] = useState('')
  const [showSensitive, setShowSensitive] = useState<Record<string, boolean>>({})

  const queryClient = useQueryClient()
  const { data: pescadores, isLoading } = useQuery({
    queryKey: ['admin-pescadores', search],
    queryFn: () => getAdminPescadores({ data: { search } }),
  })

  const mutation = useMutation({
    mutationFn: (vars: { id: string, status: boolean }) => updateProfileStatus({ data: { id: vars.id, registration_completed: vars.status } }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-pescadores'] })
      toast.success('Status do pescador atualizado com sucesso')
    },
    onError: () => toast.error('Erro ao atualizar status')
  })

  const toggleSensitive = (id: string) => {
    setShowSensitive(prev => ({ ...prev, [id]: !prev[id] }))
  }

  const maskCpf = (cpf: string, id: string) => {
    if (showSensitive[id]) return cpf
    return `***.***.***-${cpf.slice(-2)}`
  }


  if (isLoading) return <div className="p-8">Carregando pescadores...</div>

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-3xl font-black uppercase tracking-tight">Pescadores</h1>
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input 
            placeholder="Buscar por nome, registro ou CPF..." 
            className="pl-10 rounded-xl"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white rounded-[2rem] border-2 overflow-hidden shadow-sm">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead className="font-bold">Nome</TableHead>
              <TableHead className="font-bold">Registro</TableHead>
              <TableHead className="font-bold">CPF</TableHead>
              <TableHead className="font-bold">Comunidade</TableHead>
              <TableHead className="font-bold">Telefone</TableHead>
              <TableHead className="font-bold">Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pescadores?.map((p) => (
              <TableRow key={p.id}>
                <TableCell className="font-bold">{p.full_name}</TableCell>
                <TableCell className="font-mono text-xs">{p.municipal_registration || '---'}</TableCell>
                <TableCell className="font-mono text-xs">
                  <div className="flex items-center gap-2">
                    {maskCpf(p.cpf || '', p.id)}
                    <button onClick={() => toggleSensitive(p.id)} className="text-primary hover:text-primary/80">
                      {showSensitive[p.id] ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                </TableCell>
                <TableCell>{p.community || '---'}</TableCell>
                <TableCell>{p.phone || '---'}</TableCell>
                <TableCell>
                  <Badge variant={p.registration_completed ? "default" : "secondary"}>
                    {p.registration_completed ? 'Ativo' : 'Pendente'}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Link to="/admin/pescadores/$id" params={{ id: p.id }}>
                      <Button variant="outline" size="sm" className="rounded-lg font-bold">Ver</Button>
                    </Link>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-lg">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48 rounded-xl">
                        <DropdownMenuLabel>Ações Administrativas</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => mutation.mutate({ id: p.id, status: !p.registration_completed })}>
                          {p.registration_completed ? (
                            <><XCircle className="mr-2 h-4 w-4 text-red-500" /> Inativar Pescador</>
                          ) : (
                            <><CheckCircle2 className="mr-2 h-4 w-4 text-green-500" /> Ativar Pescador</>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <RotateCcw className="mr-2 h-4 w-4" /> Regenerar Carteirinha
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
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
