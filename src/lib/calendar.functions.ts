
import { z } from "zod";
import { createServerFn } from "@tanstack/react-start";

export const getCalendarEvents = createServerFn({ method: "GET" })

  .validator((data: unknown) => z.object({
    limit: z.number().optional().default(50),
    category: z.string().optional(),
    futureOnly: z.boolean().optional().default(true),
  }).parse(data))
  .handler(async (): Promise<any> => { throw new Error("Serviço temporariamente indisponível. A nova base está sendo preparada."); });

