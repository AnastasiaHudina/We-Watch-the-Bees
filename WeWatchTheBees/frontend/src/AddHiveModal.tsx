import { useState } from 'react';

interface AddHiveModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (data: {
    name: string;
    sensor_types: string[];
    hive_id?: string;
    bee_info?: string;
    sensor_ids?: string;
  }) => void;
}

export function AddHiveModal({ isOpen, onClose, onAdd }: AddHiveModalProps) {
  const [name, setName] = useState('');
  const [sensorTypes, setSensorTypes] = useState<string[]>([]);
  const [hiveId, setHiveId] = useState('');
  const [beeInfo, setBeeInfo] = useState('');
  const [sensorIds, setSensorIds] = useState('');

  if (!isOpen) return null;

  const toggleSensor = (type: string) => {
    setSensorTypes(prev =>
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onAdd({
      name,
      sensor_types: sensorTypes,
      hive_id: hiveId || undefined,
      bee_info: beeInfo || undefined,
      sensor_ids: sensorIds || undefined,
    });
    setName('');
    setSensorTypes([]);
    setHiveId('');
    setBeeInfo('');
    setSensorIds('');
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center gap-4">
          <h2 className="text-gray-800">Добавить улей</h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Название улья */}
          <div>
            <label htmlFor="hiveName" className="block text-gray-700 mb-2">
              Название улья
            </label>
            <input
              type="text"
              id="hiveName"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              placeholder="Например: Улей №1"
              required
            />
          </div>

          {/* Идентификатор улья */}
          <div>
            <label htmlFor="hiveId" className="block text-gray-700 mb-2">
              Идентификатор улья (HIVEid - Hid)
            </label>
            <input
              type="text"
              id="hiveId"
              value={hiveId}
              onChange={(e) => setHiveId(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              placeholder="Например: H001"
            />
            <p className="text-gray-500 text-sm mt-1">
              Уникальный идентификатор для вашего улья
            </p>
          </div>

          {/* Данные о пчелосемье */}
          <div>
            <label htmlFor="beeInfo" className="block text-gray-700 mb-2">
              Данные о пчелосемье (BEEinfo - Binf)
            </label>
            <textarea
              id="beeInfo"
              value={beeInfo}
              onChange={(e) => setBeeInfo(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 min-h-[100px]"
              placeholder="Например: Карпатская порода, матка 2024 года, сильная семья"
            />
            <p className="text-gray-500 text-sm mt-1">
              Информация о породе, матке, силе семьи и другие данные
            </p>
          </div>

          {/* Идентификаторы датчиков */}
          <div>
            <label htmlFor="sensorIds" className="block text-gray-700 mb-2">
              Идентификаторы датчиков (SENSORids - Sids)
            </label>
            <input
              type="text"
              id="sensorIds"
              value={sensorIds}
              onChange={(e) => setSensorIds(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              placeholder="Например: TEMP001, HUM001, WEIGHT001"
            />
            <p className="text-gray-500 text-sm mt-1">
              ID датчиков температуры, влажности, веса через запятую
            </p>
          </div>

          {/* Типы датчиков */}
          <div>
            <label className="block text-gray-700 mb-2">Типы датчиков</label>
            <div className="space-y-2">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={sensorTypes.includes('weight')}
                  onChange={() => toggleSensor('weight')}
                />
                Вес
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={sensorTypes.includes('temp')}
                  onChange={() => toggleSensor('temp')}
                />
                Температура
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={sensorTypes.includes('hum')}
                  onChange={() => toggleSensor('hum')}
                />
                Влажность
              </label>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 py-3 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors"
            >
              Добавить улей
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Отмена
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}