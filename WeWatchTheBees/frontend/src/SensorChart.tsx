import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceArea,
} from 'recharts';
import type { ChartZone } from './thresholds';

export interface SensorReadingPoint {
  id: number;
  value: number;
  timestamp: string;
}

interface SensorChartProps {
  title: string;
  unit: string;
  data: SensorReadingPoint[];
  color: string;
  zones: ChartZone[];
}

function formatTimeLabel(timestamp: string): string {
  return new Date(timestamp).toLocaleTimeString('ru-RU', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function SensorChart({ title, unit, data, color, zones }: SensorChartProps) {
  const chartData = data.map((point) => ({
    label: formatTimeLabel(point.timestamp),
    value: point.value,
  }));

  if (chartData.length === 0) {
    return (
      <div className="bg-gray-50 rounded-lg border border-gray-200 p-6 text-center text-gray-500 text-sm">
        Нет данных за последние 24 часа. Запустите эмуляторы.
      </div>
    );
  }

  const values = chartData.map((d) => d.value);
  const zoneMins = zones.map((z) => z.min);
  const zoneMaxs = zones.map((z) => z.max);
  const yMin = Math.floor(Math.min(...values, ...zoneMins) - 2);
  const yMax = Math.ceil(Math.max(...values, ...zoneMaxs) + 2);

  return (
    <div className="bg-gray-50 rounded-lg border border-gray-200 p-4">
      <h4 className="text-gray-800 text-sm font-medium mb-1">
        {title} <span className="text-gray-500 font-normal">(24 ч)</span>
      </h4>
      <p className="text-xs text-gray-500 mb-3">
        <span className="inline-block w-3 h-3 rounded-sm bg-green-500/30 align-middle mr-1" />
        норма
        <span className="inline-block w-3 h-3 rounded-sm bg-yellow-500/30 align-middle mx-1 ml-3" />
        предупреждение
      </p>
      <div className="h-48 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            {zones.map((zone, index) => (
              <ReferenceArea
                key={`${zone.min}-${zone.max}-${index}`}
                y1={zone.min}
                y2={zone.max}
                fill={zone.color}
                fillOpacity={zone.opacity ?? 0.1}
                strokeOpacity={0}
              />
            ))}
            <XAxis
              dataKey="label"
              tick={{ fontSize: 11, fill: '#6b7280' }}
              interval="preserveStartEnd"
              minTickGap={32}
            />
            <YAxis domain={[yMin, yMax]} tick={{ fontSize: 11, fill: '#6b7280' }} width={40} />
            <Tooltip
              formatter={(value) => {
                const num = typeof value === 'number' ? value : Number(value);
                if (Number.isNaN(num)) return ['—', title];
                return [`${num.toFixed(1)} ${unit}`, title];
              }}
              labelFormatter={(label) => `Время: ${label}`}
              contentStyle={{
                borderRadius: '8px',
                border: '1px solid #e5e7eb',
                fontSize: '13px',
              }}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke={color}
              strokeWidth={2}
              dot={chartData.length <= 30}
              activeDot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
