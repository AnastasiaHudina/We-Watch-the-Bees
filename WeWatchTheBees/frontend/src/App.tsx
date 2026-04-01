import './globals.css';
import { useState, useContext } from 'react';
import { Header } from './Header';
import { MyApiariesSection } from './MyApiariesSection';
import { KnowledgeBaseSection } from './KnowledgeBaseSection';
import { ProfileSection } from './ProfileSection';
import { StartScreen } from './StartScreen';
import { AuthContext } from './context/AuthContext';

type TabType = 'apiaries' | 'knowledge' | 'profile';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('apiaries');
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="min-h-screen bg-cover bg-center bg-no-repeat bg-fixed" style={{ backgroundImage: "url('/background1.png')" }}>
        <div className="flex items-center justify-center h-screen">
          <div className="text-white text-xl">Загрузка...</div>
        </div>
      </div>
    );
  }

  if (!user) {
    return <StartScreen />;
  }

  return (
    <div className="min-h-screen bg-cover bg-center bg-no-repeat bg-fixed" style={{ backgroundImage: "url('/background1.png')" }}>
      {/* Декоративные элементы (закомментированы) */}
      {/*<div className="absolute top-10 right-20 opacity-10 w-32 h-32 pointer-events-none">
        <img
          src="https://images.unsplash.com/photo-1650598308282-9629a232e77f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZWVoaXZlJTIwaG9uZXljb21iJTIwcGF0dGVybnxlbnwxfHx8fDE3NjQ5NzA5ODh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
          alt=""
          className="w-full h-full object-cover rounded-lg"
        />
      </div>
      <div className="absolute bottom-20 left-10 opacity-10 w-40 h-40 pointer-events-none">
        <img
          src="https://images.unsplash.com/photo-1590944402601-b055fd554897?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob25leWNvbWIlMjBiZWVzfGVufDF8fHx8MTc2NDk3MDk4OHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
          alt=""
          className="w-full h-full object-cover rounded-lg"
        />
      </div>
      <div className="absolute top-1/2 right-10 opacity-10 w-24 h-24 pointer-events-none">
        <img
          src="https://images.unsplash.com/photo-1664994577914-420014ebace6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob25leSUyMGJlZSUyMGNsb3NlfGVufDF8fHx8MTc2NDk3MDk4OHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
          alt=""
          className="w-full h-full object-cover rounded-full"
        />
      </div>
      <div className="absolute bottom-40 right-1/4 opacity-10 w-28 h-28 pointer-events-none">
        <img
          src="https://images.unsplash.com/photo-1650598308282-9629a232e77f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZWVoaXZlJTIwaG9uZXljb21iJTIwcGF0dGVybnxlbnwxfHx8fDE3NjQ5NzA5ODh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
          alt=""
          className="w-full h-full object-cover rounded-lg rotate-45"
        />
      </div>*/}

      <div className="relative z-10">
        <Header />

        {/* Tabs Navigation */}
        <div className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-amber-200">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex gap-2 overflow-x-auto">
              <button
                onClick={() => setActiveTab('apiaries')}
                className={`px-6 py-4 transition-all border-b-2 whitespace-nowrap ${
                  activeTab === 'apiaries'
                    ? 'border-amber-500 text-amber-700 bg-amber-50/50'
                    : 'border-transparent text-gray-600 hover:text-amber-600 hover:bg-amber-50/30'
                }`}
              >
                Моя Пасека
              </button>
              <button
                onClick={() => setActiveTab('knowledge')}
                className={`px-6 py-4 transition-all border-b-2 whitespace-nowrap ${
                  activeTab === 'knowledge'
                    ? 'border-amber-500 text-amber-700 bg-amber-50/50'
                    : 'border-transparent text-gray-600 hover:text-amber-600 hover:bg-amber-50/30'
                }`}
              >
                База Знаний
              </button>
              <button
                onClick={() => setActiveTab('profile')}
                className={`px-6 py-4 transition-all border-b-2 ${
                  activeTab === 'profile'
                    ? 'border-amber-500 text-amber-700 bg-amber-50/50'
                    : 'border-transparent text-gray-600 hover:text-amber-600 hover:bg-amber-50/30'
                }`}
              >
                Профиль
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <main className="max-w-6xl mx-auto px-4 py-8">
          {activeTab === 'apiaries' && <MyApiariesSection />}
          {activeTab === 'knowledge' && <KnowledgeBaseSection />}
          {activeTab === 'profile' && <ProfileSection />}
        </main>
      </div>
    </div>
  );
}