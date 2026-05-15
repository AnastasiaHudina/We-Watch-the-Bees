/**
 * Пороги мониторинга — единые для цветов на главной, оповещений и графиков.
 * Должны совпадать с backend/sensors/thresholds.py
 */

export type SensorType = 'temp' | 'hum' | 'weight';

export interface ChartZone {
  min: number;
  max: number;
  color: string;
  opacity?: number;
}

export interface SensorThresholds {
  /** Зелёная зона на графике (уровень «норма») */
  normal: { min: number; max: number };
  /** Жёлтая зона на графике (уровень «предупреждение»), если есть */
  warning?: { min: number; max: number };
}

export const THRESHOLDS: Record<SensorType, SensorThresholds> = {
  temp: {
    normal: { min: 20, max: 32 },
    warning: { min: 32, max: 38 },
  },
  hum: {
    normal: { min: 36, max: 74 },
    warning: { min: 35, max: 85 },
  },
  weight: {
    normal: { min: 41, max: 59 },
    warning: { min: 35, max: 65 },
  },
};

export function getChartZones(sensorType: SensorType): ChartZone[] {
  const t = THRESHOLDS[sensorType];
  const zones: ChartZone[] = [
    { min: t.normal.min, max: t.normal.max, color: '#22c55e', opacity: 0.12 },
  ];
  if (t.warning) {
    zones.push({ min: t.warning.min, max: t.warning.max, color: '#eab308', opacity: 0.1 });
  }
  return zones;
}

export function getTempColor(value?: number): string {
  if (value === undefined || value === null) return 'text-gray-400';
  if (value >= 38 || value < 20) return 'text-red-600 font-bold';
  if (value >= 32) return 'text-yellow-600';
  return 'text-green-600';
}

export function getHumColor(value?: number): string {
  if (value === undefined || value === null) return 'text-gray-400';
  if (value >= 85 || value <= 25) return 'text-red-600 font-bold';
  if (value >= 75 || value <= 35) return 'text-yellow-600';
  return 'text-green-600';
}

export function getWeightColor(value?: number): string {
  if (value === undefined || value === null) return 'text-gray-400';
  if (value <= 35 || value >= 65) return 'text-red-600 font-bold';
  if (value <= 40 || value >= 60) return 'text-yellow-600';
  return 'text-green-600';
}

export function getValueColor(sensorType: string, value?: number): string {
  if (sensorType === 'temp') return getTempColor(value);
  if (sensorType === 'hum') return getHumColor(value);
  if (sensorType === 'weight') return getWeightColor(value);
  return 'text-gray-400';
}
