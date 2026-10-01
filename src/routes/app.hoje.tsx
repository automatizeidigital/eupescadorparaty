import { createFileRoute, Link } from '@tanstack/react-router'
import { useQuery } from "@tanstack/react-query"
import { getMarineWeather } from "@/lib/weather.functions"
import { getTides } from "@/lib/tide.functions"
import { getNotices } from "@/lib/notices.functions"
import { evaluateMarineCondition } from "@/lib/weather.logic"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  CloudRain, 
  Wind, 
  Waves, 
  Eye, 
  Navigation,
  Thermometer,
  Clock,
  MapPin,
  AlertTriangle,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ChevronRight,
  ArrowUp,
  ArrowDown,
  Bell
} from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { format, parseISO } from "date-fns"
import { ptBR } from "date-fns/locale"
import { MarineWeatherData } from "@/lib/weather.types"
import { TideData } from "@/lib/tide.types"

export const Route = createFileRoute('/app/hoje')({
  head: () => ({
    meta: [
      { title: "Hoje no Mar - Paraty | EU PESCADOR!" },
      { name: "description", content: "Condições meteorológicas e marítimas em tempo real para a costa de Paraty." },
      { property: "og:title", content: "Hoje no Mar - Paraty" },
      { property: "og:description", content: "Veja se o mar está favorável para a pesca hoje em Paraty." },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: HojeNoMar,
})

function HojeNoMar() {
  const { data: weather, isLoading, error } = useQuery<MarineWeatherData>({
    queryKey: ['marine-weather'],
    queryFn: () => getMarineWeather({}),
    staleTime: 1000 * 60 * 10, // 10 minutos
    gcTime: 1000 * 60 * 60 * 24, // 24 horas (persiste no cache se offline)
  })

  if (isLoading) {
    return (
      <div className="p-6 space-y-6 max-w-[430px] mx-auto">
        <Skeleton className="h-10 w-48 rounded-lg" />
        <Skeleton className="h-40 w-full rounded-[2rem]" />
        <div className="grid grid-cols-2 gap-4">
          <Skeleton className="h-32 rounded-2xl" />
          <Skeleton className="h-32 rounded-2xl" />
        </div>
      </div>
    )
  }

  if (error || !weather) {
    return (
      <div className="p-6 text-center space-y-4">
        <AlertCircle className="mx-auto h-12 w-12 text-destructive" />
        <p className="text-muted-foreground">Não foi possível carregar os dados do mar.</p>
      </div>
    )
  }

  const condition = weather ? evaluateMarineCondition(weather) : { status: 'unknown', message: 'Dados meteorológicos indisponíveis' }

  const getConditionColor = (status: string) => {
    switch (status) {
      case 'favorable': return 'bg-green-100 text-green-700 border-green-200';
      case 'attention': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'adverse': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  }

  const getConditionIcon = (status: string) => {
    switch (status) {
      case 'favorable': return <CheckCircle2 size={32} />;
      case 'attention': return <AlertTriangle size={32} />;
      case 'adverse': return <AlertCircle size={32} />;
      default: return <HelpCircle size={32} />;
    }
  }

  const getConditionLabel = (status: string) => {
    switch (status) {
      case 'favorable': return 'FAVORÁVEL';
      case 'attention': return 'ATENÇÃO';
      case 'adverse': return 'CONDIÇÃO ADVERSA';
      default: return 'SEM DADOS';
    }
  }

  return (
    <div className="p-6 space-y-8 max-w-[430px] mx-auto pb-12">
      <header className="space-y-2">
        <h2 className="text-3xl font-black uppercase tracking-tighter">Hoje no mar</h2>
        <div className="flex flex-col gap-1 text-sm font-bold text-muted-foreground uppercase tracking-widest">
          <div className="flex items-center gap-1">
            <MapPin size={14} />
            {weather?.location_name ?? "Paraty - RJ"}
          </div>
          <div className="flex items-center gap-1 opacity-70">
            <Clock size={14} />
            Atualizado às {weather?.updated_at ? format(new Date(weather.updated_at), 'HH:mm', { locale: ptBR }) : '--:--'}
          </div>
        </div>
      </header>

      {/* Card Principal de Condição */}
      <Card className={`border-2 rounded-[2.5rem] shadow-xl overflow-hidden ${getConditionColor(condition.status)}`}>
        <CardContent className="p-8 text-center space-y-4">
          <div className="flex justify-center">
            {getConditionIcon(condition.status)}
          </div>
          <div className="space-y-1">
            <h3 className="text-2xl font-black tracking-tighter">
              {getConditionLabel(condition.status)}
            </h3>
            <p className="font-bold leading-tight opacity-90">
              {condition.message}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Grid de Detalhes */}
      <div className="grid grid-cols-2 gap-4">
        <WeatherDetailCard 
          icon={<Thermometer className="text-orange-500" />} 
          label="Temperatura" 
          value={weather?.temperature !== undefined ? `${weather.temperature}°C` : "--°C"}
          subValue={weather?.feels_like !== undefined ? `Sensa-ção ${weather.feels_like}°C` : undefined}
        />
        <WeatherDetailCard 
          icon={<Wind className="text-blue-500" />} 
          label="Vento" 
          value={weather?.wind_speed !== undefined ? `${weather.wind_speed} km/h` : "-- km/h"}
          subValue={weather?.wind_gust ? `Rajadas ${weather.wind_gust}` : undefined}
        />
        <WeatherDetailCard 
          icon={<Waves className="text-primary" />} 
          label="Ondas" 
          value={weather?.wave_height !== undefined ? `${weather.wave_height} m` : "-- m"}
          subValue={weather?.wave_period ? `${weather.wave_period} segundos` : undefined}
        />
        <WeatherDetailCard 
          icon={<CloudRain className="text-blue-400" />} 
          label="Chuva" 
          value={weather?.rain_probability !== undefined ? `${weather.rain_probability}%` : "--%"}
          subValue={weather?.precipitation !== undefined ? `${weather.precipitation} mm` : '0 mm'}
        />
        <WeatherDetailCard 
          icon={<Eye className="text-slate-500" />} 
          label="Visibilidade" 
          value={weather?.visibility !== undefined ? `${weather.visibility} km` : "-- km"}
        />
        <WeatherDetailCard 
          icon={<Navigation className="text-slate-400 rotate-[-45deg]" />} 
          label="Dir. Vento" 
          value={weather?.wind_direction !== undefined ? `${weather.wind_direction}°` : "--°"}
          subValue="Norte"
        />
      </div>

      {/* Disclaimer de Segurança */}
      <div className="bg-muted/50 p-4 rounded-2xl flex gap-3 items-start border border-muted">
        <AlertTriangle size={20} className="text-muted-foreground shrink-0 mt-0.5" />
        <p className="text-xs font-medium text-muted-foreground leading-relaxed">
          As condições podem mudar rapidamente. Consulte também os avisos oficiais e avalie as condições locais antes de sair.
        </p>
      </div>

      {/* Seção de Avisos */}
      <NoticeSummary />

      {/* Seção de Maré */}
      <TideSummary />

      <div className="text-center pt-4">
        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] opacity-50">
          Fonte: {weather?.source ?? "Dados Indisponíveis"}
        </p>
      </div>
    </div>
  )
}

function NoticeSummary() {
  const { data: notices, isLoading } = useQuery({
    queryKey: ['notices-hoje'],
    queryFn: () => getNotices({ data: { limit: 1 } }),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 60 * 24,
  })

  if (isLoading || !notices || notices.length === 0) return null

  const notice = notices[0]
  if (!notice) return null

  return (
    <section className="space-y-4">
      <h3 className="text-xl font-black uppercase tracking-tighter flex items-center gap-2">
        <Bell size={20} className="text-primary" /> Avisos Recentes
      </h3>
      <Card className={`border-2 rounded-[2rem] overflow-hidden shadow-md ${notice.priority === 'critical' ? 'bg-destructive/5 border-destructive/20' : ''}`}>
        <CardContent className="p-6">
          <div className="flex justify-between items-start mb-2">
            <Badge variant={notice.priority === 'critical' ? "destructive" : "outline"} className="text-[10px]">
              {notice.priority.toUpperCase()}
            </Badge>
            <span className="text-[10px] text-muted-foreground">
              {notice.published_at ? format(new Date(notice.published_at), 'dd/MM', { locale: ptBR }) : ''}
            </span>
          </div>
          <h4 className={`font-bold mb-2 ${notice.priority === 'critical' ? 'text-destructive' : ''}`}>
            {notice.title}
          </h4>
          <Button asChild variant="link" className="p-0 h-auto text-primary text-xs font-bold gap-1">
            <Link to="/app/avisos/$id" params={{ id: notice.id }}>
              Ler comunicado <ChevronRight size={12} />
            </Link>
          </Button>
        </CardContent>
      </Card>
    </section>
  )
}

function TideSummary() {
  const { data: tide, isLoading } = useQuery<TideData>({
    queryKey: ['tide-summary'],
    queryFn: () => getTides({ data: {} }),
    staleTime: 1000 * 60 * 30,
    gcTime: 1000 * 60 * 60 * 24,
  })

  if (isLoading) return <Skeleton className="h-40 w-full rounded-3xl" />
  if (!tide) return null

  const getStateLabel = (state: string) => {
    switch (state) {
      case 'rising': return 'Enchendo';
      case 'falling': return 'Vazando';
      case 'high': return 'Maré Alta';
      case 'low': return 'Maré Baixa';
      default: return 'Sem dados';
    }
  }

  return (
    <section className="space-y-4">
      <h3 className="text-xl font-black uppercase tracking-tighter flex items-center gap-2">
        <Waves size={20} className="text-primary" /> Maré
      </h3>
      <Card className="border-2 rounded-[2rem] overflow-hidden shadow-md">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 rounded-xl text-blue-600">
                {tide?.current_state === 'rising' || tide?.current_state === 'high' ? <ArrowUp size={24} /> : <ArrowDown size={24} />}
              </div>
              <div>
                <p className="text-sm font-black text-muted-foreground uppercase tracking-widest opacity-70">Agora</p>
                <p className="text-xl font-black">{tide ? getStateLabel(tide.current_state) : "--"}</p>
              </div>
            </div>
            <Button asChild size="sm" variant="outline" className="rounded-xl font-bold uppercase tracking-widest text-[10px]">
              <Link to="/app/mare">Ver completa</Link>
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {tide?.next_high_tide && (
              <div className="bg-muted/30 p-3 rounded-2xl flex flex-col items-center text-center">
                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Próxima Alta</span>
                <span className="text-lg font-black">{format(parseISO(tide.next_high_tide.time), 'HH:mm')}</span>
                <span className="text-xs font-bold text-blue-600">{tide.next_high_tide.height_m} m</span>
              </div>
            )}
            {tide?.next_low_tide && (
              <div className="bg-muted/30 p-3 rounded-2xl flex flex-col items-center text-center">
                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Próxima Baixa</span>
                <span className="text-lg font-black">{format(parseISO(tide.next_low_tide.time), 'HH:mm')}</span>
                <span className="text-xs font-bold text-orange-600">{tide.next_low_tide.height_m} m</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </section>
  )
}

function WeatherDetailCard({ 
  icon, 
  label, 
  value, 
  subValue 
}: { 
  icon: React.ReactNode, 
  label: string, 
  value: string,
  subValue?: string | undefined
}) {
  return (
    <Card className="border-2 rounded-3xl shadow-sm">
      <CardContent className="p-4 flex flex-col items-center text-center space-y-1">
        <div className="mb-1">{icon}</div>
        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-70">
          {label}
        </span>
        <span className="text-xl font-black tabular-nums">{value}</span>
        {subValue && (
          <span className="text-[10px] font-bold text-muted-foreground truncate w-full">
            {subValue}
          </span>
        )}
      </CardContent>
    </Card>
  )
}


