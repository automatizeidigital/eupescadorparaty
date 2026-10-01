import { z } from "zod";

export const TideEventSchema = z.object({
  type: z.enum(["high", "low"]),
  time: z.string(), // ISO String or HH:mm
  height_m: z.number(),
});

export type TideEvent = z.infer<typeof TideEventSchema>;

export const TideDataSchema = z.object({
  station_name: z.string(),
  station_code: z.string(),
  date: z.string(), // YYYY-MM-DD
  events: z.array(TideEventSchema),
  current_state: z.enum(["rising", "falling", "high", "low", "unknown"]),
  next_high_tide: TideEventSchema.optional(),
  next_low_tide: TideEventSchema.optional(),
  updated_at: z.string(),
  source: z.string(),
});

export type TideData = z.infer<typeof TideDataSchema>;

export const TIDE_STATION_CONFIG = {
  ID: "20440", // Exemplo de código para Paraty ou estação próxima
  NAME: "Porto de Paraty",
  SOURCE: "Marinha do Brasil / DHN / CHM",
};
