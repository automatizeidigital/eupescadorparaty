import { createFileRoute, Link } from '@tanstack/react-router'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useQuery } from "@tanstack/react-query"
import { getTides } from "@/lib/tide.functions"
import { getNotices } from "@/lib/notices.functions"
import { getProfile } from "@/lib/profiles.functions"
import { getActiveTrip } from "@/lib/map.functions"
import { evaluateTripMonitoring } from "@/lib/trip-monitoring.functions"
import { SOSModal } from "@/components/emergency/SOSModal"
import { useState } from "react"
import { 
  CloudSun, 
  Map, 
  AlertTriangle, 
  Bell, 
  User,
  ChevronRight,
  Waves,
  ArrowUp,
  ArrowDown,
  ShieldAlert,
  Megaphone,
  Anchor,
  Clock
} from "lucide-react"
import { TideData } from '@/lib/tide.types'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog"

export const Route = createFileRoute('/app/')({
  head: () => ({
    meta: [
      { title: "Meu Painel - EU PESCADOR!" },
      { name: "description", content: "Dashboard do pescador de Paraty: SOS, Mapa, Clima e Avisos em um só lugar." },
      { property: "og:title", content: "Meu Painel - EU PESCADOR!" },
      { property: "og:description", content: "Acesse as principais ferramentas para sua segurança no mar em Paraty." },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AppDashboard,
})

function AppDashboard() {
  const { data: profile } = useQuery({
    queryKey: ['profile'],
    queryFn: () => getProfile(),
  })
  const userName = profile?.full_name?.split(' ')[0] ?? "Pescador"
  const { data: activeTrip } = useQuery({ queryKey: ['active-trip'], queryFn: () => getActiveTrip() })
  const [isSOSOpen, setIsSOSOpen] = useState(false)

  return (
    <div className="p-6 space-y-8 max-w-[430px] mx-auto">
      <SOSModal 
        isOpen={isSOSOpen} 
        onClose={() => setIsSOSOpen(false)} 
        profile={profile}
        activeTrip={activeTrip}
      />
      <header className="space-y-1">
        <h2 className="text-3xl font-bold">Olá, {userName} 👋</h2>
        <p className="text-xl text-muted-foreground font-medium">Como está o mar hoje?</p>
      </header>

      <div className="grid grid-cols-1 gap-6">
        {/* Widget de Saída Ativa */}
        <ActiveTripWidget />

        {/* Resumo de Maré na Home */}
        <TideHomeCard />

        {/* Card 1: HOJE NO MAR */}
        <Card className="border-2 rounded-[2rem] overflow-hidden shadow-md">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="h-16 w-16 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">
              <CloudSun size={36} />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-xl font-bold uppercase tracking-tight">Hoje no mar</h3>
              <p className="text-muted-foreground text-sm truncate">Tempo, vento, chuva e maré.</p>
            </div>
            <Button asChild size="icon" variant="ghost" className="rounded-full h-12 w-12">
              <Link to="/app/hoje">
                <ChevronRight size={32} className="text-primary" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* Card 2: MEU MAPA */}
        <Card className="border-2 rounded-[2rem] overflow-hidden shadow-md">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="h-16 w-16 rounded-2xl bg-green-100 flex items-center justify-center text-green-600 shrink-0">
              <Map size={36} />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-xl font-bold uppercase tracking-tight">Meu mapa</h3>
              <p className="text-muted-foreground text-sm truncate">Sua localização e segurança.</p>
            </div>
            <Button asChild size="icon" variant="ghost" className="rounded-full h-12 w-12">
              <Link to="/app/mapa">
                <ChevronRight size={32} className="text-primary" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* Card 3: SOS (Destacado) */}
        <Card 
          className="bg-destructive border-none rounded-[2rem] overflow-hidden shadow-xl cursor-pointer active:scale-[0.98] transition-transform"
          onClick={() => setIsSOSOpen(true)}
        >
          <CardContent className="p-8 flex flex-col items-center text-center text-destructive-foreground space-y-2">
            <ShieldAlert size={48} strokeWidth={2.5} />
            <h3 className="text-2xl font-black uppercase tracking-tighter">SOS</h3>
            <p className="text-lg font-bold opacity-90">Precisa de ajuda?</p>
            <div className="mt-2 px-6 py-3 bg-white/20 rounded-full font-black text-sm uppercase tracking-widest">
              PEDIR SOCORRO
            </div>
          </CardContent>
        </Card>

        {/* Card 4: AVISOS */}
        <NoticeHomeCard />

        {/* Card 5: MINHA ÁREA */}
        <Card className="border-2 rounded-[2rem] overflow-hidden shadow-md">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="h-16 w-16 rounded-2xl bg-purple-100 flex items-center justify-center text-purple-600 shrink-0">
              <User size={36} />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-xl font-bold uppercase tracking-tight">Minha área</h3>
              <p className="text-muted-foreground text-sm truncate">Cadastro e embarcação.</p>
            </div>
            <Button asChild size="icon" variant="ghost" className="rounded-full h-12 w-12">
              <Link to="/app/perfil">
                <ChevronRight size={32} className="text-primary" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function TideHomeCard() {
  const { data: tide } = useQuery<TideData>({
    queryKey: ['tide-home'],
    queryFn: () => getTides({ data: {} }),
    staleTime: 1000 * 60 * 30,
  })

  if (!tide) return null

  return (
    <Card className="border-2 rounded-[2rem] overflow-hidden shadow-md bg-blue-50/30">
      <CardContent className="p-6 flex items-center gap-4">
        <div className="h-16 w-16 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">
          <Waves size={36} />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-xl font-bold uppercase tracking-tight flex items-center gap-2">
            Maré
            {tide.current_state === 'rising' || tide.current_state === 'high' ? 
              <ArrowUp size={16} className="text-blue-500" /> : 
              <ArrowDown size={16} className="text-orange-500" />
            }
          </h3>
          <p className="text-muted-foreground text-sm truncate font-medium">
            {tide.current_state === 'rising' ? 'Enchendo' : 
             tide.current_state === 'falling' ? 'Vazando' : 
             tide.current_state === 'high' ? 'Maré Alta' : 'Maré Baixa'}
            {tide.next_high_tide && ` • Próxima alta: ${(tide.next_high_tide.time.split('T')[1] ?? '').substring(0, 5)}`}
          </p>
        </div>
        <Button asChild size="icon" variant="ghost" className="rounded-full h-12 w-12">
          <Link to="/app/mare">
            <ChevronRight size={32} className="text-primary" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  )
}

function NoticeHomeCard() {
  const { data: notices } = useQuery({
    queryKey: ['notices-home'],
    queryFn: () => getNotices({ data: { limit: 3 } }),
    staleTime: 1000 * 60 * 5,
  })

  const latestNotice = notices && notices.length > 0 ? notices[0] : null
  const hasCritical = notices?.some(n => n.priority === 'critical')

  return (
    <Card className={`border-2 rounded-[2rem] overflow-hidden shadow-md transition-colors ${hasCritical ? 'bg-destructive/5 border-destructive/20' : ''}`}>
      <CardContent className="p-6 flex items-center gap-4">
        <div className={`h-16 w-16 rounded-2xl flex items-center justify-center shrink-0 ${
          hasCritical ? 'bg-destructive/10 text-destructive' : 'bg-orange-100 text-orange-600'
        }`}>
          {hasCritical ? <Megaphone size={36} className="animate-pulse" /> : <Bell size={36} />}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-xl font-bold uppercase tracking-tight flex items-center gap-2">
            Avisos
            {hasCritical && <span className="flex h-2 w-2 rounded-full bg-destructive animate-ping" />}
          </h3>
          <p className="text-muted-foreground text-sm truncate font-medium">
            {latestNotice ? latestNotice.title : 'Informações da Secretaria.'}
          </p>
        </div>
        <Button asChild size="icon" variant="ghost" className="rounded-full h-12 w-12">
          <Link to="/app/avisos">
            <ChevronRight size={32} className="text-primary" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  )
}

function ActiveTripWidget() {
  const { data: activeTrip } = useQuery({
    queryKey: ['active-trip-widget'],
    queryFn: () => getActiveTrip(),
    staleTime: 1000 * 60,
  })

  if (!activeTrip) return null

  const monitoring = evaluateTripMonitoring(activeTrip)
  
  const getDisplay = () => {
    if (monitoring.status.includes('overdue')) {
      return {
        bg: 'bg-destructive/10 border-destructive/20',
        icon: AlertTriangle,
        iconColor: 'text-destructive',
        title: 'ATRASO IDENTIFICADO',
        subtitle: 'Você ainda está no mar?',
        textColor: 'text-destructive'
      }
    }
    if (monitoring.status === 'return_approaching') {
      return {
        bg: 'bg-orange-50 border-orange-200',
        icon: Clock,
        iconColor: 'text-orange-500',
        title: 'RETORNO PRÓXIMO',
        subtitle: 'Fique atento ao horário.',
        textColor: 'text-orange-700'
      }
    }
    return {
      bg: 'bg-primary/5 border-primary/20',
      icon: Anchor,
      iconColor: 'text-primary',
      title: 'ESTOU NO MAR',
      subtitle: 'Saída ativa monitorada.',
      textColor: 'text-primary'
    }
  }

  const display = getDisplay()

  return (
    <Card className={`border-2 rounded-[2rem] overflow-hidden shadow-md transition-colors ${display.bg}`}>
      <CardContent className="p-6 flex items-center gap-4">
        <div className={`h-16 w-16 rounded-2xl flex items-center justify-center shrink-0 bg-white shadow-sm ${display.iconColor}`}>
          <display.icon size={36} />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className={`text-xl font-black uppercase tracking-tight ${display.textColor}`}>
            {display.title}
          </h3>
          <p className="text-muted-foreground text-sm truncate font-medium">
            {display.subtitle}
          </p>
        </div>
        <Button asChild size="icon" variant="ghost" className="rounded-full h-12 w-12">
          <Link to="/app/mapa">
            <ChevronRight size={32} className="text-primary" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  )
}
