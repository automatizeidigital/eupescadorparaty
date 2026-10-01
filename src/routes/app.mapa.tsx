import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { SOSModal } from "@/components/emergency/SOSModal"
import { ShieldAlert, Ship, Navigation, Anchor } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { getActiveTrip, endTrip } from "@/lib/map.functions"
import { ActiveTripStatus } from "@/components/trip/ActiveTripStatus"
import { toast } from "sonner"

export const Route = createFileRoute('/app/mapa')({
  head: () => ({
    meta: [
      { title: "Mapa de Navegação e Segurança - Paraty | EU PESCADOR!" },
      { name: "description", content: "Visualize sua localização e áreas de pesca com segurança na costa de Paraty." },
      { property: "og:title", content: "Mapa de Navegação - EU PESCADOR!" },
      { property: "og:description", content: "Monitore sua posição e garanta uma pesca segura." },
    ],
  }),
  component: MapaPage,
})

function MapaPage() {
  const [isSOSOpen, setIsSOSOpen] = useState(false)
  const queryClient = useQueryClient()
  
  const { data: activeTrip, isLoading } = useQuery({
    queryKey: ['active-trip'],
    queryFn: () => getActiveTrip(),
  })

  const endTripMutation = useMutation({
    mutationFn: (tripId: string) => endTrip({ data: { trip_id: tripId } }),
    onSuccess: () => {
      toast.success("Viagem finalizada com sucesso!");
      queryClient.invalidateQueries({ queryKey: ['active-trip'] });
    }
  })

  return (
    <div className="relative h-[calc(100vh-80px)] w-full flex flex-col">
      <SOSModal isOpen={isSOSOpen} onClose={() => setIsSOSOpen(false)} />
      
      {activeTrip ? (
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="flex items-center gap-3">
            <Anchor className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-black uppercase tracking-tight">Estou no Mar</h1>
          </div>

          <ActiveTripStatus 
            trip={activeTrip as any} 
            onTripEnd={() => endTripMutation.mutate(activeTrip.id)}
          />

          <div className="bg-slate-50 rounded-[2rem] p-8 text-center border-2 border-dashed border-slate-200 space-y-4">
            <div className="mx-auto w-16 h-16 bg-white rounded-full flex items-center justify-center text-slate-300 shadow-sm">
              <Navigation size={32} />
            </div>
            <div className="space-y-1">
              <h4 className="font-bold text-slate-500 uppercase tracking-wider">Mapa de Navegação</h4>
              <p className="text-sm text-slate-400 font-medium">Visualização cartográfica em desenvolvimento para a costa de Paraty.</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-6">
          <div className="w-24 h-24 bg-primary/10 rounded-[2rem] flex items-center justify-center text-primary">
            <Ship size={48} />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-black uppercase tracking-tight">Nenhuma saída ativa</h2>
            <p className="text-muted-foreground font-medium">Você não possui nenhuma saída para o mar registrada no momento.</p>
          </div>
          <Button asChild className="rounded-2xl h-14 px-8 font-black uppercase tracking-widest text-lg shadow-lg">
            <a href="/app">INICIAR NOVA SAÍDA</a>
          </Button>
        </div>
      )}
      
      {/* Botão SOS flutuante no Mapa */}
      <Button
        variant="destructive"
        size="lg"
        className="fixed bottom-24 right-6 h-20 w-20 rounded-full shadow-2xl z-50 flex flex-col items-center border-4 border-white active:scale-95 transition-transform"
        onClick={() => setIsSOSOpen(true)}
      >
        <ShieldAlert size={28} />
        <span className="text-[10px] font-black uppercase">SOS</span>
      </Button>
    </div>
  )
}
