import { z } from "zod";

export const MarineWeatherDataSchema = z.object({
  temperature: z.number().optional(),
  feels_like: z.number().optional(),
  weather_condition: z.string().optional(),
  rain_probability: z.number().optional(),
  precipitation: z.number().optional(),
  wind_speed: z.number().optional(), // km/h
  wind_direction: z.number().optional(),
  wind_gust: z.number().optional(),
  wave_height: z.number().optional(), // meters
  wave_direction: z.number().optional(),
  wave_period: z.number().optional(),
  visibility: z.number().optional(), // km
  updated_at: z.string(),
  source: z.string(),
  location_name: z.string(),
});

export type MarineWeatherData = z.infer<typeof MarineWeatherDataSchema>;

export type MarineCondition = 'favorable' | 'attention' | 'adverse' | 'unknown';

export interface MarineConditionResult {
  status: MarineCondition;
  message: string;
}

export const MARINE_LIMITS = {
  wind_speed: { attention: 25, adverse: 40 }, // km/h
  wave_height: { attention: 1.5, adverse: 2.5 }, // meters
  visibility: { attention: 5, adverse: 2 }, // km
};
