import { createFileRoute, Link } from '@tanstack/react-router'
import { useQuery } from "@tanstack/react-query"
import { getTides } from "@/lib/tide.functions"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  Waves, 
  ArrowUp, 
  ArrowDown, 
  Clock, 
  MapPin, 
  Calendar,
  RefreshCw,
  Info
} from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { format, parseISO } from "date-fns"
import { ptBR } from "date-fns/locale"
import { useState } from 'react'
import { TideData, TideEvent } from '@/lib/tide.types'

export const Route = createFileRoute('/app/mare')({
  head: () => ({
    meta: [
      { title: "Tábua de Maré - Porto de Paraty | EU PESCADOR!" },
      { name: "description", content: "Previsão de maré alta e baixa para o Porto de Paraty - RJ." },
      { property: "og:title", content: "Tábua de Maré - Porto de Paraty" },
      { property: "og:description", content: "Consulte os horários e alturas das marés em Paraty." },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: TábuaDeMaré,
})

function TábuaDeMaré() {
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'))
  
  const { data: tide, isLoading, isError, refetch } = useQuery<TideData>({
    queryKey: ['tide-data', selectedDate],
    queryFn: () => getTides({ data: { date: selectedDate } }),
    staleTime: 1000 * 60 * 30, // 30 minutos
  })

  const getStateInfo = (state: string) => {
    switch (state) {
      case 'rising': return { label: 'Enchendo', icon: <ArrowUp className="text-blue-500" />, color: 'text-blue-600' };
      case 'falling': return { label: 'Vazando', icon: <ArrowDown className="text-orange-500" />, color: 'text-orange-600' };
      case 'high': return { label: 'Maré Alta', icon: <ArrowUp className="text-green-500" />, color: 'text-green-600' };
      case 'low': return { label: 'Maré Baixa', icon: <ArrowDown className="text-red-500" />, color: 'text-red-600' };
      default: return { label: 'Sem dados', icon: null, color: 'text-muted-foreground' };
    }
  }

  if (isLoading) {
    return (
      <div className="p-6 space-y-6 max-w-[430px] mx-auto">
        <Skeleton className="h-10 w-48 rounded-lg" />
        <Skeleton className="h-48 w-full rounded-[2.5rem]" />
        <div className="space-y-4">
          <Skeleton className="h-20 w-full rounded-2xl" />
          <Skeleton className="h-20 w-full rounded-2xl" />
        </div>
      </div>
    )
  }

  if (isError || !tide) {
    return (
      <div className="p-6 text-center space-y-4">
        <Waves className="mx-auto h-12 w-12 text-muted-foreground opacity-20" />
        <p className="text-muted-foreground">Não foi possível carregar a tábua de maré.</p>
        <Button onClick={() => refetch()}>Tentar novamente</Button>
      </div>
    )
  }

  const stateInfo = getStateInfo(tide.current_state)
  const isToday = selectedDate === format(new Date(), 'yyyy-MM-dd')

  return (
    <div className="p-6 space-y-8 max-w-[430px] mx-auto pb-12">
      <header className="space-y-2">
        <h2 className="text-3xl font-black uppercase tracking-tighter">Tábua de Maré</h2>
        <div className="flex flex-col gap-1 text-sm font-bold text-muted-foreground uppercase tracking-widest">
          <div className="flex items-center gap-1">
            <MapPin size={14} />
            Estação: {tide.station_name}
          </div>
          <div className="flex items-center gap-1 opacity-70">
            <Calendar size={14} />
            Dados para: {format(parseISO(tide.date), "dd 'de' MMMM", { locale: ptBR })}
          </div>
        </div>
      </header>

      {/* Card Principal: Maré Agora */}
      {isToday && (
        <Card className="border-4 border-primary/20 rounded-[2.5rem] shadow-xl overflow-hidden bg-primary/5">
          <CardContent className="p-8 flex flex-col items-center text-center space-y-4">
            <div className="flex flex-col items-center gap-2">
              <span className="text-sm font-black text-primary uppercase tracking-[0.2em]">Maré Agora</span>
              <div className="flex items-center gap-3">
                {stateInfo.icon}
                <span className={`text-4xl font-black tracking-tighter ${stateInfo.color}`}>
                  {stateInfo.label}
                </span>
              </div>
            </div>

            <div className="w-full h-px bg-primary/10 my-2" />

            <div className="grid grid-cols-2 gap-8 w-full">
              {tide.next_high_tide && (
                <div className="flex flex-col items-center gap-1">
                  <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Próxima Alta</span>
                  <span className="text-xl font-black">{format(parseISO(tide.next_high_tide.time), 'HH:mm')}</span>
                  <span className="text-xs font-bold text-blue-600">{tide.next_high_tide.height_m} m</span>
                </div>
              )}
              {tide.next_low_tide && (
                <div className="flex flex-col items-center gap-1">
                  <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Próxima Baixa</span>
                  <span className="text-xl font-black">{format(parseISO(tide.next_low_tide.time), 'HH:mm')}</span>
                  <span className="text-xs font-bold text-orange-600">{tide.next_low_tide.height_m} m</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Lista de Eventos do Dia */}
      <section className="space-y-4">
        <h3 className="text-xl font-black uppercase tracking-tighter flex items-center gap-2">
          <Clock size={20} className="text-primary" /> Eventos do Dia
        </h3>
        <div className="space-y-3">
          {tide.events.map((event: TideEvent, idx: number) => (
            <Card key={idx} className="border-2 rounded-2xl overflow-hidden shadow-sm">
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`p-2 rounded-xl ${event.type === 'high' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                    {event.type === 'high' ? <ArrowUp size={20} /> : <ArrowDown size={20} />}
                  </div>
                  <div>
                    <p className="text-lg font-black">{format(parseISO(event.time), 'HH:mm')}</p>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                      Maré {event.type === 'high' ? 'Alta' : 'Baixa'}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xl font-black text-primary">{event.height_m} m</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Aviso Gráfico Aproximado */}
      <div className="bg-blue-50 p-4 rounded-2xl flex gap-3 items-start border border-blue-100">
        <Info size={20} className="text-blue-500 shrink-0 mt-0.5" />
        <p className="text-[10px] font-medium text-blue-700 leading-relaxed uppercase tracking-wider">
          O gráfico e horários representam previsões oficiais. As alturas reais podem variar devido a condições meteorológicas.
        </p>
      </div>

      <footer className="space-y-4 pt-4 border-t border-muted">
        <div className="flex justify-between items-center text-[10px] font-black text-muted-foreground uppercase tracking-widest opacity-60">
          <span>Fonte: {tide.source}</span>
          <span>Atualizado às {format(parseISO(tide.updated_at), 'HH:mm')}</span>
        </div>
        <Button 
          variant="outline" 
          className="w-full rounded-2xl border-2 font-black uppercase tracking-widest h-12"
          onClick={() => refetch()}
        >
          <RefreshCw size={16} className="mr-2" /> Atualizar Tábua
        </Button>
      </footer>
    </div>
  )
}
