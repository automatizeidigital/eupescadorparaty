import React from 'react';
import { CloudOff, MapPin } from 'lucide-react';
import type { OfflineMapSnapshot } from '@/lib/map-offline-cache';

interface OfflineMapFallbackProps {
  snapshot: OfflineMapSnapshot | null;
}

const toneClasses: Record<string, string> = {
  normal: 'fill-green-500',
  attention: 'fill-yellow-500',
  overdue: 'fill-orange-500',
  sos: 'fill-destructive',
  inactive: 'fill-slate-400',
};

/**
 * Carta esquemática offline. Renderiza as últimas coordenadas conhecidas em um
 * plano cartesiano local (sem tiles do Google, conforme os Termos de Serviço),
 * preservando a leitura operacional relativa entre as embarcações.
 */
export const OfflineMapFallback: React.FC<OfflineMapFallbackProps> = ({ snapshot }) => {
  const points = snapshot?.points ?? [];

  // Projeção linear simples dos pontos em um viewport 0-100 com margem de 12%.
  const projected = React.useMemo(() => {
    if (points.length === 0) return [];

    const lats = points.map((p) => p.lat);
    const lngs = points.map((p) => p.lng);
    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);
    const minLng = Math.min(...lngs);
    const maxLng = Math.max(...lngs);
    const spanLat = maxLat - minLat || 0.02;
    const spanLng = maxLng - minLng || 0.02;

    return points.map((p) => ({
      ...p,
      x: 12 + ((p.lng - minLng) / spanLng) * 76,
      y: 88 - ((p.lat - minLat) / spanLat) * 76,
    }));
  }, [points]);

  return (
    <div className="absolute inset-0 z-20 flex flex-col bg-slate-900 text-slate-200">
      <div className="flex items-center gap-3 border-b border-slate-800 bg-slate-950/60 px-4 py-3">
        <CloudOff className="h-5 w-5 shrink-0 text-yellow-400" />
        <div className="min-w-0">
          <p className="text-xs font-black uppercase tracking-widest text-yellow-400">
            Mapa offline
          </p>
          <p className="truncate text-[11px] text-slate-400">
            {snapshot
              ? `Últimas posições salvas em ${new Date(snapshot.savedAt).toLocaleString('pt-BR')}`
              : 'Nenhuma posição foi salva ainda neste dispositivo.'}
          </p>
        </div>
      </div>

      <div className="relative flex-1">
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="h-full w-full">
          <defs>
            <pattern id="offline-grid" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.15" className="text-slate-700" />
            </pattern>
          </defs>
          <rect width="100" height="100" fill="url(#offline-grid)" />
          {projected.map((p) => (
            <g key={p.id}>
              <circle cx={p.x} cy={p.y} r="2.6" className={toneClasses[p.tone ?? 'normal']} />
              <circle cx={p.x} cy={p.y} r="4.6" className={toneClasses[p.tone ?? 'normal']} opacity="0.25" />
            </g>
          ))}
        </svg>

        {projected.length === 0 && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 px-6 text-center">
            <MapPin className="h-8 w-8 text-slate-600" />
            <p className="text-sm font-bold text-slate-400">Sem posições em cache</p>
            <p className="max-w-xs text-xs text-slate-500">
              Abra o mapa uma vez com internet para que as últimas posições fiquem
              disponíveis offline.
            </p>
          </div>
        )}
      </div>

      {projected.length > 0 && (
        <div className="max-h-40 overflow-y-auto border-t border-slate-800 bg-slate-950/60 p-3">
          <ul className="space-y-2">
            {projected.map((p) => (
              <li key={p.id} className="flex items-center justify-between gap-3 text-xs">
                <span className="flex min-w-0 items-center gap-2">
                  <span
                    className={`h-2 w-2 shrink-0 rounded-full ${(toneClasses[p.tone ?? 'normal'] ?? '').replace('fill-', 'bg-')}`}
                  />
                  <span className="truncate font-bold">{p.label}</span>
                </span>
                <span className="shrink-0 font-mono text-[10px] text-slate-500">
                  {p.lat.toFixed(4)}, {p.lng.toFixed(4)}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
