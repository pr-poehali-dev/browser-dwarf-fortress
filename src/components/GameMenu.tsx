import { useState } from 'react';
import { Play, Settings, BookOpen, Crown, Star } from 'lucide-react';

interface GameMenuProps {
  onStartGame: () => void;
}

const GameMenu = ({ onStartGame }: GameMenuProps) => {
  const [selectedDifficulty, setSelectedDifficulty] = useState<'easy' | 'normal' | 'hard'>('normal');

  const difficulties = [
    { id: 'easy', label: 'Лёгкий', icon: '🌸', description: 'Больше ресурсов, мирные враги' },
    { id: 'normal', label: 'Нормальный', icon: '⚔️', description: 'Сбалансированный опыт' },
    { id: 'hard', label: 'Сложный', icon: '💀', description: 'Выживание для смельчаков' }
  ];

  return (
    <div className="h-full flex flex-col items-center justify-center bg-gradient-to-b from-purple-900/20 to-pink-900/20 px-4">
      {/* Logo */}
      <div className="text-center mb-8">
        <div className="text-6xl mb-4">🏰</div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent mb-2">
          Dwarf Fortress
        </h1>
        <p className="text-slate-400 text-lg">Аниме Версия</p>
      </div>

      {/* Difficulty Selection */}
      <div className="w-full max-w-md mb-8">
        <h3 className="text-xl font-semibold mb-4 text-center text-slate-200">Выберите сложность</h3>
        <div className="space-y-3">
          {difficulties.map((diff) => (
            <button
              key={diff.id}
              onClick={() => setSelectedDifficulty(diff.id as any)}
              className={`w-full p-4 rounded-xl border-2 transition-all duration-300 ${
                selectedDifficulty === diff.id
                  ? 'border-purple-500 bg-purple-500/20 shadow-lg shadow-purple-500/25'
                  : 'border-slate-600 bg-slate-800/50 hover:border-slate-500'
              }`}
            >
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{diff.icon}</span>
                <div className="flex-1 text-left">
                  <div className="font-semibold text-slate-200">{diff.label}</div>
                  <div className="text-sm text-slate-400">{diff.description}</div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Menu Buttons */}
      <div className="space-y-4 w-full max-w-md">
        <button
          onClick={onStartGame}
          className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 flex items-center justify-center space-x-2"
        >
          <Play size={24} />
          <span>Начать игру</span>
        </button>

        <button className="w-full bg-slate-700 hover:bg-slate-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 flex items-center justify-center space-x-2">
          <BookOpen size={20} />
          <span>Обучение</span>
        </button>

        <button className="w-full bg-slate-700 hover:bg-slate-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 flex items-center justify-center space-x-2">
          <Settings size={20} />
          <span>Настройки</span>
        </button>
      </div>

      {/* Footer */}
      <div className="mt-8 text-center text-slate-500">
        <p className="text-sm">Версия 1.0.0</p>
        <p className="text-xs mt-1">Создано с ❤️ для мобильных устройств</p>
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-purple-400 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default GameMenu;