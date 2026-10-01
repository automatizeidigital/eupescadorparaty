
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

type NotificationPreferences = {
  secretaria_enabled: boolean;
  prefeitura_enabled: boolean;
  weather_enabled: boolean;
  marine_enabled: boolean;
  trip_enabled: boolean;
  sos_enabled: boolean;
  events_enabled: boolean;
  quiet_hours_enabled: boolean;
  quiet_hours_start: string | null;
  quiet_hours_end: string | null;
};

export const getNotificationPreferences = createServerFn({ method: "GET" })

  .handler(async (): Promise<any> => { throw new Error("Serviço temporariamente indisponível. A nova base está sendo preparada."); });

export const updateNotificationPreferences = createServerFn({ method: "POST" })

  .validator((data: unknown) => z.object({
    secretaria_enabled: z.boolean().optional(),
    prefeitura_enabled: z.boolean().optional(),
    weather_enabled: z.boolean().optional(),
    marine_enabled: z.boolean().optional(),
    trip_enabled: z.boolean().optional(),
    sos_enabled: z.boolean().optional(),
    events_enabled: z.boolean().optional(),
    quiet_hours_enabled: z.boolean().optional(),
    quiet_hours_start: z.string().nullable().optional(),
    quiet_hours_end: z.string().nullable().optional(),
  }).parse(data))
  .handler(async (): Promise<any> => { throw new Error("Serviço temporariamente indisponível. A nova base está sendo preparada."); });

export const registerPushToken = createServerFn({ method: "POST" })

  .validator((data: unknown) => z.object({
    token: z.string(),
    provider: z.string(),
    platform: z.string().optional(),
    deviceName: z.string().optional(),
  }).parse(data))
  .handler(async (): Promise<any> => { throw new Error("Serviço temporariamente indisponível. A nova base está sendo preparada."); });

export const getNotificationHistory = createServerFn({ method: "GET" })

  .validator((data: unknown) => z.object({
    limit: z.number().default(20),
  }).parse(data))
  .handler(async (): Promise<any> => { throw new Error("Serviço temporariamente indisponível. A nova base está sendo preparada."); });

