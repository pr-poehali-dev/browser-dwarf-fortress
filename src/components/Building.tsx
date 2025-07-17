import { useState } from 'react';
import { Hammer, Home, Shield, Zap, TreePine, Pickaxe, Store, Heart } from 'lucide-react';

interface Building {
  id: string;
  name: string;
  icon: string;
  description: string;
  cost: {
    wood: number;
    stone: number;
    gold: number;
  };
  buildTime: number;
  category: 'housing' | 'defense' | 'production' | 'special';
  requirements?: string[];
}

const Building = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('housing');
  const [selectedBuilding, setSelectedBuilding] = useState<Building | null>(null);
  const [resources] = useState({ wood: 30, stone: 25, gold: 15 });
  const [constructionQueue, setConstructionQueue] = useState<Building[]>([]);

  const categories = [
    { id: 'housing', name: 'Жильё', icon: Home, color: 'text-blue-500' },
    { id: 'defense', name: 'Оборона', icon: Shield, color: 'text-red-500' },
    { id: 'production', name: 'Производство', icon: Hammer, color: 'text-orange-500' },
    { id: 'special', name: 'Особое', icon: Zap, color: 'text-purple-500' }
  ];

  const buildings: Building[] = [
    {
      id: 'house',
      name: 'Дом дварфа',
      icon: '🏠',
      description: 'Уютное жильё для дварфа. Увеличивает счастье.',
      cost: { wood: 10, stone: 5, gold: 2 },
      buildTime: 60,
      category: 'housing'
    },
    {
      id: 'mansion',
      name: 'Особняк',
      icon: '🏘️',
      description: 'Роскошное жильё для знатных дварфов.',
      cost: { wood: 25, stone: 15, gold: 10 },
      buildTime: 180,
      category: 'housing',
      requirements: ['house']
    },
    {
      id: 'wall',
      name: 'Стена',
      icon: '🧱',
      description: 'Защищает от вражеских атак.',
      cost: { wood: 0, stone: 8, gold: 0 },
      buildTime: 45,
      category: 'defense'
    },
    {
      id: 'tower',
      name: 'Башня',
      icon: '🗼',
      description: 'Укреплённая позиция для лучников.',
      cost: { wood: 5, stone: 20, gold: 5 },
      buildTime: 120,
      category: 'defense'
    },
    {
      id: 'mine',
      name: 'Шахта',
      icon: '⛏️',
      description: 'Добывает камень и руду.',
      cost: { wood: 15, stone: 10, gold: 0 },
      buildTime: 90,
      category: 'production'
    },
    {
      id: 'forge',
      name: 'Кузница',
      icon: '🔥',
      description: 'Создаёт оружие и инструменты.',
      cost: { wood: 8, stone: 12, gold: 3 },
      buildTime: 100,
      category: 'production'
    },
    {
      id: 'tavern',
      name: 'Таверна',
      icon: '🍺',
      description: 'Повышает мораль и привлекает торговцев.',
      cost: { wood: 20, stone: 8, gold: 5 },
      buildTime: 75,
      category: 'special'
    },
    {
      id: 'library',
      name: 'Библиотека',
      icon: '📚',
      description: 'Позволяет изучать новые технологии.',
      cost: { wood: 25, stone: 5, gold: 15 },
      buildTime: 150,
      category: 'special'
    }
  ];

  const filteredBuildings = buildings.filter(b => b.category === selectedCategory);

  const canAfford = (building: Building) => {
    return resources.wood >= building.cost.wood &&
           resources.stone >= building.cost.stone &&
           resources.gold >= building.cost.gold;
  };

  const addToQueue = (building: Building) => {
    if (canAfford(building)) {
      setConstructionQueue([...constructionQueue, building]);
    }
  };

  const removeFromQueue = (index: number) => {
    setConstructionQueue(constructionQueue.filter((_, i) => i !== index));
  };

  return (
    <div className="h-full bg-slate-900 overflow-hidden">
      {/* Header */}
      <div className="bg-slate-800 p-4 border-b border-slate-700">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-200 flex items-center">
            <Hammer className="mr-2" size={24} />
            Строительство
          </h2>
          <div className="flex space-x-4 text-sm">
            <div className="flex items-center space-x-1">
              <TreePine className="text-green-500" size={16} />
              <span className="text-slate-300">{resources.wood}</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-4 h-4 bg-gray-500 rounded"></div>
              <span className="text-slate-300">{resources.stone}</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
              <span className="text-slate-300">{resources.gold}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100%-80px)]">
        {/* Categories */}
        <div className="w-1/4 bg-slate-800 border-r border-slate-700 p-4">
          <h3 className="text-lg font-semibold text-slate-200 mb-3">Категории</h3>
          <div className="space-y-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`w-full p-3 rounded-lg transition-all duration-200 flex items-center space-x-2 ${
                  selectedCategory === category.id
                    ? 'bg-slate-700 border-2 border-purple-500'
                    : 'bg-slate-700/50 hover:bg-slate-700 border-2 border-slate-600'
                }`}
              >
                <category.icon className={category.color} size={20} />
                <span className="text-slate-200">{category.name}</span>
              </button>
            ))}
          </div>

          {/* Construction Queue */}
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-slate-200 mb-3">Очередь строительства</h3>
            <div className="space-y-2">
              {constructionQueue.map((building, index) => (
                <div key={index} className="bg-slate-700 p-2 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">{building.icon}</span>
                      <span className="text-sm text-slate-300">{building.name}</span>
                    </div>
                    <button
                      onClick={() => removeFromQueue(index)}
                      className="text-red-500 hover:text-red-400 text-sm"
                    >
                      ✕
                    </button>
                  </div>
                  <div className="mt-1 bg-slate-600 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full animate-pulse"
                      style={{ width: '45%' }}
                    />
                  </div>
                </div>
              ))}
              {constructionQueue.length === 0 && (
                <p className="text-slate-500 text-sm text-center">Очередь пуста</p>
              )}
            </div>
          </div>
        </div>

        {/* Buildings List */}
        <div className="w-1/2 overflow-y-auto p-4">
          <h3 className="text-lg font-semibold text-slate-200 mb-3">
            {categories.find(c => c.id === selectedCategory)?.name}
          </h3>
          <div className="space-y-3">
            {filteredBuildings.map((building) => (
              <div
                key={building.id}
                onClick={() => setSelectedBuilding(building)}
                className={`bg-slate-800 p-4 rounded-lg cursor-pointer transition-all duration-200 border-2 ${
                  selectedBuilding?.id === building.id
                    ? 'border-purple-500 bg-slate-700'
                    : 'border-slate-700 hover:border-slate-600'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <span className="text-3xl">{building.icon}</span>
                  <div className="flex-1">
                    <h4 className="font-semibold text-slate-200 mb-1">{building.name}</h4>
                    <p className="text-sm text-slate-400 mb-2">{building.description}</p>
                    <div className="flex items-center space-x-4 text-sm">
                      <div className="flex items-center space-x-1">
                        <TreePine className="text-green-500" size={12} />
                        <span className={building.cost.wood > resources.wood ? 'text-red-500' : 'text-slate-300'}>
                          {building.cost.wood}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <div className="w-3 h-3 bg-gray-500 rounded"></div>
                        <span className={building.cost.stone > resources.stone ? 'text-red-500' : 'text-slate-300'}>
                          {building.cost.stone}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                        <span className={building.cost.gold > resources.gold ? 'text-red-500' : 'text-slate-300'}>
                          {building.cost.gold}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <span className="text-slate-400">⏱️ {building.buildTime}s</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Building Details */}
        <div className="w-1/4 bg-slate-800 border-l border-slate-700">
          {selectedBuilding ? (
            <div className="p-4 h-full">
              <div className="text-center mb-6">
                <div className="text-6xl mb-2">{selectedBuilding.icon}</div>
                <h3 className="text-xl font-bold text-slate-200 mb-2">{selectedBuilding.name}</h3>
                <p className="text-sm text-slate-400">{selectedBuilding.description}</p>
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <h4 className="font-semibold text-slate-200 mb-2">Стоимость:</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-2">
                        <TreePine className="text-green-500" size={16} />
                        <span className="text-slate-300">Дерево</span>
                      </div>
                      <span className={selectedBuilding.cost.wood > resources.wood ? 'text-red-500' : 'text-slate-300'}>
                        {selectedBuilding.cost.wood}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 bg-gray-500 rounded"></div>
                        <span className="text-slate-300">Камень</span>
                      </div>
                      <span className={selectedBuilding.cost.stone > resources.stone ? 'text-red-500' : 'text-slate-300'}>
                        {selectedBuilding.cost.stone}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
                        <span className="text-slate-300">Золото</span>
                      </div>
                      <span className={selectedBuilding.cost.gold > resources.gold ? 'text-red-500' : 'text-slate-300'}>
                        {selectedBuilding.cost.gold}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-slate-200 mb-2">Время строительства:</h4>
                  <p className="text-slate-300">{selectedBuilding.buildTime} секунд</p>
                </div>

                {selectedBuilding.requirements && (
                  <div>
                    <h4 className="font-semibold text-slate-200 mb-2">Требования:</h4>
                    <ul className="text-sm text-slate-400">
                      {selectedBuilding.requirements.map((req, index) => (
                        <li key={index}>• {req}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <button
                onClick={() => addToQueue(selectedBuilding)}
                disabled={!canAfford(selectedBuilding)}
                className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors ${
                  canAfford(selectedBuilding)
                    ? 'bg-purple-600 hover:bg-purple-700 text-white'
                    : 'bg-slate-600 text-slate-400 cursor-not-allowed'
                }`}
              >
                {canAfford(selectedBuilding) ? 'Построить' : 'Недостаточно ресурсов'}
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-slate-400">
              <div className="text-center">
                <Hammer size={48} className="mx-auto mb-4" />
                <p>Выберите здание для строительства</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Building;