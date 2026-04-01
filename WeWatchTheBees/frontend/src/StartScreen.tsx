import { useState, useContext } from 'react';
import { AuthContext } from './context/AuthContext';
import { LoginModal } from './LoginModal';
import { RegisterModal } from './RegisterModal';

export function StartScreen() {
  const { user } = useContext(AuthContext);
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  // Если уже залогинен, не показываем стартовый экран (это обработает App)
  if (user) return null;

  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center"
      style={{ backgroundImage: "url('/back1.jpg')" }}
    >
      <div className="text-center bg-white/80 backdrop-blur-sm p-8 rounded-xl shadow-lg">
        <div className="flex items-center gap-3 justify-center mb-4">
          <div className="w-24 h-24 rounded-full overflow-hidden bg-white flex items-center justify-center">
            <img
              src="/logo.jpg"
              alt="Логотип"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="text-left">
            <h1 className="text-3xl font-bold text-amber-700">We Watch the Bees</h1>
            <p className="text-gray-600 text-lg">Сообщество пчеловодов</p>
          </div>
        </div>

        <div className="flex gap-4 justify-center mt-6">
          <button
            onClick={() => setShowLogin(true)}
            className="px-6 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors"
          >
            Войти
          </button>
          <button
            onClick={() => setShowRegister(true)}
            className="px-6 py-2 bg-white text-amber-600 border border-amber-500 rounded-lg hover:bg-amber-50 transition-colors"
          >
            Регистрация
          </button>
        </div>
      </div>

      <LoginModal isOpen={showLogin} onClose={() => setShowLogin(false)} />
      <RegisterModal isOpen={showRegister} onClose={() => setShowRegister(false)} />
    </div>
  );
}