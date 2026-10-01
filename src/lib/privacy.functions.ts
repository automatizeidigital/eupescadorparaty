
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export const getConsents = createServerFn({ method: "GET" })

  .handler(async (): Promise<any> => { throw new Error("Serviço temporariamente indisponível. A nova base está sendo preparada."); });

export const updateConsent = createServerFn({ method: "POST" })

  .validator((data) => z.object({
    consent_type: z.enum(['location', 'trip_location', 'notifications', 'privacy_policy', 'terms']),
    granted: z.boolean(),
    version: z.string().optional()
  }).parse(data))
  .handler(async (): Promise<any> => { throw new Error("Serviço temporariamente indisponível. A nova base está sendo preparada."); });

