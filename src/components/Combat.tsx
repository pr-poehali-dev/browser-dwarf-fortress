import { useState, useEffect } from 'react';
import { Sword, Shield, Heart, Zap, Target, Users, AlertTriangle } from 'lucide-react';

interface Enemy {
  id: string;
  name: string;
  icon: string;
  health: number;
  maxHealth: number;
  attack: number;
  defense: number;
  type: 'goblin' | 'orc' | 'troll' | 'dragon' | 'bandit';
  reward: {
    gold: number;
    experience: number;
  };
}

interface DefenseUnit {
  id: string;
  name: string;
  icon: string;
  health: number;
  maxHealth: number;
  attack: number;
  defense: number;
  position: { x: number; y: number };
  type: 'warrior' | 'archer' | 'mage' | 'trap';
}

const Combat = () => {
  const [enemies, setEnemies] = useState<Enemy[]>([]);
  const [defenseUnits, setDefenseUnits] = useState<DefenseUnit[]>([]);
  const [selectedUnit, setSelectedUnit] = useState<DefenseUnit | null>(null);
  const [battleLog, setBattleLog] = useState<string[]>([]);
  const [threatLevel, setThreatLevel] = useState(1);
  const [resources, setResources] = useState({ gold: 100, warriors: 5 });

  const enemyTypes = [
    { type: 'goblin', name: 'Гоблин', icon: '👹', health: 30, attack: 8, defense: 2, reward: { gold: 10, experience: 5 } },
    { type: 'orc', name: 'Орк', icon: '🧌', health: 50, attack: 12, defense: 4, reward: { gold: 15, experience: 8 } },
    { type: 'troll', name: 'Тролль', icon: '🧙‍♂️', health: 80, attack: 15, defense: 6, reward: { gold: 25, experience: 12 } },
    { type: 'bandit', name: 'Бандит', icon: '🥷', health: 40, attack: 10, defense: 3, reward: { gold: 12, experience: 6 } },
    { type: 'dragon', name: 'Дракон', icon: '🐉', health: 150, attack: 25, defense: 10, reward: { gold: 50, experience: 25 } }
  ];

  const unitTypes = [
    { type: 'warrior', name: 'Воин', icon: '🛡️', health: 60, attack: 15, defense: 8, cost: 20 },
    { type: 'archer', name: 'Лучник', icon: '🏹', health: 40, attack: 18, defense: 4, cost: 15 },
    { type: 'mage', name: 'Маг', icon: '🧙‍♀️', health: 35, attack: 22, defense: 3, cost: 25 },
    { type: 'trap', name: 'Ловушка', icon: '🕳️', health: 20, attack: 30, defense: 0, cost: 10 }
  ];

  useEffect(() => {
    const initialDefense: DefenseUnit[] = [
      {
        id: '1',
        name: 'Воин Сакура',
        icon: '🛡️',
        health: 60,
        maxHealth: 60,
        attack: 15,
        defense: 8,
        position: { x: 2, y: 3 },
        type: 'warrior'
      },
      {
        id: '2',
        name: 'Лучник Юки',
        icon: '🏹',
        health: 40,
        maxHealth: 40,
        attack: 18,
        defense: 4,
        position: { x: 1, y: 1 },
        type: 'archer'
      }
    ];
    setDefenseUnits(initialDefense);
    spawnEnemies();
  }, []);

  const spawnEnemies = () => {
    const newEnemies: Enemy[] = [];
    const enemyCount = Math.floor(Math.random() * 3) + threatLevel;
    
    for (let i = 0; i < enemyCount; i++) {
      const enemyTemplate = enemyTypes[Math.floor(Math.random() * enemyTypes.length)];
      const enemy: Enemy = {
        id: Math.random().toString(36).substr(2, 9),
        name: enemyTemplate.name,
        icon: enemyTemplate.icon,
        health: enemyTemplate.health,
        maxHealth: enemyTemplate.health,
        attack: enemyTemplate.attack,
        defense: enemyTemplate.defense,
        type: enemyTemplate.type as Enemy['type'],
        reward: enemyTemplate.reward
      };
      newEnemies.push(enemy);
    }
    
    setEnemies(newEnemies);
    addToBattleLog(`Волна врагов приближается! ${newEnemies.length} противников`);
  };

  const addToBattleLog = (message: string) => {
    setBattleLog(prev => [...prev.slice(-9), message]);
  };

  const attackEnemy = (enemyId: string, unitId: string) => {
    const unit = defenseUnits.find(u => u.id === unitId);
    const enemy = enemies.find(e => e.id === enemyId);
    
    if (!unit || !enemy) return;
    
    const damage = Math.max(unit.attack - enemy.defense, 1);
    const newHealth = Math.max(enemy.health - damage, 0);
    
    setEnemies(prev => 
      prev.map(e => 
        e.id === enemyId 
          ? { ...e, health: newHealth }
          : e
      )
    );
    
    addToBattleLog(`${unit.name} атакует ${enemy.name} (-${damage} HP)`);
    
    if (newHealth <= 0) {
      addToBattleLog(`${enemy.name} побеждён! +${enemy.reward.gold} золота`);
      setResources(prev => ({ ...prev, gold: prev.gold + enemy.reward.gold }));
      setEnemies(prev => prev.filter(e => e.id !== enemyId));
    }
  };

  const deployUnit = (unitType: string) => {
    const template = unitTypes.find(u => u.type === unitType);
    if (!template || resources.gold < template.cost) return;
    
    const newUnit: DefenseUnit = {
      id: Math.random().toString(36).substr(2, 9),
      name: `${template.name} ${Math.floor(Math.random() * 1000)}`,
      icon: template.icon,
      health: template.health,
      maxHealth: template.health,
      attack: template.attack,
      defense: template.defense,
      position: { x: Math.floor(Math.random() * 5), y: Math.floor(Math.random() * 5) },
      type: template.type as DefenseUnit['type']
    };
    
    setDefenseUnits(prev => [...prev, newUnit]);
    setResources(prev => ({ ...prev, gold: prev.gold - template.cost }));
    addToBattleLog(`Развёрнут ${template.name}`);
  };

  const getThreatLevelColor = () => {
    if (threatLevel <= 2) return 'text-green-500';
    if (threatLevel <= 4) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <div className="h-full bg-slate-900 overflow-hidden">
      {/* Header */}
      <div className="bg-slate-800 p-4 border-b border-slate-700">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-200 flex items-center">
            <Sword className="mr-2" size={24} />
            Боевая система
          </h2>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className={getThreatLevelColor()} size={16} />
              <span className="text-slate-300">Угроза: {threatLevel}</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
              <span className="text-slate-300">{resources.gold}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100%-80px)]">
        {/* Battle Field */}
        <div className="w-1/2 p-4">
          <div className="bg-slate-800 rounded-lg p-4 h-full">
            <h3 className="text-lg font-semibold text-slate-200 mb-3">Поле боя</h3>
            
            {/* Grid */}
            <div className="grid grid-cols-5 gap-2 mb-4">
              {Array.from({ length: 25 }, (_, i) => {
                const x = i % 5;
                const y = Math.floor(i / 5);
                const unit = defenseUnits.find(u => u.position.x === x && u.position.y === y);
                
                return (
                  <div
                    key={i}
                    className={`w-12 h-12 bg-slate-700 border-2 border-slate-600 rounded-lg flex items-center justify-center cursor-pointer transition-all ${
                      selectedUnit?.position.x === x && selectedUnit?.position.y === y
                        ? 'border-purple-500 bg-purple-500/20'
                        : 'hover:border-slate-500'
                    }`}
                    onClick={() => unit && setSelectedUnit(unit)}
                  >
                    {unit && (
                      <div className="text-lg" title={unit.name}>
                        {unit.icon}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Enemies */}
            <div className="mb-4">
              <h4 className="font-semibold text-slate-200 mb-2">Враги ({enemies.length})</h4>
              <div className="grid grid-cols-3 gap-2">
                {enemies.map((enemy) => (
                  <div
                    key={enemy.id}
                    className="bg-slate-700 p-2 rounded-lg border border-red-500/50"
                  >
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-lg">{enemy.icon}</span>
                      <span className="text-sm text-slate-300">{enemy.name}</span>
                    </div>
                    <div className="bg-slate-600 rounded-full h-2 mb-1">
                      <div 
                        className="bg-red-500 h-2 rounded-full"
                        style={{ width: `${(enemy.health / enemy.maxHealth) * 100}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-slate-400">
                      <span>⚔️ {enemy.attack}</span>
                      <span>🛡️ {enemy.defense}</span>
                    </div>
                    {selectedUnit && (
                      <button
                        onClick={() => attackEnemy(enemy.id, selectedUnit.id)}
                        className="w-full mt-1 bg-red-600 hover:bg-red-700 text-white py-1 px-2 rounded text-xs"
                      >
                        Атаковать
                      </button>
                    )}
                  </div>
                ))}
              </div>
              
              {enemies.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-slate-400 mb-4">Все враги побеждены!</p>
                  <button
                    onClick={spawnEnemies}
                    className="bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg"
                  >
                    Следующая волна
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Unit Management */}
        <div className="w-1/2 flex flex-col">
          {/* Selected Unit Info */}
          {selectedUnit && (
            <div className="bg-slate-800 border-b border-slate-700 p-4">
              <div className="flex items-center space-x-3 mb-3">
                <span className="text-3xl">{selectedUnit.icon}</span>
                <div>
                  <h3 className="font-semibold text-slate-200">{selectedUnit.name}</h3>
                  <p className="text-sm text-slate-400">Позиция: ({selectedUnit.position.x}, {selectedUnit.position.y})</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-300">Здоровье</span>
                    <span className="text-slate-400">{selectedUnit.health}/{selectedUnit.maxHealth}</span>
                  </div>
                  <div className="bg-slate-700 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full"
                      style={{ width: `${(selectedUnit.health / selectedUnit.maxHealth) * 100}%` }}
                    />
                  </div>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-300">Атака: {selectedUnit.attack}</span>
                  <span className="text-slate-300">Защита: {selectedUnit.defense}</span>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-1 px-2 rounded text-sm">
                  Лечить
                </button>
                <button className="flex-1 bg-green-600 hover:bg-green-700 text-white py-1 px-2 rounded text-sm">
                  Улучшить
                </button>
              </div>
            </div>
          )}

          {/* Deploy Units */}
          <div className="bg-slate-800 border-b border-slate-700 p-4">
            <h3 className="text-lg font-semibold text-slate-200 mb-3">Развернуть войска</h3>
            <div className="grid grid-cols-2 gap-2">
              {unitTypes.map((unitType) => (
                <button
                  key={unitType.type}
                  onClick={() => deployUnit(unitType.type)}
                  disabled={resources.gold < unitType.cost}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    resources.gold >= unitType.cost
                      ? 'border-slate-600 bg-slate-700 hover:border-slate-500'
                      : 'border-slate-700 bg-slate-800 opacity-50 cursor-not-allowed'
                  }`}
                >
                  <div className="text-center">
                    <div className="text-2xl mb-1">{unitType.icon}</div>
                    <div className="text-sm text-slate-300">{unitType.name}</div>
                    <div className="text-xs text-slate-400">💰 {unitType.cost}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Battle Log */}
          <div className="flex-1 bg-slate-800 p-4 overflow-hidden">
            <h3 className="text-lg font-semibold text-slate-200 mb-3">Журнал боя</h3>
            <div className="space-y-1 h-full overflow-y-auto">
              {battleLog.map((log, index) => (
                <div key={index} className="text-sm text-slate-300 p-2 bg-slate-700 rounded">
                  {log}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Combat;