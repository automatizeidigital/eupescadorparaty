import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { MarineWeatherDataSchema, MarineWeatherData } from "./weather.types";

export const getMarineWeather = createServerFn({ method: "GET" })
  .validator((data) => z.object({ 
    lat: z.number().optional(), 
    lon: z.number().optional() 
  }).parse(data))
  .handler(async ({ data }) => {
    // Localização padrão: Paraty - RJ
    const lat = data.lat ?? -23.2178;
    const lon = data.lon ?? -44.7131;

    // TODO: Implementar busca real via API do INMET / Marinha / OpenWeather
    // Caso o provider não esteja configurado, retornamos um erro ou estado indisponível
    // conforme solicitado na Fase 13.
    
    // Simulação de erro/indisponibilidade para forçar o tratamento visual se não houver API key
    // NUNCA mostrar mock fixo em produção se não houver dados reais.
    throw new Error("Dados meteorológicos indisponíveis");
  });

