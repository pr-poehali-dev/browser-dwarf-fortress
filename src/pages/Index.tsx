import { useState } from 'react';
import { Menu, Home, Map, Users, Hammer, Shield, Store, Sparkles } from 'lucide-react';
import GameMenu from '../components/GameMenu';
import WorldMap from '../components/WorldMap';
import DwarfManagement from '../components/DwarfManagement';
import Building from '../components/Building';
import Combat from '../components/Combat';
import Trading from '../components/Trading';
import Magic from '../components/Magic';

type GameScreen = 'menu' | 'world' | 'dwarfs' | 'building' | 'combat' | 'trading' | 'magic';

function Index() {
  const [currentScreen, setCurrentScreen] = useState<GameScreen>('menu');
  const [gameStarted, setGameStarted] = useState(false);

  const navigationItems = [
    { id: 'world', icon: Map, label: 'Мир', color: 'text-green-500' },
    { id: 'dwarfs', icon: Users, label: 'Дварфы', color: 'text-blue-500' },
    { id: 'building', icon: Hammer, label: 'Строить', color: 'text-orange-500' },
    { id: 'combat', icon: Shield, label: 'Бой', color: 'text-red-500' },
    { id: 'trading', icon: Store, label: 'Торговля', color: 'text-purple-500' },
    { id: 'magic', icon: Sparkles, label: 'Магия', color: 'text-pink-500' },
  ];

  const renderCurrentScreen = () => {
    if (!gameStarted) return <GameMenu onStartGame={() => setGameStarted(true)} />;
    
    switch (currentScreen) {
      case 'world':
        return <WorldMap />;
      case 'dwarfs':
        return <DwarfManagement />;
      case 'building':
        return <Building />;
      case 'combat':
        return <Combat />;
      case 'trading':
        return <Trading />;
      case 'magic':
        return <Magic />;
      default:
        return <WorldMap />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden">
      {/* Header */}
      <div className="h-16 bg-slate-800/80 backdrop-blur-sm border-b border-slate-700 flex items-center justify-between px-4">
        <div className="flex items-center space-x-2">
          <Menu size={24} className="text-slate-300" />
          <h1 className="text-lg font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
            Dwarf Fortress ⚔️
          </h1>
        </div>
        <div className="flex space-x-1">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse delay-100"></div>
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse delay-200"></div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 h-[calc(100vh-8rem)]">
        {renderCurrentScreen()}
      </div>

      {/* Bottom Navigation */}
      {gameStarted && (
        <div className="h-16 bg-slate-800/90 backdrop-blur-sm border-t border-slate-700">
          <div className="flex justify-around items-center h-full px-2">
            {navigationItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setCurrentScreen(item.id as GameScreen)}
                className={`flex flex-col items-center justify-center space-y-1 p-2 rounded-lg transition-all duration-200 ${
                  currentScreen === item.id
                    ? 'bg-slate-700 scale-105'
                    : 'hover:bg-slate-700/50'
                }`}
              >
                <item.icon 
                  size={20} 
                  className={`${item.color} ${currentScreen === item.id ? 'drop-shadow-lg' : ''}`}
                />
                <span className="text-xs font-medium text-slate-300">{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Index;