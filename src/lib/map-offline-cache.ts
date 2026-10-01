/**
 * Cache offline de dados operacionais de mapa.
 *
 * IMPORTANTE (conformidade): os Termos de Serviço da Google Maps Platform
 * proíbem armazenar/cachear tiles, imagens ou dados de mapa. Portanto este
 * cache NÃO guarda imagens do Google Maps — guarda apenas os dados
 * operacionais do próprio app (coordenadas registradas, rótulos e horários),
 * que são usados para renderizar uma carta esquemática local quando não há
 * conexão.
 */

export interface OfflineMapPoint {
  /** Identificador estável do ponto (viagem, incidente, embarcação). */
  id: string;
  lat: number;
  lng: number;
  label: string;
  /** Cor semântica do estado operacional. */
  tone?: 'normal' | 'attention' | 'overdue' | 'sos' | 'inactive';
  /** ISO timestamp da última posição conhecida. */
  recordedAt?: string;
}

export interface OfflineMapSnapshot {
  center: { lat: number; lng: number };
  zoom: number;
  points: OfflineMapPoint[];
  /** ISO timestamp de quando o snapshot foi salvo. */
  savedAt: string;
}

const STORAGE_PREFIX = 'eupescador:map-snapshot:';

/** Persiste o último estado conhecido do mapa para consulta offline. */
export function saveMapSnapshot(
  scope: string,
  snapshot: Omit<OfflineMapSnapshot, 'savedAt'>,
): void {
  if (typeof window === 'undefined') return;

  try {
    const payload: OfflineMapSnapshot = {
      ...snapshot,
      savedAt: new Date().toISOString(),
    };
    window.localStorage.setItem(STORAGE_PREFIX + scope, JSON.stringify(payload));
  } catch {
    // Armazenamento indisponível (modo privado / cota cheia): degradar em silêncio.
  }
}

/** Recupera o último estado conhecido do mapa, ou null se inexistente/corrompido. */
export function readMapSnapshot(scope: string): OfflineMapSnapshot | null {
  if (typeof window === 'undefined') return null;

  try {
    const raw = window.localStorage.getItem(STORAGE_PREFIX + scope);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as OfflineMapSnapshot;
    if (
      !parsed ||
      typeof parsed.center?.lat !== 'number' ||
      typeof parsed.center?.lng !== 'number' ||
      !Array.isArray(parsed.points)
    ) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}
