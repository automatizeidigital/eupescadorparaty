
import { z } from "zod";
import { createServerFn } from "@tanstack/react-start";

export const getFishSpecies = createServerFn({ method: "GET" })

  .validator((search: string | undefined) => z.string().optional().parse(search))
  .handler(async (): Promise<any> => { throw new Error("Serviço temporariamente indisponível. A nova base está sendo preparada."); });

export const getFishingRegulations = createServerFn({ method: "GET" })

  .validator((speciesId: string | undefined) => z.string().uuid().optional().parse(speciesId))
  .handler(async (): Promise<any> => { throw new Error("Serviço temporariamente indisponível. A nova base está sendo preparada."); });

