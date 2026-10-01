import { TideData, TideEvent } from "./tide.types";
import { parseISO, isAfter, isBefore, addMinutes, differenceInMinutes } from "date-fns";

/**
 * Avalia o estado atual da maré com base nos eventos do dia.
 * Consideramos 'high' ou 'low' se estivermos dentro de uma janela de 15 minutos do evento.
 */
export function evaluateTideState(events: TideEvent[], currentTime: Date = new Date()): TideData["current_state"] {
  if (events.length === 0) return "unknown";

  // Ordenar eventos por tempo
  const sortedEvents = [...events].sort((a, b) => 
    parseISO(a.time).getTime() - parseISO(b.time).getTime()
  );

  // Encontrar o evento mais próximo
  let prevEvent: TideEvent | null = null;
  let nextEvent: TideEvent | null = null;

  for (const event of sortedEvents) {
    const eventTime = parseISO(event.time);
    if (isBefore(eventTime, currentTime)) {
      prevEvent = event;
    } else {
      nextEvent = event;
      break;
    }
  }

  // Se estiver muito perto de um evento (ex: 15 min), retornar o tipo do evento
  const checkProximity = (event: TideEvent) => {
    const diff = Math.abs(differenceInMinutes(parseISO(event.time), currentTime));
    return diff <= 15;
  };

  if (prevEvent && checkProximity(prevEvent)) return prevEvent.type;
  if (nextEvent && checkProximity(nextEvent)) return nextEvent.type;

  // Se não estiver perto, determinar se está enchendo ou vazando
  if (!prevEvent && nextEvent) {
    // Se só temos o próximo evento, e ele for 'high', está enchendo
    return nextEvent.type === "high" ? "rising" : "falling";
  }

  if (prevEvent && !nextEvent) {
    // Se só temos o evento anterior, e ele foi 'high', está vazando
    return prevEvent.type === "high" ? "falling" : "rising";
  }

  if (prevEvent && nextEvent) {
    // Se estamos entre dois eventos
    // Se o anterior foi 'low' e o próximo é 'high', está enchendo
    if (prevEvent.type === "low" && nextEvent.type === "high") return "rising";
    // Se o anterior foi 'high' e o próximo é 'low', está vazando
    if (prevEvent.type === "high" && nextEvent.type === "low") return "falling";
  }

  return "unknown";
}

export function getNextEvents(events: TideEvent[], currentTime: Date = new Date()) {
  const sortedEvents = [...events].sort((a, b) => 
    parseISO(a.time).getTime() - parseISO(b.time).getTime()
  );

  const nextHigh = sortedEvents.find(e => e.type === "high" && isAfter(parseISO(e.time), currentTime));
  const nextLow = sortedEvents.find(e => e.type === "low" && isAfter(parseISO(e.time), currentTime));

  return { nextHigh, nextLow };
}
