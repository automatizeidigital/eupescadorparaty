import { createFileRoute, Link } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { getAdminTripById } from '@/lib/admin.functions'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Navigation, Anchor, Clock, MapPin, 
  Users, Ship, ArrowLeft, History
} from 'lucide-react'
import { MapProvider } from '@/components/map/MapProvider'
import { GoogleMapsProvider } from '@/components/map/GoogleMapsProvider'

export const Route = createFileRoute('/admin/saidas/$id')({
  component: TripDetail,
})

function TripDetail() {
  const { id } = Route.useParams()

  const { data: trip, isLoading } = useQuery({
    queryKey: ['admin-trip', id],
    queryFn: () => getAdminTripById({ data: { id } }),
  })

  if (isLoading) return <div className="p-8 text-center">Carregando detalhes da viagem...</div>
  if (!trip) return <div className="p-8 text-destructive text-center font-bold">Viagem não encontrada.</div>

  const lastLocation = trip.trip_locations && trip.trip_locations.length > 0 
    ? trip.trip_locations[0] 
    : null;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/admin/saidas">
          <Button variant="ghost" size="icon" className="rounded-full">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="text-3xl font-black uppercase tracking-tight">
          Detalhes da Saída
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <Card className="rounded-[2rem] border-2 shadow-sm overflow-hidden">
            <CardHeader className="bg-slate-50 border-b">
              <div className="flex justify-between items-start">
                <Badge variant={trip.status === 'active' ? 'default' : 'secondary'} className="rounded-lg">
                  {trip.status}
                </Badge>
                <div className="text-right">
                  <p className="text-[10px] font-black uppercase text-slate-400">Início</p>
                  <p className="text-sm font-bold">{new Date(trip.started_at).toLocaleString('pt-BR')}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                  <Navigation size={24} />
                </div>
                <div>
                  <h3 className="font-black uppercase text-sm text-slate-500">Destino</h3>
                  <p className="text-lg font-bold">{trip.destination_description || 'Mar Aberto'}</p>
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Ship size={16} className="text-slate-400" />
                    <span className="text-sm font-bold">Embarcação</span>
                  </div>
                  <Link to="/admin/embarcacoes/$id" params={{ id: trip.boat_id }} className="text-sm font-medium text-primary hover:underline">
                    {trip.boats?.name || 'Ver Barco'}
                  </Link>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users size={16} className="text-slate-400" />
                    <span className="text-sm font-bold">Tripulação</span>
                  </div>
                  <span className="text-sm font-medium">{trip.crew_count} pessoas</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock size={16} className="text-slate-400" />
                    <span className="text-sm font-bold">Retorno Previsto</span>
                  </div>
                  <span className="text-sm font-medium">
                    {trip.expected_return_at ? new Date(trip.expected_return_at).toLocaleString('pt-BR') : '---'}
                  </span>
                </div>
              </div>

              <div className="pt-4 border-t">
                <h3 className="font-black uppercase text-sm text-slate-500 mb-2">Pescador Responsável</h3>
                <Link to="/admin/pescadores/$id" params={{ id: trip.user_id }} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                  <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center">
                    <Users size={16} className="text-slate-400" />
                  </div>
                  <div>
                    <p className="font-bold text-sm">{trip.profiles?.full_name || 'Desconhecido'}</p>
                    <p className="text-xs text-muted-foreground">{trip.profiles?.phone || ''}</p>
                  </div>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <Card className="rounded-[2rem] border-2 shadow-sm overflow-hidden h-[500px] relative">
            <MapProvider apiKey={import.meta.env['VITE_GOOGLE_MAPS_API_KEY'] as string}>
              <GoogleMapsProvider 
                center={lastLocation ? { lat: lastLocation.latitude, lng: lastLocation.longitude } : { lat: -23.2209, lng: -44.7171 }} 
                zoom={14} 
                className="h-full w-full"
              >
                {/* Visual trail could be added here using TripLocation points */}
              </GoogleMapsProvider>
            </MapProvider>
            <div className="absolute bottom-6 left-6 z-10">
              <Badge className="bg-white/90 text-slate-900 shadow-lg backdrop-blur-sm border-none py-2 px-4 rounded-xl flex items-center gap-2">
                <MapPin size={14} className="text-primary" />
                <span className="text-xs font-bold uppercase tracking-wider">Última Posição Registrada</span>
              </Badge>
            </div>
          </Card>

          <Card className="rounded-[2rem] border-2 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-black uppercase tracking-wider flex items-center gap-2">
                <History size={20} className="text-primary" />
                Histórico de Localização
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="max-h-[300px] overflow-y-auto divide-y-2">
                {trip.trip_locations && trip.trip_locations.length > 0 ? (
                  trip.trip_locations.map((loc: any) => (
                    <div key={loc.id} className="p-4 flex items-center justify-between hover:bg-slate-50">
                      <div className="flex items-center gap-3">
                        <div className="text-xs font-mono text-slate-400">
                          {new Date(loc.recorded_at).toLocaleTimeString('pt-BR')}
                        </div>
                        <div className="text-sm font-medium">
                          {loc.latitude.toFixed(6)}, {loc.longitude.toFixed(6)}
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-slate-500 font-bold">
                        <span>{loc.speed ? `${(loc.speed * 1.94384).toFixed(1)} nós` : '--'}</span>
                        <span>{loc.accuracy ? `±${loc.accuracy}m` : '--'}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-12 text-center text-muted-foreground italic">
                    Nenhum ponto de localização registrado nesta viagem.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
