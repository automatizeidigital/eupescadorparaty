import { createFileRoute, Link } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { getAdminBoatById } from '@/lib/admin.functions'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Ship, User, FileText, Navigation, ArrowLeft, 
  Settings, Info, Calendar, Anchor
} from 'lucide-react'

export const Route = createFileRoute('/admin/embarcacoes/$id')({
  component: BoatDetail,
})

function BoatDetail() {
  const { id } = Route.useParams()

  const { data: boat, isLoading } = useQuery({
    queryKey: ['admin-boat', id],
    queryFn: () => getAdminBoatById({ data: { id } }),
  })

  if (isLoading) return <div className="p-8">Carregando detalhes da embarcação...</div>
  if (!boat) return <div className="p-8 text-destructive">Embarcação não encontrada.</div>

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/admin/embarcacoes">
          <Button variant="ghost" size="icon" className="rounded-full">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="text-3xl font-black uppercase tracking-tight">
          Detalhes da Embarcação
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1 rounded-[2rem] overflow-hidden border-2 shadow-sm">
          <div className="h-48 bg-slate-200 relative">
            {boat.photo_url ? (
              <img src={boat.photo_url} alt={boat.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-400">
                <Ship className="w-20 h-20" />
              </div>
            )}
            <div className="absolute top-4 right-4">
              <Badge className="rounded-lg shadow-lg">
                {boat.status || 'Ativa'}
              </Badge>
            </div>
          </div>
          <CardContent className="pt-6 space-y-4">
            <div>
              <h2 className="text-2xl font-bold">{boat.name}</h2>
              <p className="text-sm text-muted-foreground font-mono">{boat.registration_number}</p>
            </div>

            <div className="pt-4 space-y-3">
              <div className="flex items-center justify-between py-2 border-b">
                <span className="text-sm text-slate-500 font-bold uppercase tracking-wider">Proprietário</span>
                <Link to="/admin/pescadores/$id" params={{ id: boat.owner_id }} className="text-sm font-bold text-primary hover:underline">
                  {boat.profiles?.full_name || 'Ver Perfil'}
                </Link>
              </div>
              <div className="flex items-center justify-between py-2 border-b">
                <span className="text-sm text-slate-500 font-bold uppercase tracking-wider">Tipo</span>
                <span className="text-sm font-medium">{boat.boat_type || '---'}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b">
                <span className="text-sm text-slate-500 font-bold uppercase tracking-wider">Porto Base</span>
                <span className="text-sm font-medium">{boat.home_port || '---'}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="lg:col-span-2 space-y-6">
          <Tabs defaultValue="specs" className="w-full">
            <TabsList className="w-full flex bg-slate-100 p-1 rounded-2xl">
              <TabsTrigger value="specs" className="flex-1 rounded-xl font-bold">Especificações</TabsTrigger>
              <TabsTrigger value="saidas" className="flex-1 rounded-xl font-bold">Saídas Recentes</TabsTrigger>
              <TabsTrigger value="documentos" className="flex-1 rounded-xl font-bold">Documentos</TabsTrigger>
            </TabsList>

            <TabsContent value="specs" className="pt-4">
              <Card className="rounded-[2rem] border-2 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg font-black uppercase tracking-wider">Ficha Técnica</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 md:grid-cols-3 gap-6">
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase">Comprimento</p>
                    <p className="font-medium">{boat.length_meters ? `${boat.length_meters}m` : '---'}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase">Material do Casco</p>
                    <p className="font-medium">{boat.hull_material || '---'}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase">Cor</p>
                    <p className="font-medium">{boat.color || '---'}</p>
                  </div>
                  <div className="col-span-full pt-4 border-t">
                    <h4 className="text-sm font-black uppercase mb-4">Motorização</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                      <div>
                        <p className="text-xs font-bold text-slate-400 uppercase">Marca</p>
                        <p className="font-medium">{boat.engine_brand || '---'}</p>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-400 uppercase">Potência</p>
                        <p className="font-medium">{boat.engine_power_hp ? `${boat.engine_power_hp} HP` : '---'}</p>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-400 uppercase">Combustível</p>
                        <p className="font-medium">{boat.fuel_type || '---'}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="saidas" className="pt-4">
              <Card className="rounded-[2rem] border-2 shadow-sm">
                <CardContent className="p-0">
                  <div className="divide-y-2">
                    {boat.fishing_trips && boat.fishing_trips.length > 0 ? (
                      boat.fishing_trips.slice(0, 10).map((trip: any) => (
                        <div key={trip.id} className="p-4 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                              <Navigation className="text-blue-500" />
                            </div>
                            <div>
                              <p className="font-bold text-sm">{trip.destination || 'Saída de pesca'}</p>
                              <p className="text-xs text-muted-foreground">{new Date(trip.started_at).toLocaleString('pt-BR')}</p>
                            </div>
                          </div>
                          <Badge variant="outline" className="rounded-lg">
                            {trip.status}
                          </Badge>
                        </div>
                      ))
                    ) : (
                      <div className="p-12 text-center text-muted-foreground">
                        Nenhuma saída registrada para esta embarcação.
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="documentos" className="pt-4">
              <Card className="rounded-[2rem] border-2 shadow-sm">
                <CardContent className="p-0">
                  <div className="divide-y-2">
                    {boat.user_documents && boat.user_documents.length > 0 ? (
                      boat.user_documents.map((doc: any) => (
                        <div key={doc.id} className="p-4 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">
                              <FileText className="text-slate-500" />
                            </div>
                            <div>
                              <p className="font-bold text-sm">{doc.title}</p>
                              <p className="text-xs text-muted-foreground">Vence em {doc.expires_at ? new Date(doc.expires_at).toLocaleDateString('pt-BR') : 'Sem data'}</p>
                            </div>
                          </div>
                          <Badge variant={doc.status === 'valid' ? 'default' : 'destructive'} className="rounded-lg">
                            {doc.status}
                          </Badge>
                        </div>
                      ))
                    ) : (
                      <div className="p-12 text-center text-muted-foreground">
                        Nenhum documento específico desta embarcação.
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
