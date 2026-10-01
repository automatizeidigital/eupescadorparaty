import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { TideData, TIDE_STATION_CONFIG } from "./tide.types";
import { evaluateTideState, getNextEvents } from "./tide.logic";
import { format, startOfDay } from "date-fns";

export const getTides = createServerFn({ method: "GET" })
  .validator((data: any) => z.object({ 
    date: z.string().optional() // YYYY-MM-DD
  }).parse(data))
  .handler(async (): Promise<any> => { throw new Error("Serviço temporariamente indisponível. A nova base está sendo preparada."); });


