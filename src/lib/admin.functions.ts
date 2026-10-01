
import { z } from "zod";
import { createServerFn } from "@tanstack/react-start";

export const getAdminStats = createServerFn({ method: "GET" })

  .handler(async (): Promise<any> => { throw new Error("Serviço temporariamente indisponível. A nova base está sendo preparada."); });

export const getAdminPescadores = createServerFn({ method: "GET" })

  .validator((data: unknown) => z.object({
    search: z.string().optional(),
    community: z.string().optional(),
    status: z.string().optional(),
    limit: z.number().optional().default(50),
    offset: z.number().optional().default(0),
  }).parse(data))
  .handler(async (): Promise<any> => { throw new Error("Serviço temporariamente indisponível. A nova base está sendo preparada."); });

export const getAdminPescadorById = createServerFn({ method: "GET" })

  .validator((data: unknown) => z.object({
    id: z.string().uuid(),
  }).parse(data))
  .handler(async (): Promise<any> => { throw new Error("Serviço temporariamente indisponível. A nova base está sendo preparada."); });

export const getAdminBoats = createServerFn({ method: "GET" })

  .validator((data: unknown) => z.object({
    status: z.string().optional(),
    type: z.string().optional(),
    community: z.string().optional(),
  }).parse(data))
  .handler(async (): Promise<any> => { throw new Error("Serviço temporariamente indisponível. A nova base está sendo preparada."); });

export const getAdminBoatById = createServerFn({ method: "GET" })

  .validator((data: unknown) => z.object({
    id: z.string().uuid(),
  }).parse(data))
  .handler(async (): Promise<any> => { throw new Error("Serviço temporariamente indisponível. A nova base está sendo preparada."); });

export const getAdminIncidents = createServerFn({ method: "GET" })

  .handler(async (): Promise<any> => { throw new Error("Serviço temporariamente indisponível. A nova base está sendo preparada."); });

export const getAdminTrips = createServerFn({ method: "GET" })

  .validator((data: unknown) => z.object({
    status: z.enum(['active', 'overdue', 'completed', 'cancelled']).optional()
  }).parse(data))
  .handler(async (): Promise<any> => { throw new Error("Serviço temporariamente indisponível. A nova base está sendo preparada."); });

export const getAdminTripById = createServerFn({ method: "GET" })

  .validator((data: unknown) => z.object({
    id: z.string().uuid(),
  }).parse(data))
  .handler(async (): Promise<any> => { throw new Error("Serviço temporariamente indisponível. A nova base está sendo preparada."); });

export const logAdminAction = createServerFn({ method: "POST" })

  .validator((data: unknown) => z.object({
    action: z.string(),
    target_id: z.string().uuid(),
    target_type: z.string(),
    details: z.record(z.any()).optional(),
  }).parse(data))
  .handler(async (): Promise<any> => { throw new Error("Serviço temporariamente indisponível. A nova base está sendo preparada."); });

export const updateProfileStatus = createServerFn({ method: "POST" })

  .validator((data: unknown) => z.object({
    id: z.string().uuid(),
    registration_completed: z.boolean(),
  }).parse(data))
  .handler(async (): Promise<any> => { throw new Error("Serviço temporariamente indisponível. A nova base está sendo preparada."); });

export const regenerateMunicipalRegistration = createServerFn({ method: "POST" })

  .validator((data: unknown) => z.object({
    id: z.string().uuid(),
  }).parse(data))
  .handler(async (): Promise<any> => { throw new Error("Serviço temporariamente indisponível. A nova base está sendo preparada."); });


/**
 * Últimas posições conhecidas das saídas ativas.
 * Usada no mapa operacional e persistida localmente para leitura offline.
 */
export const getFleetPositions = createServerFn({ method: "GET" })

  .handler(async (): Promise<any> => { throw new Error("Serviço temporariamente indisponível. A nova base está sendo preparada."); });

