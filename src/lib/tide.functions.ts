import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { TideData, TIDE_STATION_CONFIG } from "./tide.types";
import { evaluateTideState, getNextEvents } from "./tide.logic";
import { format, startOfDay } from "date-fns";

export const getTides = createServerFn({ method: "GET" })
  .validator((data: any) => z.object({ 
    date: z.string().optional() // YYYY-MM-DD
  }).parse(data))
  .handler(async ({ data }) => {
    const targetDateStr = data.date ?? format(new Date(), 'yyyy-MM-dd');
    const targetDate = startOfDay(new Date(targetDateStr));

    // TODO: Implementar busca real na API da Marinha ou cache no Supabase
    // Fase 13: Mostrar estado indisponível se não houver integração real.
    throw new Error("Tábua de maré indisponível");
  });


