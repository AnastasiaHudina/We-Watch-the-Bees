import React, { useState, useEffect, useContext } from 'react';
import { Plus } from 'lucide-react';
import api from './api';
import { AuthContext } from './context/AuthContext';
import { AddHiveModal } from './AddHiveModal';
import { HiveCardModal } from './HiveCardModal';

export interface Hive {
  id: number;
  name: string;
  hive_id?: string;
  bee_info?: string;
  sensors?: {
    id: number;
    sensor_type: string;
    last_reading?: { value: number; timestamp: string };
  }[];
}

export function MyApiariesSection() {
  const { user } = useContext(AuthContext);
  const [hives, setHives] = useState<Hive[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedHive, setSelectedHive] = useState<Hive | null>(null);

  const loadHives = async () => {
    try {
      const res = await api.get('/hives/');
      if (Array.isArray(res.data)) {
        setHives(res.data);
      } else {
        console.error('API вернул не массив:', res.data);
        setHives([]);
      }
    } catch (err) {
      console.error('Ошибка загрузки ульев', err);
      setHives([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
  if (user) {
    loadHives(); // первая загрузка
    const interval = setInterval(() => {
      loadHives(); // периодическое обновление
    }, 5000); // интервал 5 секунд
    return () => clearInterval(interval); // очистка при уходе со страницы
  }
}, [user]);

  const handleAddHive = async (newHive: {
    name: string;
    sensor_types: string[];
    hive_id?: string;
    bee_info?: string;
    sensor_ids?: string;
  }) => {
    try {
      await api.post('/hives/', {
        name: newHive.name,
        sensor_types: newHive.sensor_types,
        hive_id: newHive.hive_id,
        bee_info: newHive.bee_info,
      });
      await loadHives();
      setShowAddModal(false);
    } catch (err) {
      console.error('Ошибка добавления улья', err);
    }
  };

  const handleHiveDeleted = async (deletedId: number) => {
    try {
      await api.delete(`/hives/${deletedId}/delete/`);
      await loadHives();
    } catch (err) {
      console.error('Ошибка удаления', err);
    }
  };

  const handleHiveUpdated = () => {
    loadHives(); // перезагрузить список после редактирования
  };

  const translateSensorType = (type: string) => {
    switch (type) {
      case 'temp': return 'Температура';
      case 'hum': return 'Влажность';
      case 'weight': return 'Вес';
      default: return type;
    }
  };

  // Функции цветовой индикации
  const getTempColor = (value?: number) => {
    if (!value) return 'text-gray-400';
    if (value >= 38) return 'text-red-600 font-bold';
    if (value >= 32) return 'text-yellow-600';
    return 'text-green-600';
  };

  const getHumColor = (value?: number) => {
    if (!value) return 'text-gray-400';
    if (value >= 85 || value <= 25) return 'text-red-600 font-bold';
    if (value >= 75 || value <= 35) return 'text-yellow-600';
    return 'text-green-600';
  };

  const getWeightColor = (value?: number) => {
    if (!value) return 'text-gray-400';
    if (value <= 35 || value >= 65) return 'text-red-600 font-bold';
    if (value <= 40 || value >= 60) return 'text-yellow-600';
    return 'text-green-600';
  };

  if (loading) return <div>Загрузка...</div>;

  return (
    <>
      <div>
        <div className="mb-6">
          <h2 className="text-gray mb-2">Моя Пасека</h2>
          <p className="text-white-600">Управление ульями вашей пасеки</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {hives.map((hive) => (
            <div
              key={hive.id}
              onClick={() => setSelectedHive(hive)}
              className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition-all cursor-pointer border-2 border-amber-100 hover:border-amber-300"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="text-gray-500 text-sm mb-1">Улей</div>
                  <h3 className="text-gray-800">{hive.name}</h3>
                  {hive.hive_id && (
                    <div className="text-xs text-gray-400 mt-1">ID: {hive.hive_id}</div>
                  )}
                </div>
                <img src="/hive.jpg" alt="Улей" className="w-20 h-20 object-contain" />
              </div>
              <div className="space-y-3">
                {hive.bee_info && (
                  <div>
                    <div className="text-gray-500 text-sm mb-1">Пчелосемья</div>
                    <p className="text-gray-700 text-sm line-clamp-2">{hive.bee_info}</p>
                  </div>
                )}
                {/* Новый блок: датчики с показаниями и цветами */}
                <div>
                  <div className="text-gray-500 text-sm mb-1">Датчики и показания</div>
                  <div className="space-y-1">
                    {hive.sensors?.map(sensor => (
                      <div key={sensor.id} className="flex justify-between text-sm">
                        <span>{translateSensorType(sensor.sensor_type)}</span>
                        <span className={
                          sensor.sensor_type === 'temp' ? getTempColor(sensor.last_reading?.value) :
                          sensor.sensor_type === 'hum' ? getHumColor(sensor.last_reading?.value) :
                          sensor.sensor_type === 'weight' ? getWeightColor(sensor.last_reading?.value) : ''
                        }>
                          {sensor.last_reading ? sensor.last_reading.value +
                            (sensor.sensor_type === 'temp' ? '°C' : sensor.sensor_type === 'hum' ? '%' : ' кг') : '—'}
                        </span>
                      </div>
                    ))}
                    {(!hive.sensors || hive.sensors.length === 0) && <span className="text-gray-500 text-sm">нет датчиков</span>}
                  </div>
                </div>
              </div>
            </div>
          ))}

          <button
            onClick={() => setShowAddModal(true)}
            className="bg-amber-50 border-2 border-dashed border-amber-300 rounded-xl p-6 hover:bg-amber-100 hover:border-amber-400 transition-all flex flex-col items-center justify-center min-h-[280px] group"
          >
            <div className="w-16 h-16 bg-amber-200 rounded-full flex items-center justify-center mb-4 group-hover:bg-amber-300 transition-colors">
              <Plus className="w-8 h-8 text-amber-700" />
            </div>
            <span className="text-amber-700">Добавить улей</span>
          </button>
        </div>
      </div>

      <AddHiveModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={handleAddHive}
      />

      {selectedHive && (
        <HiveCardModal
          hive={selectedHive}
          onClose={() => setSelectedHive(null)}
          onHiveDeleted={handleHiveDeleted}
          onHiveUpdated={handleHiveUpdated}
        />
      )}
    </>
  );
}