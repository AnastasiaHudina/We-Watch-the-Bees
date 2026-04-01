import { useState, useEffect } from 'react';
import { ArrowLeft, Thermometer, Droplets, Weight } from 'lucide-react';
import api from './api';
import type { Hive } from './MyApiariesSection';

interface HiveCardModalProps {
  hive: Hive;
  onClose: () => void;
  onHiveDeleted?: (id: number) => void;
}

export function HiveCardModal({ hive, onClose, onHiveDeleted }: HiveCardModalProps) {
  const [hiveDetail, setHiveDetail] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const res = await api.get(`/hives/${hive.id}/`);
        setHiveDetail(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [hive.id]);

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

  if (loading) return <div className="p-6">Загрузка...</div>;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gradient-to-r from-amber-500 to-amber-600 text-white p-6 flex items-center gap-4">
          <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-lg">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h2 className="text-white mb-1">Карточка улья {hiveDetail.name}</h2>
            <p className="text-amber-100 text-sm">Подробная информация</p>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Основная информация */}
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
              <div className="flex justify-between">
                <span className="text-gray-600">Дата добавления:</span>
                <span className="text-gray-800">
                  {/* Позже можно добавить поле created_at */}
                </span>
              </div>
            </div>
          </div>

          {/* Датчики и показания */}
          <div className="bg-white rounded-xl p-5 border border-gray-200">
            <h3 className="text-gray-800 mb-4">Датчики и показания</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {hiveDetail.sensors?.map((sensor: any) => (
                <div key={sensor.id} className="bg-blue-50 rounded-lg p-4 text-center">
                  {sensor.sensor_type === 'temp' && <Thermometer className="w-8 h-8 text-blue-600 mx-auto mb-2" />}
                  {sensor.sensor_type === 'hum' && <Droplets className="w-8 h-8 text-blue-600 mx-auto mb-2" />}
                  {sensor.sensor_type === 'weight' && <Weight className="w-8 h-8 text-blue-600 mx-auto mb-2" />}
                  <div className="text-blue-900 mb-1">
                    {sensor.last_reading ? sensor.last_reading.value : '—'}
                    {sensor.sensor_type === 'temp' && '°C'}
                    {sensor.sensor_type === 'hum' && '%'}
                    {sensor.sensor_type === 'weight' && ' кг'}
                  </div>
                  <div className="text-blue-700 text-sm">
                    {sensor.sensor_type === 'temp' && 'Температура'}
                    {sensor.sensor_type === 'hum' && 'Влажность'}
                    {sensor.sensor_type === 'weight' && 'Вес'}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-3 mt-6">
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
    </div>
  );
}