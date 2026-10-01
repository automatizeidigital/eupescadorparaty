import { createFileRoute, Link } from '@tanstack/react-router'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getAdminTripById } from '@/lib/admin.functions'
import { getTripTimeline, evaluateTripMonitoring, logAdminContactAttempt } from '@/lib/trip-monitoring.functions'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Waves, Clock, Ship, User, MapPin, 
  Phone, AlertTriangle, CheckCircle2, 
  History, MessageSquare, ShieldAlert
} from 'lucide-react'
import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { MapProvider } from '@/components/map/MapProvider'
import { GoogleMapsProvider } from '@/components/map/GoogleMapsProvider'
import { MapMarker } from '@/components/map/MapMarker'

export const Route = createFileRoute('/admin/saidas/$id/acompanhamento')({
  component: AdminTripMonitoring,
})

function AdminTripMonitoring() {
  const { id } = Route.useParams()
  const queryClient = useQueryClient()
  const [contactNotes, setContactNotes] = useState('')

  const { data: trip, isLoading: isLoadingTrip } = useQuery({
    queryKey: ['admin-trip', id],
    queryFn: () => getAdminTripById({ data: { id } }),
  })

  const { data: timeline, isLoading: isLoadingTimeline } = useQuery({
    queryKey: ['trip-timeline', id],
    queryFn: () => getTripTimeline({ data: { tripId: id } }),
  })

  const contactMutation = useMutation({
    mutationFn: () => logAdminContactAttempt({ data: { tripId: id, notes: contactNotes } }),
    onSuccess: () => {
      toast.success("Tentativa de contato registrada.");
      setContactNotes('');
      queryClient.invalidateQueries({ queryKey: ['trip-timeline', id] });
    }
  })

  if (isLoadingTrip || !trip) return <div className="p-8">Carregando dados da saída...</div>

  const monitoring = evaluateTripMonitoring(trip)
  const lastLocation = trip.trip_locations && trip.trip_locations.length > 0 ? trip.trip_locations[0] : null
  const paratyCenter = lastLocation ? { lat: lastLocation.latitude, lng: lastLocation.longitude } : { lat: -23.2209, lng: -44.7171 }
  const sos = trip.emergency_incidents?.find((i: any) => i.status === 'open')

  return (
    <div className="space-y-8 pb-12">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link to="/admin/saidas">
            <Button variant="ghost" size="sm" className="rounded-xl">Voltar</Button>
          </Link>
          <h1 className="text-3xl font-black uppercase tracking-tight">Acompanhamento</h1>
        </div>
        {sos && (
          <Badge className="bg-destructive text-white px-6 py-2 rounded-full font-black animate-pulse border-none">
            <ShieldAlert className="mr-2" size={18} /> SOS ATIVO
          </Badge>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Coluna 1: Status e Ações */}
        <div className="space-y-6">
          <Card className={`border-none rounded-[2rem] shadow-xl overflow-hidden ${
            monitoring.status === 'needs_attention' ? 'bg-destructive/10' : 
            monitoring.status.includes('overdue') ? 'bg-orange-50' : 'bg-primary/5'
          }`}>
            <CardContent className="p-8 space-y-6">
              <div className="text-center space-y-2">
                <div className={`mx-auto w-20 h-20 rounded-full flex items-center justify-center bg-white shadow-md ${
                  monitoring.status === 'needs_attention' ? 'text-destructive' : 
                  monitoring.status.includes('overdue') ? 'text-orange-500' : 'text-primary'
                }`}>
                  {monitoring.status === 'needs_attention' ? <AlertTriangle size={40} /> : <Ship size={40} />}
                </div>
                <h3 className="text-2xl font-black uppercase tracking-tight mt-4">
                  {monitoring.status === 'needs_attention' ? 'ATENÇÃO CRÍTICA' : 
                   monitoring.status.includes('overdue') ? 'SAÍDA EM ATRASO' : 'SAÍDA NO HORÁRIO'}
                </h3>
                <p className="text-muted-foreground font-medium italic">
                  Protocolo: {trip.id.substring(0, 8).toUpperCase()}
                </p>
              </div>

              <div className="space-y-4 pt-4">
                <div className="flex justify-between items-center text-sm font-bold border-b pb-2">
                  <span className="text-muted-foreground">Retorno Previsto</span>
                  <span>{new Date(trip.expected_return_at || '').toLocaleString()}</span>
                </div>
                {monitoring.delayMinutes > 0 && (
                  <div className="flex justify-between items-center text-sm font-black text-destructive border-b pb-2">
                    <span>Atraso Atual</span>
                    <span>{monitoring.delayMinutes} minutos</span>
                  </div>
                )}
                <div className="flex justify-between items-center text-sm font-bold border-b pb-2">
                  <span className="text-muted-foreground">Comunicação</span>
                  <Badge variant={monitoring.locationFreshness === 'fresh' ? 'default' : 'secondary'}>
                    {monitoring.locationFreshness === 'fresh' ? 'ONLINE' : 'OFFLINE'}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-[2rem] border-2 shadow-sm overflow-hidden">
            <CardContent className="p-6 space-y-4">
              <h4 className="font-black uppercase text-sm tracking-widest flex items-center gap-2">
                <Phone size={18} className="text-primary" /> Contatos
              </h4>
              <div className="space-y-3">
                <div className="p-4 bg-slate-50 rounded-2xl">
                  <div className="text-[10px] font-black uppercase text-slate-400 mb-1">Pescador</div>
                  <div className="font-bold">{trip.profiles?.full_name}</div>
                  <div className="text-sm text-primary font-bold">{trip.profiles?.phone}</div>
                </div>
                <div className="p-4 bg-orange-50/50 rounded-2xl border border-orange-100">
                  <div className="text-[10px] font-black uppercase text-orange-400 mb-1">Emergência</div>
                  <div className="font-bold">{trip.profiles?.emergency_contact_name || 'Não informado'}</div>
                  <div className="text-sm text-destructive font-bold">{trip.profiles?.emergency_contact_phone || '---'}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-[2rem] border-2 shadow-sm overflow-hidden">
            <CardContent className="p-6 space-y-4">
              <h4 className="font-black uppercase text-sm tracking-widest flex items-center gap-2">
                <MessageSquare size={18} className="text-primary" /> Registro de Contato
              </h4>
              <div className="space-y-3">
                <Input 
                  placeholder="Descreva a tentativa de contato..." 
                  value={contactNotes}
                  onChange={(e) => setContactNotes(e.target.value)}
                  className="rounded-xl"
                />
                <Button 
                  onClick={() => contactMutation.mutate()}
                  disabled={!contactNotes || contactMutation.isPending}
                  className="w-full rounded-xl font-bold uppercase text-xs tracking-widest"
                >
                  REGISTRAR TENTATIVA
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Coluna 2: Mapa e Detalhes */}
        <div className="space-y-6 lg:col-span-2">
          <Card className="rounded-[2rem] border-2 shadow-sm overflow-hidden min-h-[400px]">
            <CardContent className="p-0 relative h-full">
              <MapProvider apiKey={import.meta.env['VITE_GOOGLE_MAPS_API_KEY'] as string}>
                <GoogleMapsProvider
                  center={paratyCenter}
                  zoom={14}
                  className="w-full h-[400px]"
                  offlineScope={`trip-${trip.id}`}
                  offlinePoints={lastLocation ? [{
                    id: trip.id,
                    lat: lastLocation.latitude,
                    lng: lastLocation.longitude,
                    label: trip.profiles?.full_name || 'Embarcação',
                    tone: 'normal',
                    recordedAt: lastLocation.recorded_at ?? undefined,
                  }] : []}
                >

                  {lastLocation && (
                    <MapMarker 
                      position={{ lat: lastLocation.latitude, lng: lastLocation.longitude }}
                      title={trip.profiles?.full_name || ''}
                    />
                  )}
                </GoogleMapsProvider>
              </MapProvider>
              
              <div className="absolute top-4 right-4 z-10">
                <Badge className="bg-white/90 text-slate-900 shadow-md backdrop-blur-sm border-none font-bold">
                  <MapPin size={14} className="mr-1 text-primary" />
                  Última posição: {lastLocation ? new Date(lastLocation.recorded_at).toLocaleTimeString() : 'Sem sinal'}
                </Badge>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="rounded-[2.5rem] border-2 shadow-sm">
              <CardContent className="p-6 space-y-4">
                <h4 className="font-black uppercase text-sm tracking-widest flex items-center gap-2">
                  <Ship size={18} className="text-primary" /> Embarcação & Destino
                </h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-sm border-b pb-2">
                    <span className="text-muted-foreground font-medium">Nome</span>
                    <span className="font-bold">{trip.boats?.name}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm border-b pb-2">
                    <span className="text-muted-foreground font-medium">Registro</span>
                    <span className="font-bold">{trip.boats?.registration_number}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm border-b pb-2">
                    <span className="text-muted-foreground font-medium">Tripulação</span>
                    <span className="font-bold">{trip.crew_count} pessoas</span>
                  </div>
                  <div className="pt-2">
                    <div className="text-[10px] font-black uppercase text-slate-400 mb-1">Destino Informado</div>
                    <div className="text-sm font-medium">{trip.destination_description || 'Área de pesca costeira'}</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-[2.5rem] border-2 shadow-sm">
              <CardContent className="p-6 space-y-4">
                <h4 className="font-black uppercase text-sm tracking-widest flex items-center gap-2">
                  <History size={18} className="text-primary" /> Timeline da Saída
                </h4>
                <div className="space-y-4 max-h-[250px] overflow-y-auto pr-2 custom-scrollbar">
                  {isLoadingTimeline ? (
                    <div className="text-center text-xs text-muted-foreground">Carregando timeline...</div>
                  ) : timeline?.length === 0 ? (
                    <div className="text-center text-xs text-muted-foreground">Nenhum evento registrado.</div>
                  ) : timeline?.map((event: any) => (
                    <div key={event.id} className="flex gap-3 relative pb-2">
                      <div className="mt-1 w-2 h-2 rounded-full bg-primary shrink-0 z-10 shadow-[0_0_0_4px_rgba(var(--primary-rgb),0.1)]" />
                      <div className="space-y-0.5">
                        <div className="text-xs font-black uppercase tracking-tighter">
                          {event.event_type.replace(/_/g, ' ')}
                        </div>
                        <div className="text-[10px] text-muted-foreground font-medium">
                          {new Date(event.created_at).toLocaleString()}
                        </div>
                        {event.metadata?.reason && (
                          <div className="text-[10px] bg-slate-100 p-2 rounded-lg mt-1 italic">
                            "{event.metadata.reason}"
                          </div>
                        )}
                        {event.metadata?.notes && (
                          <div className="text-[10px] bg-orange-50 text-orange-700 p-2 rounded-lg mt-1 border border-orange-100 font-bold">
                            Nota Admin: {event.metadata.notes}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
