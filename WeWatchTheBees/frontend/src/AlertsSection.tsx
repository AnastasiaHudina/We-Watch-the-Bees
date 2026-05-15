import { useState, useEffect, useCallback } from 'react';
import { AlertTriangle, CheckCheck, Check } from 'lucide-react';
import api from './api';

export interface AlertItem {
  id: number;
  hive: number;
  hive_name: string;
  message: string;
  severity: 'warning' | 'critical';
  sensor_type: string;
  status: 'new' | 'read';
  timestamp: string;
}

type StatusFilter = 'all' | 'new' | 'read';

interface AlertsSectionProps {
  onUnreadChange?: (count: number) => void;
}

export function AlertsSection({ onUnreadChange }: AlertsSectionProps) {
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');

  const loadAlerts = useCallback(async () => {
    try {
      const params: Record<string, string> = {};
      if (statusFilter !== 'all') {
        params.status = statusFilter;
      }
      const res = await api.get<AlertItem[]>('/alerts/', { params });
      const data = Array.isArray(res.data) ? res.data : [];
      setAlerts(data);
    } catch (err) {
      console.error('Ошибка загрузки оповещений', err);
      setAlerts([]);
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  const loadUnreadCount = useCallback(async () => {
    try {
      const res = await api.get<{ count: number }>('/alerts/unread-count/');
      onUnreadChange?.(res.data.count);
    } catch (err) {
      console.error('Ошибка загрузки счётчика оповещений', err);
    }
  }, [onUnreadChange]);

  useEffect(() => {
    setLoading(true);
    loadAlerts();
  }, [loadAlerts]);

  useEffect(() => {
    loadUnreadCount();
    const interval = setInterval(() => {
      loadAlerts();
      loadUnreadCount();
    }, 5000);
    return () => clearInterval(interval);
  }, [loadAlerts, loadUnreadCount]);

  const markAsRead = async (id: number) => {
    try {
      await api.patch(`/alerts/${id}/read/`);
      await loadAlerts();
      await loadUnreadCount();
    } catch (err) {
      console.error('Ошибка пометки оповещения', err);
    }
  };

  const markAllAsRead = async () => {
    try {
      await api.post('/alerts/mark-all-read/');
      await loadAlerts();
      await loadUnreadCount();
    } catch (err) {
      console.error('Ошибка пометки всех оповещений', err);
    }
  };

  const formatDate = (timestamp: string) =>
    new Date(timestamp).toLocaleString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

  const unreadInList = alerts.filter((a) => a.status === 'new').length;

  return (
    <div>
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-gray-800 mb-2">Оповещения</h2>
          <p className="text-gray-600 text-sm">
            Сообщения о превышении порогов показаний датчиков
          </p>
        </div>
        {unreadInList > 0 && statusFilter !== 'read' && (
          <button
            onClick={markAllAsRead}
            className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 text-sm"
          >
            <CheckCheck className="w-4 h-4" />
            Прочитать все
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {(['all', 'new', 'read'] as StatusFilter[]).map((filter) => (
          <button
            key={filter}
            onClick={() => setStatusFilter(filter)}
            className={`px-4 py-2 rounded-lg text-sm transition-colors ${
              statusFilter === filter
                ? 'bg-amber-500 text-white'
                : 'bg-white/80 text-gray-700 hover:bg-amber-50 border border-amber-200'
            }`}
          >
            {filter === 'all' && 'Все'}
            {filter === 'new' && 'Непрочитанные'}
            {filter === 'read' && 'Прочитанные'}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-gray-600">Загрузка...</p>
      ) : alerts.length === 0 ? (
        <div className="bg-white/90 rounded-xl p-10 text-center border border-amber-100">
          <AlertTriangle className="w-12 h-12 text-amber-400 mx-auto mb-3" />
          <p className="text-gray-700">Оповещений пока нет</p>
          <p className="text-gray-500 text-sm mt-1">
            Они появятся при отклонении температуры, влажности или веса от нормы
          </p>
        </div>
      ) : (
        <ul className="space-y-3">
          {alerts.map((alert) => (
            <li
              key={alert.id}
              className={`rounded-xl border p-4 flex gap-4 ${
                alert.status === 'new'
                  ? alert.severity === 'critical'
                    ? 'bg-red-50 border-red-200'
                    : 'bg-yellow-50 border-yellow-200'
                  : 'bg-white/90 border-gray-200'
              }`}
            >
              <div className="flex-shrink-0 mt-1">
                <AlertTriangle
                  className={`w-5 h-5 ${
                    alert.severity === 'critical' ? 'text-red-600' : 'text-yellow-600'
                  }`}
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className="font-medium text-gray-800">{alert.hive_name}</span>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ${
                      alert.severity === 'critical'
                        ? 'bg-red-200 text-red-800'
                        : 'bg-yellow-200 text-yellow-800'
                    }`}
                  >
                    {alert.severity === 'critical' ? 'Критично' : 'Предупреждение'}
                  </span>
                  {alert.status === 'new' && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-amber-200 text-amber-900">
                      Новое
                    </span>
                  )}
                </div>
                <p className="text-gray-700 text-sm">{alert.message}</p>
                <p className="text-gray-400 text-xs mt-2">{formatDate(alert.timestamp)}</p>
              </div>
              {alert.status === 'new' && (
                <button
                  onClick={() => markAsRead(alert.id)}
                  className="flex-shrink-0 self-start p-2 text-amber-700 hover:bg-amber-100 rounded-lg"
                  title="Пометить прочитанным"
                >
                  <Check className="w-5 h-5" />
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
