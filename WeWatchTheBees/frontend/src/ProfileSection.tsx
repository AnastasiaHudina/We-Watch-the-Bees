import { useState, useEffect, useContext } from 'react';
import { User, Mail, Lock, Bell, Save, CheckCircle, XCircle } from 'lucide-react';
import api from './api';
import { AuthContext } from './context/AuthContext';

interface ValidationError {
  field: string;
  message: string;
}

export function ProfileSection() {
  const { user: authUser, logout } = useContext(AuthContext); // user из контекста
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    username: '',
    email: '',
  });
  const [password, setPassword] = useState(''); // для нового пароля (не храним старый)
  const [loading, setLoading] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errors, setErrors] = useState<ValidationError[]>([]);

  // Загрузка данных пользователя
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get('/user/');
        setProfileData({
          username: res.data.username,
          email: res.data.email,
        });
      } catch (err) {
        console.error('Ошибка загрузки профиля', err);
      } finally {
        setLoading(false);
      }
    };
    if (authUser) fetchUser();
  }, [authUser]);

  // Состояние для редактирования
  const [editData, setEditData] = useState(profileData);
  const [editPassword, setEditPassword] = useState('');

  // Синхронизация editData при загрузке
  useEffect(() => {
    setEditData(profileData);
  }, [profileData]);

  const validateData = (): ValidationError[] => {
    const validationErrors: ValidationError[] = [];

    if (!editData.username.trim()) {
      validationErrors.push({
        field: 'username',
        message: 'Имя не может быть пустым'
      });
    } else if (editData.username.trim().length < 2) {
      validationErrors.push({
        field: 'username',
        message: 'Имя должно содержать минимум 2 символа'
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!editData.email.trim()) {
      validationErrors.push({
        field: 'email',
        message: 'Email не может быть пустым'
      });
    } else if (!emailRegex.test(editData.email)) {
      validationErrors.push({
        field: 'email',
        message: 'Некорректный формат email'
      });
    }

    if (editPassword && editPassword.length < 6) {
      validationErrors.push({
        field: 'password',
        message: 'Пароль должен содержать минимум 6 символов'
      });
    }

    return validationErrors;
  };

  const handleSave = async () => {
    const validationErrors = validateData();

    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      setShowError(true);
      setShowSuccess(false);
      return;
    }

    try {
      const payload: any = {
        username: editData.username,
        email: editData.email,
      };
      if (editPassword) {
        payload.password = editPassword;
      }
      const res = await api.put('/user/update/', payload);
      setProfileData({
        username: res.data.username,
        email: res.data.email,
      });
      setEditPassword('');
      setIsEditing(false);
      setErrors([]);
      setShowError(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (err) {
      console.error('Ошибка сохранения', err);
      setShowError(true);
      setErrors([{ field: 'general', message: 'Не удалось сохранить данные' }]);
    }
  };

  const handleCancel = () => {
    setEditData(profileData);
    setEditPassword('');
    setIsEditing(false);
    setErrors([]);
    setShowError(false);
  };

  const getFieldError = (field: string): string | undefined => {
    return errors.find(err => err.field === field)?.message;
  };

  // Настройки уведомлений (пока локальные)
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    sensorAlerts: true,
    forumUpdates: false,
    weeklyDigest: true
  });

  if (loading) return <div className="max-w-4xl mx-auto">Загрузка профиля...</div>;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h2 className="text-gray-800 mb-2">Профиль пользователя</h2>
        <p className="text-gray-600">Управление личной информацией и настройками</p>
      </div>

      {/* Уведомления */}
      {showSuccess && (
        <div className="mb-6 bg-green-50 border-2 border-green-500 rounded-xl p-4 flex items-center gap-3">
          <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
          <div>
            <div className="text-green-800">Сохранено</div>
            <div className="text-green-600 text-sm">Ваши данные успешно обновлены</div>
          </div>
        </div>
      )}

      {showError && errors.length > 0 && (
        <div className="mb-6 bg-red-50 border-2 border-red-500 rounded-xl p-4">
          <div className="flex items-start gap-3 mb-3">
            <XCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <div className="text-red-800 mb-2">Ошибка валидации</div>
              <div className="text-red-600 text-sm">Пожалуйста, исправьте следующие ошибки:</div>
            </div>
          </div>
          <ul className="list-disc list-inside space-y-1 ml-9 text-sm text-red-700">
            {errors.map((error, index) => (
              <li key={index}>{error.message}</li>
            ))}
          </ul>
          <button
            onClick={() => setShowError(false)}
            className="mt-3 ml-9 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
          >
            Закрыть
          </button>
        </div>
      )}

      <div className="grid gap-6">
        {/* Личная информация */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-amber-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-gray-800 flex items-center gap-2">
              <User className="w-5 h-5 text-amber-600" />
              Личная информация
            </h3>
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors text-sm"
              >
                Редактировать
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={handleSave}
                  className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm"
                >
                  <Save className="w-4 h-4" />
                  Сохранить
                </button>
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm"
                >
                  Отмена
                </button>
              </div>
            )}
          </div>

          <div className="space-y-4">
            {/* Имя пользователя */}
            <div>
              <label className="block text-gray-700 mb-2 flex items-center gap-2">
                <User className="w-4 h-4 text-gray-500" />
                Имя пользователя
              </label>
              {isEditing ? (
                <>
                  <input
                    type="text"
                    value={editData.username}
                    onChange={(e) => setEditData({ ...editData, username: e.target.value })}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                      getFieldError('username')
                        ? 'border-red-500 focus:ring-red-500'
                        : 'border-gray-300 focus:ring-amber-500'
                    }`}
                  />
                  {getFieldError('username') && (
                    <p className="text-red-600 text-sm mt-1">{getFieldError('username')}</p>
                  )}
                </>
              ) : (
                <div className="px-4 py-2 bg-gray-50 rounded-lg text-gray-800">
                  {profileData.username}
                </div>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-gray-700 mb-2 flex items-center gap-2">
                <Mail className="w-4 h-4 text-gray-500" />
                Email
              </label>
              {isEditing ? (
                <>
                  <input
                    type="email"
                    value={editData.email}
                    onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                      getFieldError('email')
                        ? 'border-red-500 focus:ring-red-500'
                        : 'border-gray-300 focus:ring-amber-500'
                    }`}
                  />
                  {getFieldError('email') && (
                    <p className="text-red-600 text-sm mt-1">{getFieldError('email')}</p>
                  )}
                </>
              ) : (
                <div className="px-4 py-2 bg-gray-50 rounded-lg text-gray-800">
                  {profileData.email}
                </div>
              )}
            </div>

            {/* Пароль */}
            <div>
              <label className="block text-gray-700 mb-2 flex items-center gap-2">
                <Lock className="w-4 h-4 text-gray-500" />
                Пароль
              </label>
              {isEditing ? (
                <>
                  <input
                    type="password"
                    value={editPassword}
                    onChange={(e) => setEditPassword(e.target.value)}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                      getFieldError('password')
                        ? 'border-red-500 focus:ring-red-500'
                        : 'border-gray-300 focus:ring-amber-500'
                    }`}
                    placeholder="Введите новый пароль"
                  />
                  {getFieldError('password') ? (
                    <p className="text-red-600 text-sm mt-1">{getFieldError('password')}</p>
                  ) : (
                    <p className="text-gray-500 text-sm mt-1">
                      Оставьте поле пустым, если не хотите менять пароль
                    </p>
                  )}
                </>
              ) : (
                <div className="px-4 py-2 bg-gray-50 rounded-lg text-gray-800">
                  ••••••••
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Настройки уведомлений (локальные) */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-amber-100">
          <h3 className="text-gray-800 mb-6 flex items-center gap-2">
            <Bell className="w-5 h-5 text-amber-600" />
            Настройки уведомлений
          </h3>

          <div className="space-y-4">
            <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
              <div>
                <div className="text-gray-800 mb-1">Email уведомления</div>
                <div className="text-gray-500 text-sm">
                  Получать уведомления на электронную почту
                </div>
              </div>
              <input
                type="checkbox"
                checked={notifications.emailNotifications}
                onChange={(e) => setNotifications({ ...notifications, emailNotifications: e.target.checked })}
                className="w-5 h-5 text-amber-500 rounded border-gray-300 focus:ring-amber-500"
              />
            </label>

            <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
              <div>
                <div className="text-gray-800 mb-1">Оповещения от датчиков</div>
                <div className="text-gray-500 text-sm">
                  Уведомления о критических показателях датчиков
                </div>
              </div>
              <input
                type="checkbox"
                checked={notifications.sensorAlerts}
                onChange={(e) => setNotifications({ ...notifications, sensorAlerts: e.target.checked })}
                className="w-5 h-5 text-amber-500 rounded border-gray-300 focus:ring-amber-500"
              />
            </label>

            <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
              <div>
                <div className="text-gray-800 mb-1">Обновления форума</div>
                <div className="text-gray-500 text-sm">
                  Уведомления о новых статьях и комментариях
                </div>
              </div>
              <input
                type="checkbox"
                checked={notifications.forumUpdates}
                onChange={(e) => setNotifications({ ...notifications, forumUpdates: e.target.checked })}
                className="w-5 h-5 text-amber-500 rounded border-gray-300 focus:ring-amber-500"
              />
            </label>

            <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
              <div>
                <div className="text-gray-800 mb-1">Еженедельная сводка</div>
                <div className="text-gray-500 text-sm">
                  Получать еженедельный отчёт о состоянии пасеки
                </div>
              </div>
              <input
                type="checkbox"
                checked={notifications.weeklyDigest}
                onChange={(e) => setNotifications({ ...notifications, weeklyDigest: e.target.checked })}
                className="w-5 h-5 text-amber-500 rounded border-gray-300 focus:ring-amber-500"
              />
            </label>
          </div>
        </div>

        {/* Статистика (пока статична, можно позже сделать динамической) */}
        <div className="bg-gradient-to-r from-amber-500 to-amber-600 rounded-xl shadow-md p-6 text-white">
          <h3 className="text-white mb-4">Ваша активность</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white/20 rounded-lg p-4 backdrop-blur-sm">
              <div className="text-3xl mb-1">3</div>
              <div className="text-amber-100 text-sm">Ульев добавлено</div>
            </div>
            <div className="bg-white/20 rounded-lg p-4 backdrop-blur-sm">
              <div className="text-3xl mb-1">12</div>
              <div className="text-amber-100 text-sm">Прочитано статей</div>
            </div>
            <div className="bg-white/20 rounded-lg p-4 backdrop-blur-sm">
              <div className="text-3xl mb-1">5</div>
              <div className="text-amber-100 text-sm">Комментариев</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}