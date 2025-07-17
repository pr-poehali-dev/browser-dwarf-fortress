import { useState, useEffect } from 'react';
import { Sparkles, Zap, Star, Heart, Shield, Target, Flame, Snowflake } from 'lucide-react';

interface Spell {
  id: string;
  name: string;
  icon: string;
  description: string;
  manaCost: number;
  cooldown: number;
  currentCooldown: number;
  damage?: number;
  healing?: number;
  effect?: string;
  level: number;
  school: 'fire' | 'ice' | 'earth' | 'air' | 'light' | 'dark';
}

interface MagicFamiliar {
  id: string;
  name: string;
  avatar: string;
  element: string;
  level: number;
  experience: number;
  maxExperience: number;
  loyalty: number;
  abilities: string[];
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

const Magic = () => {
  const [playerMana, setPlayerMana] = useState(100);
  const [maxMana] = useState(100);
  const [magicLevel, setMagicLevel] = useState(3);
  const [magicExperience, setMagicExperience] = useState(750);
  const [maxMagicExperience] = useState(1000);
  const [spells, setSpells] = useState<Spell[]>([]);
  const [familiars, setFamiliars] = useState<MagicFamiliar[]>([]);
  const [selectedSpell, setSelectedSpell] = useState<Spell | null>(null);
  const [selectedFamiliar, setSelectedFamiliar] = useState<MagicFamiliar | null>(null);
  const [castingLog, setCastingLog] = useState<string[]>([]);

  const spellTemplates = [
    {
      id: 'fireball',
      name: 'Огненный шар',
      icon: '🔥',
      description: 'Запускает огненный шар, наносящий урон врагу',
      manaCost: 25,
      cooldown: 3000,
      damage: 45,
      school: 'fire',
      level: 1
    },
    {
      id: 'heal',
      name: 'Лечение',
      icon: '💚',
      description: 'Восстанавливает здоровье выбранной цели',
      manaCost: 20,
      cooldown: 2000,
      healing: 40,
      school: 'light',
      level: 1
    },
    {
      id: 'frostbolt',
      name: 'Ледяная стрела',
      icon: '❄️',
      description: 'Замедляет врага и наносит урон холодом',
      manaCost: 30,
      cooldown: 4000,
      damage: 35,
      effect: 'Замедление',
      school: 'ice',
      level: 2
    },
    {
      id: 'shield',
      name: 'Магический щит',
      icon: '🛡️',
      description: 'Создает защитный барьер вокруг союзника',
      manaCost: 35,
      cooldown: 5000,
      effect: 'Защита +50%',
      school: 'earth',
      level: 2
    },
    {
      id: 'lightning',
      name: 'Молния',
      icon: '⚡',
      description: 'Мощный разряд молнии поражает всех врагов',
      manaCost: 50,
      cooldown: 8000,
      damage: 60,
      effect: 'Оглушение',
      school: 'air',
      level: 3
    },
    {
      id: 'teleport',
      name: 'Телепортация',
      icon: '🌀',
      description: 'Мгновенно перемещает дварфа в указанную точку',
      manaCost: 40,
      cooldown: 6000,
      effect: 'Перемещение',
      school: 'air',
      level: 3
    }
  ];

  const familiarTemplates = [
    {
      name: 'Химэ',
      avatar: '🦊',
      element: 'Огонь',
      rarity: 'rare',
      abilities: ['Огненное дыхание', 'Поиск сокровищ']
    },
    {
      name: 'Юки',
      avatar: '🐺',
      element: 'Лёд',
      rarity: 'epic',
      abilities: ['Ледяная броня', 'Атака холодом']
    },
    {
      name: 'Мидори',
      avatar: '🐉',
      element: 'Земля',
      rarity: 'legendary',
      abilities: ['Каменная кожа', 'Землетрясение', 'Восстановление']
    },
    {
      name: 'Сора',
      avatar: '🦅',
      element: 'Воздух',
      rarity: 'common',
      abilities: ['Полёт', 'Разведка']
    }
  ];

  useEffect(() => {
    initializeSpells();
    initializeFamiliars();
    
    const interval = setInterval(() => {
      setSpells(prev => prev.map(spell => ({
        ...spell,
        currentCooldown: Math.max(0, spell.currentCooldown - 1000)
      })));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const initializeSpells = () => {
    const availableSpells = spellTemplates
      .filter(spell => spell.level <= magicLevel)
      .map(spell => ({
        ...spell,
        currentCooldown: 0,
        school: spell.school as Spell['school']
      }));
    setSpells(availableSpells);
  };

  const initializeFamiliars = () => {
    const initialFamiliars: MagicFamiliar[] = familiarTemplates.map(template => ({
      id: Math.random().toString(36).substr(2, 9),
      name: template.name,
      avatar: template.avatar,
      element: template.element,
      level: Math.floor(Math.random() * 3) + 1,
      experience: Math.floor(Math.random() * 50),
      maxExperience: 100,
      loyalty: Math.floor(Math.random() * 30) + 70,
      abilities: template.abilities,
      rarity: template.rarity as MagicFamiliar['rarity']
    }));
    setFamiliars(initialFamiliars);
  };

  const castSpell = (spell: Spell) => {
    if (spell.currentCooldown > 0) {
      addToCastingLog(`⏰ ${spell.name} на перезарядке`);
      return;
    }
    
    if (playerMana < spell.manaCost) {
      addToCastingLog(`❌ Недостаточно маны для ${spell.name}`);
      return;
    }

    setPlayerMana(prev => prev - spell.manaCost);
    setSpells(prev => prev.map(s => 
      s.id === spell.id 
        ? { ...s, currentCooldown: s.cooldown }
        : s
    ));

    let logMessage = `✨ Использовано заклинание ${spell.name}`;
    if (spell.damage) logMessage += ` (${spell.damage} урона)`;
    if (spell.healing) logMessage += ` (${spell.healing} лечения)`;
    if (spell.effect) logMessage += ` (${spell.effect})`;
    
    addToCastingLog(logMessage);
    
    setMagicExperience(prev => Math.min(prev + 25, maxMagicExperience));
  };

  const addToCastingLog = (message: string) => {
    setCastingLog(prev => [...prev.slice(-9), message]);
  };

  const getSchoolColor = (school: string) => {
    switch (school) {
      case 'fire': return 'text-red-500';
      case 'ice': return 'text-blue-500';
      case 'earth': return 'text-green-500';
      case 'air': return 'text-cyan-500';
      case 'light': return 'text-yellow-500';
      case 'dark': return 'text-purple-500';
      default: return 'text-gray-500';
    }
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'border-gray-500';
      case 'rare': return 'border-blue-500';
      case 'epic': return 'border-purple-500';
      case 'legendary': return 'border-yellow-500';
      default: return 'border-gray-500';
    }
  };

  const trainFamiliar = (familiar: MagicFamiliar) => {
    const expGain = Math.floor(Math.random() * 20) + 10;
    setFamiliars(prev => prev.map(f => 
      f.id === familiar.id 
        ? { 
            ...f, 
            experience: Math.min(f.experience + expGain, f.maxExperience),
            loyalty: Math.min(f.loyalty + 2, 100)
          }
        : f
    ));
    addToCastingLog(`🎓 ${familiar.name} получил ${expGain} опыта`);
  };

  return (
    <div className="h-full bg-slate-900 overflow-hidden">
      {/* Header */}
      <div className="bg-slate-800 p-4 border-b border-slate-700">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-200 flex items-center">
            <Sparkles className="mr-2" size={24} />
            Магическая система
          </h2>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Zap className="text-blue-500" size={16} />
              <span className="text-slate-300">{playerMana}/{maxMana}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Star className="text-purple-500" size={16} />
              <span className="text-slate-300">Ур. {magicLevel}</span>
            </div>
          </div>
        </div>
        
        {/* Mana Bar */}
        <div className="mt-3">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-slate-300">Мана</span>
            <span className="text-slate-400">{playerMana}/{maxMana}</span>
          </div>
          <div className="bg-slate-700 rounded-full h-3">
            <div 
              className="bg-blue-500 h-3 rounded-full transition-all duration-300"
              style={{ width: `${(playerMana / maxMana) * 100}%` }}
            />
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100%-120px)]">
        {/* Spells */}
        <div className="w-1/3 border-r border-slate-700 overflow-y-auto">
          <div className="p-4">
            <h3 className="text-lg font-semibold text-slate-200 mb-3">Заклинания</h3>
            <div className="space-y-3">
              {spells.map((spell) => (
                <div
                  key={spell.id}
                  onClick={() => setSelectedSpell(spell)}
                  className={`bg-slate-800 p-3 rounded-lg cursor-pointer transition-all duration-200 border-2 ${
                    selectedSpell?.id === spell.id
                      ? 'border-purple-500 bg-slate-700'
                      : 'border-slate-700 hover:border-slate-600'
                  } ${spell.currentCooldown > 0 ? 'opacity-50' : ''}`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{spell.icon}</span>
                      <div>
                        <h4 className="font-semibold text-slate-200">{spell.name}</h4>
                        <p className="text-xs text-slate-400">{spell.description}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold text-blue-500">{spell.manaCost} MP</div>
                      <div className={`text-xs ${getSchoolColor(spell.school)}`}>
                        {spell.school}
                      </div>
                    </div>
                  </div>
                  
                  {spell.currentCooldown > 0 && (
                    <div className="mb-2">
                      <div className="bg-slate-700 rounded-full h-2">
                        <div 
                          className="bg-red-500 h-2 rounded-full transition-all duration-1000"
                          style={{ width: `${(spell.currentCooldown / spell.cooldown) * 100}%` }}
                        />
                      </div>
                      <div className="text-xs text-slate-400 mt-1">
                        Перезарядка: {Math.ceil(spell.currentCooldown / 1000)}s
                      </div>
                    </div>
                  )}
                  
                  <div className="flex justify-between text-xs text-slate-400">
                    {spell.damage && <span>⚔️ {spell.damage}</span>}
                    {spell.healing && <span>💚 {spell.healing}</span>}
                    {spell.effect && <span>✨ {spell.effect}</span>}
                  </div>
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      castSpell(spell);
                    }}
                    disabled={spell.currentCooldown > 0 || playerMana < spell.manaCost}
                    className={`w-full mt-2 py-1 px-3 rounded text-sm font-semibold transition-colors ${
                      spell.currentCooldown > 0 || playerMana < spell.manaCost
                        ? 'bg-slate-600 text-slate-400 cursor-not-allowed'
                        : 'bg-purple-600 hover:bg-purple-700 text-white'
                    }`}
                  >
                    Использовать
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Familiars */}
        <div className="w-1/3 border-r border-slate-700 overflow-y-auto">
          <div className="p-4">
            <h3 className="text-lg font-semibold text-slate-200 mb-3">Фамильяры</h3>
            <div className="space-y-3">
              {familiars.map((familiar) => (
                <div
                  key={familiar.id}
                  onClick={() => setSelectedFamiliar(familiar)}
                  className={`bg-slate-800 p-3 rounded-lg cursor-pointer transition-all duration-200 border-2 ${
                    selectedFamiliar?.id === familiar.id
                      ? 'border-purple-500 bg-slate-700'
                      : `border-slate-700 hover:border-slate-600 ${getRarityColor(familiar.rarity)}`
                  }`}
                >
                  <div className="flex items-center space-x-3 mb-2">
                    <span className="text-3xl">{familiar.avatar}</span>
                    <div className="flex-1">
                      <h4 className="font-semibold text-slate-200">{familiar.name}</h4>
                      <p className="text-sm text-slate-400">{familiar.element}</p>
                      <div className="flex items-center space-x-2 text-xs">
                        <span className="text-slate-300">Ур. {familiar.level}</span>
                        <span className={`capitalize ${getRarityColor(familiar.rarity).replace('border-', 'text-')}`}>
                          {familiar.rarity}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Experience Bar */}
                  <div className="mb-2">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-300">Опыт</span>
                      <span className="text-slate-400">{familiar.experience}/{familiar.maxExperience}</span>
                    </div>
                    <div className="bg-slate-700 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full"
                        style={{ width: `${(familiar.experience / familiar.maxExperience) * 100}%` }}
                      />
                    </div>
                  </div>
                  
                  {/* Loyalty Bar */}
                  <div className="mb-2">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-300">Верность</span>
                      <span className="text-slate-400">{familiar.loyalty}%</span>
                    </div>
                    <div className="bg-slate-700 rounded-full h-2">
                      <div 
                        className="bg-pink-500 h-2 rounded-full"
                        style={{ width: `${familiar.loyalty}%` }}
                      />
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        trainFamiliar(familiar);
                      }}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white py-1 px-2 rounded text-xs"
                    >
                      Обучить
                    </button>
                    <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-1 px-2 rounded text-xs">
                      Призвать
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Details & Casting Log */}
        <div className="w-1/3 flex flex-col">
          {/* Selected Details */}
          {(selectedSpell || selectedFamiliar) && (
            <div className="bg-slate-800 border-b border-slate-700 p-4">
              {selectedSpell && (
                <div className="text-center">
                  <div className="text-4xl mb-2">{selectedSpell.icon}</div>
                  <h3 className="text-xl font-bold text-slate-200 mb-2">{selectedSpell.name}</h3>
                  <p className="text-sm text-slate-400 mb-3">{selectedSpell.description}</p>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-slate-300">Стоимость маны:</span>
                      <span className="text-blue-500">{selectedSpell.manaCost} MP</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-300">Школа магии:</span>
                      <span className={getSchoolColor(selectedSpell.school)}>
                        {selectedSpell.school}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-300">Время каста:</span>
                      <span className="text-slate-400">{selectedSpell.cooldown / 1000}s</span>
                    </div>
                  </div>
                </div>
              )}
              
              {selectedFamiliar && (
                <div className="text-center">
                  <div className="text-4xl mb-2">{selectedFamiliar.avatar}</div>
                  <h3 className="text-xl font-bold text-slate-200 mb-2">{selectedFamiliar.name}</h3>
                  <p className="text-sm text-slate-400 mb-3">Элемент: {selectedFamiliar.element}</p>
                  <div className="space-y-2 mb-3">
                    <div className="flex justify-between">
                      <span className="text-slate-300">Уровень:</span>
                      <span className="text-purple-500">{selectedFamiliar.level}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-300">Редкость:</span>
                      <span className={getRarityColor(selectedFamiliar.rarity).replace('border-', 'text-')}>
                        {selectedFamiliar.rarity}
                      </span>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-200 mb-2">Способности:</h4>
                    <div className="space-y-1">
                      {selectedFamiliar.abilities.map((ability, index) => (
                        <div key={index} className="text-sm text-slate-300 bg-slate-700 px-2 py-1 rounded">
                          {ability}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
          
          {/* Casting Log */}
          <div className="flex-1 bg-slate-800 p-4 overflow-hidden">
            <h3 className="text-lg font-semibold text-slate-200 mb-3">Журнал магии</h3>
            <div className="space-y-1 h-full overflow-y-auto">
              {castingLog.map((log, index) => (
                <div key={index} className="text-sm text-slate-300 p-2 bg-slate-700 rounded">
                  {log}
                </div>
              ))}
              {castingLog.length === 0 && (
                <div className="text-center text-slate-400 mt-8">
                  <Sparkles size={48} className="mx-auto mb-4" />
                  <p>Используйте заклинания для записи в журнал</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Magic;