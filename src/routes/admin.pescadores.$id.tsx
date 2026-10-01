import { createFileRoute, Link } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { getAdminPescadorById, logAdminAction } from '@/lib/admin.functions'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  User, Ship, FileText, Navigation, ShieldAlert, 
  MessageSquare, History, Phone, Mail, MapPin, 
  Eye, EyeOff, ArrowLeft
} from 'lucide-react'
import { useState } from 'react'

export const Route = createFileRoute('/admin/pescadores/$id')({
  component: PescadorDetail,
})

function PescadorDetail() {
  const { id } = Route.useParams()
  const [showSensitive, setShowSensitive] = useState(false)

  const { data: profile, isLoading } = useQuery({
    queryKey: ['admin-pescador', id],
    queryFn: () => getAdminPescadorById({ data: { id } }),
  })

  const handleToggleSensitive = async () => {
    const newState = !showSensitive
    setShowSensitive(newState)
    if (newState) {
      await logAdminAction({
        data: {
          action: 'view_sensitive_data',
          target_id: id,
          target_type: 'profile',
          details: { field: 'cpf' }
        }
      })
    }
  }

  if (isLoading) return <div className="p-8">Carregando detalhes do pescador...</div>
  if (!profile) return <div className="p-8 text-destructive">Pescador não encontrado.</div>

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/admin/pescadores">
          <Button variant="ghost" size="icon" className="rounded-full">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="text-3xl font-black uppercase tracking-tight">
          Detalhes do Pescador
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1 rounded-[2rem] overflow-hidden border-2 shadow-sm">
          <CardContent className="pt-8 flex flex-col items-center text-center space-y-4">
            <div className="w-32 h-32 rounded-full bg-slate-100 flex items-center justify-center border-4 border-white shadow-lg overflow-hidden">
              {profile.avatar_url ? (
                <img src={profile.avatar_url || undefined} alt={profile.full_name || 'Avatar'} className="w-full h-full object-cover" />
              ) : (
                <User className="w-16 h-16 text-slate-400" />
              )}
            </div>
            <div>
              <h2 className="text-xl font-bold">{profile.full_name}</h2>
              <p className="text-sm text-muted-foreground font-mono">{profile.municipal_registration}</p>
            </div>
            <Badge variant={profile.registration_completed ? "default" : "secondary"} className="rounded-lg">
              {profile.registration_completed ? 'Cadastro Ativo' : 'Cadastro Pendente'}
            </Badge>
            
            <div className="w-full pt-4 space-y-3 text-left">
              <div className="flex items-center gap-3 text-sm">
                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                  <Phone size={14} />
                </div>
                <span>{profile.phone || 'Não informado'}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center text-green-600">
                  <MapPin size={14} />
                </div>
                <span>{profile.community || 'Não informada'}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center text-orange-600">
                  <ShieldAlert size={14} />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-400">Emergência</p>
                  <p className="font-medium">{profile.emergency_contact_name || 'N/A'}</p>
                  <p className="text-xs text-muted-foreground">{profile.emergency_contact_phone || ''}</p>
                </div>
              </div>
            </div>

            <Button 
              variant="outline" 
              className="w-full rounded-xl gap-2 font-bold"
              onClick={handleToggleSensitive}
            >
              {showSensitive ? <EyeOff size={16} /> : <Eye size={16} />}
              {showSensitive ? 'Ocultar CPF' : 'Ver CPF'}
            </Button>
            {showSensitive && (
              <p className="font-mono text-sm bg-slate-100 p-2 rounded-lg w-full">
                CPF: {profile.cpf}
              </p>
            )}
          </CardContent>
        </Card>

        <div className="lg:col-span-2 space-y-6">
          <Tabs defaultValue="dados" className="w-full">
            <TabsList className="w-full flex bg-slate-100 p-1 rounded-2xl">
              <TabsTrigger value="dados" className="flex-1 rounded-xl font-bold">Dados</TabsTrigger>
              <TabsTrigger value="embarcacoes" className="flex-1 rounded-xl font-bold">Barcos</TabsTrigger>
              <TabsTrigger value="documentos" className="flex-1 rounded-xl font-bold">Docs</TabsTrigger>
              <TabsTrigger value="saidas" className="flex-1 rounded-xl font-bold">Saídas</TabsTrigger>
              <TabsTrigger value="historico" className="flex-1 rounded-xl font-bold">Histórico</TabsTrigger>
            </TabsList>

            <TabsContent value="dados" className="pt-4">
              <Card className="rounded-[2rem] border-2 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg font-black uppercase tracking-wider">Informações Pessoais</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase">Data de Nascimento</p>
                    <p className="font-medium">{profile.birth_date ? new Date(profile.birth_date).toLocaleDateString('pt-BR') : '---'}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase">Tipo de Pesca</p>
                    <p className="font-medium">{profile.fisher_type || '---'}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase">Endereço</p>
                    <p className="font-medium">{profile.address || '---'}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase">CEP</p>
                    <p className="font-medium">{profile.cep || '---'}</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="embarcacoes" className="pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {profile.boats && profile.boats.length > 0 ? (
                  profile.boats.map((boat: any) => (
                    <Card key={boat.id} className="rounded-2xl border-2 shadow-sm overflow-hidden">
                      <div className="h-24 bg-slate-200" />
                      <CardContent className="p-4">
                        <h4 className="font-bold">{boat.name}</h4>
                        <p className="text-xs font-mono text-muted-foreground">{boat.registration_number}</p>
                        <Badge variant={boat.is_primary ? "default" : "outline"} className="mt-2 text-[10px]">
                          {boat.is_primary ? 'Principal' : 'Secundária'}
                        </Badge>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="col-span-full py-12 text-center text-muted-foreground bg-slate-50 rounded-2xl border-2 border-dashed">
                    Nenhuma embarcação cadastrada.
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="documentos" className="pt-4">
              <Card className="rounded-[2rem] border-2 shadow-sm">
                <CardContent className="p-0">
                  <div className="divide-y-2">
                    {profile.user_documents && profile.user_documents.length > 0 ? (
                      profile.user_documents.map((doc: any) => (
                        <div key={doc.id} className="p-4 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">
                              <FileText className="text-slate-500" />
                            </div>
                            <div>
                              <p className="font-bold text-sm">{doc.category_id}</p>
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
                        Nenhum documento anexado.
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="saidas" className="pt-4">
               <Card className="rounded-[2rem] border-2 shadow-sm">
                <CardContent className="p-0">
                  <div className="divide-y-2">
                    {profile.fishing_trips && profile.fishing_trips.length > 0 ? (
                      profile.fishing_trips.slice(0, 5).map((trip: any) => (
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
                        Nenhuma saída registrada.
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
