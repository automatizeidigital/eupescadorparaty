import { createFileRoute } from '@tanstack/react-router'
import { MapProvider } from '@/components/map/MapProvider'
import { GoogleMapsProvider } from '@/components/map/GoogleMapsProvider'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Map as MapIcon, Filter, Search } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { getAdminTrips, getFleetPositions } from '@/lib/admin.functions'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'


export const Route = createFileRoute('/admin/mapa')({
  component: AdminMapa,
})

function AdminMapa() {
  const paratyCenter = { lat: -23.2209, lng: -44.7171 }

  const { data: activeTrips } = useQuery({
    queryKey: ['admin-trips-active'],
    queryFn: () => getAdminTrips({ data: { status: 'active' } }),
  })

  const { data: fleetPositions } = useQuery({
    queryKey: ['admin-fleet-positions'],
    queryFn: () => getFleetPositions(),
    // Mantém a última resposta em cache para leitura offline do mapa.
    gcTime: 1000 * 60 * 60 * 24,
    staleTime: 1000 * 60,
  })

  // Últimas posições conhecidas, persistidas para leitura offline.
  const offlinePoints = (fleetPositions ?? []).map((p) => ({
    id: p.trip_id,
    lat: p.latitude,
    lng: p.longitude,
    label: p.label,
    tone: 'normal' as const,
    recordedAt: p.recorded_at,
  }))



  return (

    <div className="h-[calc(100vh-12rem)] flex flex-col space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-black uppercase tracking-tight flex items-center gap-3">
          <MapIcon className="h-8 w-8 text-primary" />
          Mapa Operacional
        </h1>
        <div className="flex gap-2">
          <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-green-200">
            🟢 Saídas Ativas
          </Badge>
          <Badge className="bg-red-100 text-red-700 hover:bg-red-100 border-red-200">
            🔴 SOS Ativos
          </Badge>
        </div>
      </div>
      
      <div className="bg-white p-4 rounded-2xl border-2 flex flex-wrap gap-4 items-center shadow-sm">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input placeholder="Buscar pescador ou barco..." className="pl-10 rounded-xl" />
        </div>
        <Select defaultValue="all">
          <SelectTrigger className="w-48 rounded-xl">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os Status</SelectItem>
            <SelectItem value="normal">🟢 Normal</SelectItem>
            <SelectItem value="overdue">🟠 Atraso</SelectItem>
            <SelectItem value="sos">🔴 SOS</SelectItem>
          </SelectContent>
        </Select>
        <Select defaultValue="all">
          <SelectTrigger className="w-48 rounded-xl">
            <SelectValue placeholder="Comunidade" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas Comunidades</SelectItem>
            <SelectItem value="trindade">Trindade</SelectItem>
            <SelectItem value="tarituba">Tarituba</SelectItem>
            <SelectItem value="praia-grande">Praia Grande</SelectItem>
          </SelectContent>
        </Select>
      </div>


      <div className="flex-1 rounded-[2.5rem] overflow-hidden border-4 border-white shadow-2xl relative bg-muted">
        <MapProvider apiKey={import.meta.env['VITE_GOOGLE_MAPS_API_KEY'] as string}>
          <GoogleMapsProvider 
            center={paratyCenter} 
            zoom={13} 
            className="h-full w-full"
            offlineScope="admin-fleet"
            offlinePoints={offlinePoints}
          >
            {/* Markers will be added here once data is fetched */}
          </GoogleMapsProvider>
        </MapProvider>
        
        <div className="absolute bottom-6 right-6 z-10 space-y-2 max-w-xs">
          <Card className="rounded-2xl border-none shadow-xl bg-white/90 backdrop-blur-sm">
            <CardContent className="p-4 space-y-3">
              <h4 className="font-bold text-sm uppercase tracking-wider text-slate-500">Monitoramento</h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Saídas no mar</span>
                  <span className="font-black text-primary">{activeTrips?.length || 0}</span>

                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-destructive">SOS Ativos</span>
                  <span className="font-black text-destructive">--</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
