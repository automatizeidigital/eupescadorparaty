import { FishingTrip } from "@/lib/map.types";
import { 
  evaluateTripMonitoring, 
  TRIP_MONITORING_CONFIG 
} from "@/lib/trip-monitoring.functions";
import { Badge } from "@/components/ui/badge";
import { Clock, MapPin, Wifi, WifiOff } from "lucide-react";

interface TripMonitoringSummaryProps {
  trip: FishingTrip;
  className?: string;
}

export function TripMonitoringSummary({ trip, className }: TripMonitoringSummaryProps) {
  const monitoring = evaluateTripMonitoring(trip);
  
  const getStatusConfig = () => {
    switch (monitoring.status) {
      case 'needs_attention':
        return { color: 'bg-destructive text-destructive-foreground', label: 'CRÍTICO' };
      case 'significantly_overdue':
        return { color: 'bg-orange-500 text-white', label: 'MUITO ATRASADO' };
      case 'overdue':
        return { color: 'bg-orange-400 text-white', label: 'ATRASADO' };
      case 'return_approaching':
        return { color: 'bg-yellow-400 text-black', label: 'RETORNO PRÓXIMO' };
      default:
        return { color: 'bg-green-500 text-white', label: 'NO HORÁRIO' };
    }
  };

  const getFreshnessConfig = () => {
    switch (monitoring.locationFreshness) {
      case 'fresh':
        return { color: 'text-green-500', label: 'Atualizada', icon: Wifi };
      case 'little_recent':
        return { color: 'text-yellow-500', label: 'Pouco recente', icon: Wifi };
      case 'stale':
        return { color: 'text-orange-500', label: 'Desatualizada', icon: WifiOff };
      default:
        return { color: 'text-slate-400', label: 'Sem sinal', icon: WifiOff };
    }
  };

  const status = getStatusConfig();
  const freshness = getFreshnessConfig();

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <Badge className={`${status.color} px-4 py-1 rounded-full font-black text-xs uppercase tracking-widest border-none`}>
          {status.label}
        </Badge>
        {monitoring.delayMinutes > 0 && (
          <span className="text-sm font-bold text-destructive flex items-center gap-1">
            <Clock size={14} />
            {monitoring.delayMinutes} min de atraso
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
          <div className="text-[10px] font-black text-slate-400 uppercase tracking-tighter mb-1">Comunicação</div>
          <div className={`flex items-center gap-2 font-bold text-sm ${freshness.color}`}>
            <freshness.icon size={16} />
            {freshness.label}
          </div>
        </div>
        
        <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
          <div className="text-[10px] font-black text-slate-400 uppercase tracking-tighter mb-1">Última Posição</div>
          <div className="flex items-center gap-2 font-bold text-sm text-slate-700">
            <MapPin size={16} className="text-primary" />
            {trip.last_location_at ? new Date(trip.last_location_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '---'}
          </div>
        </div>
      </div>
    </div>
  );
}
