import { MarineWeatherData, MarineConditionResult, MARINE_LIMITS } from "./weather.types";

export function evaluateMarineCondition(data: MarineWeatherData): MarineConditionResult {
  if (!data.wind_speed && !data.wave_height) {
    return {
      status: 'unknown',
      message: 'Sem dados suficientes para avaliar a condição.'
    };
  }

  // Lógica simplificada de avaliação
  if (
    (data.wind_speed && data.wind_speed >= MARINE_LIMITS.wind_speed.adverse) ||
    (data.wave_height && data.wave_height >= MARINE_LIMITS.wave_height.adverse) ||
    (data.visibility && data.visibility <= MARINE_LIMITS.visibility.adverse)
  ) {
    return {
      status: 'adverse',
      message: 'Há condições adversas. Consulte os avisos antes de sair.'
    };
  }

  if (
    (data.wind_speed && data.wind_speed >= MARINE_LIMITS.wind_speed.attention) ||
    (data.wave_height && data.wave_height >= MARINE_LIMITS.wave_height.attention) ||
    (data.visibility && data.visibility <= MARINE_LIMITS.visibility.attention)
  ) {
    return {
      status: 'attention',
      message: 'Atenção: Vento ou ondas acima do normal nas próximas horas.'
    };
  }

  return {
    status: 'favorable',
    message: 'Condições favoráveis neste momento.'
  };
}
