import { useState } from 'react';

interface EditHiveModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (id: number, data: {
    name: string;
    hive_id?: string;
    bee_info?: string;
  }) => void;
  hive: {
    id: number;
    name: string;
    hive_id?: string;
    bee_info?: string;
  };
}

export function EditHiveModal({ isOpen, onClose, onSave, hive }: EditHiveModalProps) {
  const [name, setName] = useState(hive.name);
  const [hiveId, setHiveId] = useState(hive.hive_id || '');
  const [beeInfo, setBeeInfo] = useState(hive.bee_info || '');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSave(hive.id, {
      name,
      hive_id: hiveId || undefined,
      bee_info: beeInfo || undefined,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center gap-4">
          <h2 className="text-gray-800">Редактировать улей</h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label htmlFor="editName" className="block text-gray-700 mb-2">
              Название улья
            </label>
            <input
              type="text"
              id="editName"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              required
            />
          </div>

          <div>
            <label htmlFor="editHiveId" className="block text-gray-700 mb-2">
              Идентификатор улья (HIVEid - Hid)
            </label>
            <input
              type="text"
              id="editHiveId"
              value={hiveId}
              onChange={(e) => setHiveId(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div>
            <label htmlFor="editBeeInfo" className="block text-gray-700 mb-2">
              Данные о пчелосемье (BEEinfo - Binf)
            </label>
            <textarea
              id="editBeeInfo"
              value={beeInfo}
              onChange={(e) => setBeeInfo(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 min-h-[100px]"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 py-3 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors"
            >
              Сохранить
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