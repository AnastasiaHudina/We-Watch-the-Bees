import { useContext } from 'react';
import { Bell } from 'lucide-react';
import { AuthContext } from './context/AuthContext';

interface HeaderProps {
  unreadAlerts?: number;
  onOpenAlerts?: () => void;
}

export function Header({ unreadAlerts = 0, onOpenAlerts }: HeaderProps) {
  const { user, logout } = useContext(AuthContext);

  return (
    <header className="bg-amber-500 text-white shadow-lg">
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full overflow-hidden bg-white flex items-center justify-center">
              <img src="/logo.jpg" alt="Логотип" className="w-full h-full object-cover" />
            </div>
            <div>
              <h1 className="text-white">We Watch the Bees</h1>
              <p className="text-amber-100 text-sm">Сообщество пчеловодов</p>
            </div>
          </div>

          {user && (
            <div className="flex items-center gap-3">
              {onOpenAlerts && (
                <button
                  onClick={onOpenAlerts}
                  className="relative p-2 rounded-lg hover:bg-white/20 transition-colors"
                  title="Оповещения"
                >
                  <Bell className="w-6 h-6" />
                  {unreadAlerts > 0 && (
                    <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1 flex items-center justify-center text-xs font-bold bg-red-600 text-white rounded-full">
                      {unreadAlerts > 99 ? '99+' : unreadAlerts}
                    </span>
                  )}
                </button>
              )}
              <span className="text-white hidden sm:inline">Здравствуйте, {user.username}</span>
              <button
                onClick={() => logout()}
                className="px-5 py-2 bg-white text-amber-600 rounded-lg hover:bg-amber-50 transition-colors"
              >
                Выйти
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
