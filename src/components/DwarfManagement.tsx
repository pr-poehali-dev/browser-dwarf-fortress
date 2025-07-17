import { useState, useEffect } from 'react';
import { Plus, Star, Heart, Zap, Award, Users, Settings } from 'lucide-react';

interface Dwarf {
  id: string;
  name: string;
  avatar: string;
  level: number;
  health: number;
  maxHealth: number;
  energy: number;
  maxEnergy: number;
  happiness: number;
  profession: string;
  skills: {
    mining: number;
    crafting: number;
    fighting: number;
    magic: number;
  };
  status: 'working' | 'resting' | 'fighting' | 'idle';
  location: string;
  experience: number;
  maxExperience: number;
}

const DwarfManagement = () => {
  const [dwarfs, setDwarfs] = useState<Dwarf[]>([]);
  const [selectedDwarf, setSelectedDwarf] = useState<Dwarf | null>(null);
  const [showAddDwarf, setShowAddDwarf] = useState(false);

  const professions = [
    { id: 'miner', name: 'Шахтёр', icon: '⛏️', color: 'text-yellow-500' },
    { id: 'warrior', name: 'Воин', icon: '⚔️', color: 'text-red-500' },
    { id: 'builder', name: 'Строитель', icon: '🔨', color: 'text-blue-500' },
    { id: 'mage', name: 'Маг', icon: '🔮', color: 'text-purple-500' },
    { id: 'cook', name: 'Повар', icon: '🍳', color: 'text-green-500' },
    { id: 'trader', name: 'Торговец', icon: '💼', color: 'text-orange-500' }
  ];

  const animeAvatars = ['🧙‍♀️', '👸', '🦸‍♀️', '🧚‍♀️', '👩‍🎨', '👩‍🔬', '🧝‍♀️', '👩‍⚕️'];

  const generateDwarf = (): Dwarf => {
    const names = ['Сакура', 'Юки', 'Аками', 'Мидори', 'Широ', 'Куро', 'Хана', 'Цуки'];
    const profession = professions[Math.floor(Math.random() * professions.length)];
    
    return {
      id: Math.random().toString(36).substr(2, 9),
      name: names[Math.floor(Math.random() * names.length)],
      avatar: animeAvatars[Math.floor(Math.random() * animeAvatars.length)],
      level: 1,
      health: 100,
      maxHealth: 100,
      energy: 100,
      maxEnergy: 100,
      happiness: 80,
      profession: profession.id,
      skills: {
        mining: Math.floor(Math.random() * 50) + 10,
        crafting: Math.floor(Math.random() * 50) + 10,
        fighting: Math.floor(Math.random() * 50) + 10,
        magic: Math.floor(Math.random() * 50) + 10
      },
      status: 'idle',
      location: 'Главный зал',
      experience: 0,
      maxExperience: 100
    };
  };

  useEffect(() => {
    const initialDwarfs = Array.from({ length: 7 }, generateDwarf);
    setDwarfs(initialDwarfs);
  }, []);

  const getProfessionInfo = (professionId: string) => {
    return professions.find(p => p.id === professionId) || professions[0];
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'working': return 'text-green-500';
      case 'resting': return 'text-blue-500';
      case 'fighting': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'working': return 'Работает';
      case 'resting': return 'Отдыхает';
      case 'fighting': return 'Сражается';
      default: return 'Свободен';
    }
  };

  const handleAddDwarf = () => {
    const newDwarf = generateDwarf();
    setDwarfs([...dwarfs, newDwarf]);
    setShowAddDwarf(false);
  };

  const changeProfession = (dwarfId: string, newProfession: string) => {
    setDwarfs(dwarfs.map(dwarf => 
      dwarf.id === dwarfId 
        ? { ...dwarf, profession: newProfession }
        : dwarf
    ));
  };

  return (
    <div className="h-full bg-slate-900 overflow-hidden">
      {/* Header */}
      <div className="bg-slate-800 p-4 border-b border-slate-700">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-200 flex items-center">
            <Users className="mr-2" size={24} />
            Дварфы ({dwarfs.length})
          </h2>
          <button
            onClick={() => setShowAddDwarf(true)}
            className="bg-purple-600 hover:bg-purple-700 text-white p-2 rounded-lg transition-colors"
          >
            <Plus size={20} />
          </button>
        </div>
      </div>

      <div className="flex h-[calc(100%-80px)]">
        {/* Dwarfs List */}
        <div className="w-1/2 overflow-y-auto p-4 space-y-3">
          {dwarfs.map((dwarf) => {
            const profession = getProfessionInfo(dwarf.profession);
            return (
              <div
                key={dwarf.id}
                onClick={() => setSelectedDwarf(dwarf)}
                className={`bg-slate-800 p-3 rounded-lg cursor-pointer transition-all duration-200 border-2 ${
                  selectedDwarf?.id === dwarf.id
                    ? 'border-purple-500 bg-slate-700'
                    : 'border-slate-700 hover:border-slate-600'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="text-2xl">{dwarf.avatar}</div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-slate-200">{dwarf.name}</h3>
                      <div className="flex items-center space-x-1">
                        <Star className="text-yellow-500" size={16} />
                        <span className="text-sm text-slate-300">{dwarf.level}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <span className={profession.color}>{profession.icon}</span>
                      <span className="text-slate-300">{profession.name}</span>
                      <span className={getStatusColor(dwarf.status)}>
                        • {getStatusText(dwarf.status)}
                      </span>
                    </div>
                    <div className="flex space-x-2 mt-1">
                      <div className="flex-1 bg-slate-700 rounded-full h-2">
                        <div 
                          className="bg-red-500 h-2 rounded-full"
                          style={{ width: `${(dwarf.health / dwarf.maxHealth) * 100}%` }}
                        />
                      </div>
                      <div className="flex-1 bg-slate-700 rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full"
                          style={{ width: `${(dwarf.energy / dwarf.maxEnergy) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Dwarf Details */}
        <div className="w-1/2 bg-slate-800 border-l border-slate-700">
          {selectedDwarf ? (
            <div className="p-4 h-full overflow-y-auto">
              <div className="text-center mb-6">
                <div className="text-6xl mb-2">{selectedDwarf.avatar}</div>
                <h2 className="text-2xl font-bold text-slate-200 mb-1">{selectedDwarf.name}</h2>
                <div className="flex items-center justify-center space-x-2">
                  <span className={getProfessionInfo(selectedDwarf.profession).color}>
                    {getProfessionInfo(selectedDwarf.profession).icon}
                  </span>
                  <span className="text-slate-300">{getProfessionInfo(selectedDwarf.profession).name}</span>
                  <span className="text-sm text-slate-400">Ур. {selectedDwarf.level}</span>
                </div>
              </div>

              {/* Stats */}
              <div className="space-y-4 mb-6">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-300">Здоровье</span>
                    <span className="text-slate-400">{selectedDwarf.health}/{selectedDwarf.maxHealth}</span>
                  </div>
                  <div className="bg-slate-700 rounded-full h-3">
                    <div 
                      className="bg-red-500 h-3 rounded-full"
                      style={{ width: `${(selectedDwarf.health / selectedDwarf.maxHealth) * 100}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-300">Энергия</span>
                    <span className="text-slate-400">{selectedDwarf.energy}/{selectedDwarf.maxEnergy}</span>
                  </div>
                  <div className="bg-slate-700 rounded-full h-3">
                    <div 
                      className="bg-blue-500 h-3 rounded-full"
                      style={{ width: `${(selectedDwarf.energy / selectedDwarf.maxEnergy) * 100}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-300">Счастье</span>
                    <span className="text-slate-400">{selectedDwarf.happiness}%</span>
                  </div>
                  <div className="bg-slate-700 rounded-full h-3">
                    <div 
                      className="bg-yellow-500 h-3 rounded-full"
                      style={{ width: `${selectedDwarf.happiness}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-300">Опыт</span>
                    <span className="text-slate-400">{selectedDwarf.experience}/{selectedDwarf.maxExperience}</span>
                  </div>
                  <div className="bg-slate-700 rounded-full h-3">
                    <div 
                      className="bg-purple-500 h-3 rounded-full"
                      style={{ width: `${(selectedDwarf.experience / selectedDwarf.maxExperience) * 100}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Skills */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-slate-200 mb-3">Навыки</h3>
                <div className="grid grid-cols-2 gap-3">
                  {Object.entries(selectedDwarf.skills).map(([skill, value]) => (
                    <div key={skill} className="bg-slate-700 p-3 rounded-lg">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm text-slate-300 capitalize">{skill}</span>
                        <span className="text-sm text-slate-400">{value}</span>
                      </div>
                      <div className="bg-slate-600 rounded-full h-2">
                        <div 
                          className="bg-green-500 h-2 rounded-full"
                          style={{ width: `${value}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Profession Change */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-slate-200 mb-3">Сменить профессию</h3>
                <div className="grid grid-cols-2 gap-2">
                  {professions.map((profession) => (
                    <button
                      key={profession.id}
                      onClick={() => changeProfession(selectedDwarf.id, profession.id)}
                      className={`p-2 rounded-lg border-2 transition-all duration-200 ${
                        selectedDwarf.profession === profession.id
                          ? 'border-purple-500 bg-purple-500/20'
                          : 'border-slate-600 bg-slate-700 hover:border-slate-500'
                      }`}
                    >
                      <div className="text-center">
                        <span className="text-lg">{profession.icon}</span>
                        <div className="text-xs text-slate-300">{profession.name}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2">
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors">
                  Дать задание
                </button>
                <button className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition-colors">
                  Отправить отдыхать
                </button>
                <button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg transition-colors">
                  Обучить навыкам
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-slate-400">
              <div className="text-center">
                <Users size={48} className="mx-auto mb-4" />
                <p>Выберите дварфа для просмотра деталей</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add Dwarf Modal */}
      {showAddDwarf && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-slate-800 p-6 rounded-lg max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-slate-200 mb-4">Нанять нового дварфа</h3>
            <p className="text-slate-300 mb-4">
              Новый дварф присоединится к вашей колонии со случайными характеристиками.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={handleAddDwarf}
                className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg transition-colors"
              >
                Нанять
              </button>
              <button
                onClick={() => setShowAddDwarf(false)}
                className="flex-1 bg-slate-600 hover:bg-slate-700 text-white py-2 px-4 rounded-lg transition-colors"
              >
                Отмена
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DwarfManagement;