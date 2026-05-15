import { useState, useEffect } from 'react';
import { ArrowLeft, Thermometer, Droplets, Weight } from 'lucide-react';
import api from './api';
import type { Hive } from './MyApiariesSection';
import { EditHiveModal } from './EditHiveModal';
import { SensorChart, type SensorReadingPoint } from './SensorChart';
import { getChartZones, type SensorType } from './thresholds';
import type { AlertItem } from './AlertsSection';
import { AlertTriangle, Check } from 'lucide-react';

interface HiveCardModalProps {
  hive: Hive;
  onClose: () => void;
  onHiveDeleted?: (id: number) => void;
  onHiveUpdated?: () => void;
}

interface HiveSensor {
  id: number;
  sensor_type: 'temp' | 'hum' | 'weight';
  device_id: string;
  last_reading?: { value: number; timestamp: string };
}

interface HiveDetail {
  id: number;
  name: string;
  hive_id?: string;
  bee_info?: string;
  sensors?: HiveSensor[];
}

const SENSOR_CHART_CONFIG: Record<
  HiveSensor['sensor_type'],
  { title: string; unit: string; color: string }
> = {
  temp: { title: 'Температура', unit: '°C', color: '#2563eb' },
  hum: { title: 'Влажность', unit: '%', color: '#0891b2' },
  weight: { title: 'Вес улья', unit: 'кг', color: '#b45309' },
};

function SensorIcon({ type }: { type: HiveSensor['sensor_type'] }) {
  if (type === 'temp') return <Thermometer className="w-8 h-8 text-blue-600 mx-auto mb-2" />;
  if (type === 'hum') return <Droplets className="w-8 h-8 text-blue-600 mx-auto mb-2" />;
  return <Weight className="w-8 h-8 text-blue-600 mx-auto mb-2" />;
}

function formatValue(type: HiveSensor['sensor_type'], value: number): string {
  if (type === 'temp') return `${value}°C`;
  if (type === 'hum') return `${value}%`;
  return `${value} кг`;
}

function sensorLabel(type: HiveSensor['sensor_type']): string {
  if (type === 'temp') return 'Температура';
  if (type === 'hum') return 'Влажность';
  return 'Вес';
}

export function HiveCardModal({ hive, onClose, onHiveDeleted, onHiveUpdated }: HiveCardModalProps) {
  const [hiveDetail, setHiveDetail] = useState<HiveDetail | null>(null);
  const [readingsBySensor, setReadingsBySensor] = useState<Record<number, SensorReadingPoint[]>>({});
  const [loading, setLoading] = useState(true);
  const [chartsLoading, setChartsLoading] = useState(false);
  const [hiveAlerts, setHiveAlerts] = useState<AlertItem[]>([]);
  const [alertsLoading, setAlertsLoading] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      try {
        const res = await api.get<HiveDetail>(`/hives/${hive.id}/`);
        setHiveDetail(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [hive.id]);

  useEffect(() => {
    const sensors = hiveDetail?.sensors;
    if (!sensors?.length) return;

    const fetchReadings = async () => {
      setChartsLoading(true);
      const result: Record<number, SensorReadingPoint[]> = {};

      await Promise.all(
        sensors.map(async (sensor) => {
          try {
            const res = await api.get<SensorReadingPoint[] | { results: SensorReadingPoint[] }>(
              `/sensors/${sensor.id}/readings/`,
            );
            const payload = res.data;
            result[sensor.id] = Array.isArray(payload) ? payload : (payload.results ?? []);
          } catch (err) {
            console.error(`Ошибка загрузки показаний датчика ${sensor.id}`, err);
            result[sensor.id] = [];
          }
        }),
      );

      setReadingsBySensor(result);
      setChartsLoading(false);
    };

    fetchReadings();
  }, [hiveDetail]);

  useEffect(() => {
    if (!hiveDetail?.id) return;

    const fetchAlerts = async () => {
      setAlertsLoading(true);
      try {
        const res = await api.get<AlertItem[]>('/alerts/', {
          params: { hive_id: hiveDetail.id },
        });
        setHiveAlerts(Array.isArray(res.data) ? res.data.slice(0, 10) : []);
      } catch (err) {
        console.error('Ошибка загрузки оповещений улья', err);
        setHiveAlerts([]);
      } finally {
        setAlertsLoading(false);
      }
    };

    fetchAlerts();
  }, [hiveDetail?.id]);

  const markAlertRead = async (alertId: number) => {
    try {
      await api.patch(`/alerts/${alertId}/read/`);
      setHiveAlerts((prev) =>
        prev.map((a) => (a.id === alertId ? { ...a, status: 'read' as const } : a)),
      );
    } catch (err) {
      console.error('Ошибка пометки оповещения', err);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Вы уверены, что хотите удалить этот улей? Все данные будут потеряны.')) {
      try {
        await api.delete(`/hives/${hive.id}/delete/`);
        if (onHiveDeleted) onHiveDeleted(hive.id);
        onClose();
      } catch (err) {
        console.error('Ошибка удаления', err);
      }
    }
  };

  const handleSaveEdit = async (
    id: number,
    data: { name: string; hive_id?: string; bee_info?: string },
  ) => {
    try {
      await api.put(`/hives/${id}/update/`, data);
      if (onHiveUpdated) onHiveUpdated();
      onClose();
    } catch (err) {
      console.error('Ошибка обновления улья', err);
    }
  };

  if (loading || !hiveDetail) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-8 text-gray-600">Загрузка...</div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gradient-to-r from-amber-500 to-amber-600 text-white p-6 flex items-center gap-4 z-10">
          <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-lg">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h2 className="text-white mb-1">Карточка улья {hiveDetail.name}</h2>
            <p className="text-amber-100 text-sm">Подробная информация и графики за 24 часа</p>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div className="bg-amber-50 rounded-xl p-5 border border-amber-200">
            <h3 className="text-gray-800 mb-4">Основная информация</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Название улья:</span>
                <span className="text-gray-800">{hiveDetail.name}</span>
              </div>
              {hiveDetail.hive_id && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Идентификатор улья:</span>
                  <span className="text-gray-800">{hiveDetail.hive_id}</span>
                </div>
              )}
              {hiveDetail.bee_info && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Данные о пчелосемье:</span>
                  <span className="text-gray-800">{hiveDetail.bee_info}</span>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 border border-gray-200">
            <h3 className="text-gray-800 mb-4">Текущие показания</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {hiveDetail.sensors?.map((sensor) => (
                <div key={sensor.id} className="bg-blue-50 rounded-lg p-4 text-center">
                  <SensorIcon type={sensor.sensor_type} />
                  <div className="text-blue-900 mb-1">
                    {sensor.last_reading
                      ? formatValue(sensor.sensor_type, sensor.last_reading.value)
                      : '—'}
                  </div>
                  <p className="text-blue-700 text-sm">{sensorLabel(sensor.sensor_type)}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 border border-gray-200">
            <h3 className="text-gray-800 mb-4">Оповещения улья</h3>
            {alertsLoading ? (
              <p className="text-gray-500 text-sm">Загрузка...</p>
            ) : hiveAlerts.length === 0 ? (
              <p className="text-gray-500 text-sm">Нет оповещений для этого улья</p>
            ) : (
              <ul className="space-y-2">
                {hiveAlerts.map((alert) => (
                  <li
                    key={alert.id}
                    className={`flex gap-3 p-3 rounded-lg text-sm ${
                      alert.status === 'new'
                        ? alert.severity === 'critical'
                          ? 'bg-red-50 border border-red-100'
                          : 'bg-yellow-50 border border-yellow-100'
                        : 'bg-gray-50 border border-gray-100'
                    }`}
                  >
                    <AlertTriangle
                      className={`w-4 h-4 flex-shrink-0 mt-0.5 ${
                        alert.severity === 'critical' ? 'text-red-600' : 'text-yellow-600'
                      }`}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-gray-800">{alert.message}</p>
                      <p className="text-gray-400 text-xs mt-1">
                        {new Date(alert.timestamp).toLocaleString('ru-RU')}
                      </p>
                    </div>
                    {alert.status === 'new' && (
                      <button
                        onClick={() => markAlertRead(alert.id)}
                        className="p-1 text-amber-700 hover:bg-amber-100 rounded"
                        title="Прочитано"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="bg-white rounded-xl p-5 border border-gray-200">
            <h3 className="text-gray-800 mb-1">Графики показаний</h3>
            <p className="text-gray-500 text-sm mb-4">
              Зоны на графике совпадают с цветами на главной и с порогами оповещений.
            </p>
            {chartsLoading ? (
              <p className="text-gray-500 text-sm py-8 text-center">Загрузка графиков...</p>
            ) : (
              <div className="space-y-4">
                {hiveDetail.sensors?.map((sensor) => {
                  const config = SENSOR_CHART_CONFIG[sensor.sensor_type];
                  return (
                    <SensorChart
                      key={sensor.id}
                      title={config.title}
                      unit={config.unit}
                      color={config.color}
                      zones={getChartZones(sensor.sensor_type as SensorType)}
                      data={readingsBySensor[sensor.id] ?? []}
                    />
                  );
                })}
                {(!hiveDetail.sensors || hiveDetail.sensors.length === 0) && (
                  <p className="text-gray-500 text-sm text-center py-4">Нет датчиков</p>
                )}
              </div>
            )}
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setShowEditModal(true)}
              className="flex-1 py-3 bg-amber-500 text-white rounded-lg hover:bg-amber-600"
            >
              Редактировать
            </button>
            <button
              onClick={handleDelete}
              className="flex-1 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600"
            >
              Удалить улей
            </button>
            <button
              onClick={onClose}
              className="flex-1 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
            >
              Назад
            </button>
          </div>
        </div>
      </div>

      <EditHiveModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onSave={handleSaveEdit}
        hive={{
          id: hiveDetail.id,
          name: hiveDetail.name,
          hive_id: hiveDetail.hive_id,
          bee_info: hiveDetail.bee_info,
        }}
      />
    </div>
  );
}
