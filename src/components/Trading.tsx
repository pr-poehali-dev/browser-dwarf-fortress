import { useState, useEffect } from 'react';
import { Store, TrendingUp, TrendingDown, Coins, Package, Users, Star } from 'lucide-react';

interface TradeItem {
  id: string;
  name: string;
  icon: string;
  price: number;
  quantity: number;
  demand: 'high' | 'medium' | 'low';
  category: 'resources' | 'food' | 'weapons' | 'luxury';
}

interface Trader {
  id: string;
  name: string;
  avatar: string;
  reputation: number;
  speciality: string;
  items: TradeItem[];
  visitDuration: number;
  relationship: number;
}

const Trading = () => {
  const [currentTraders, setCurrentTraders] = useState<Trader[]>([]);
  const [selectedTrader, setSelectedTrader] = useState<Trader | null>(null);
  const [playerInventory, setPlayerInventory] = useState<TradeItem[]>([]);
  const [playerGold, setPlayerGold] = useState(250);
  const [tradeHistory, setTradeHistory] = useState<string[]>([]);
  const [marketTrends, setMarketTrends] = useState<{[key: string]: 'rising' | 'falling' | 'stable'}>({});

  const traderTemplates = [
    {
      name: 'Торговец Хироши',
      avatar: '🧑‍💼',
      speciality: 'Оружие и доспехи',
      reputation: 85,
      items: [
        { id: 'sword', name: 'Катана', icon: '⚔️', price: 50, quantity: 3, demand: 'high', category: 'weapons' },
        { id: 'armor', name: 'Доспех', icon: '🛡️', price: 75, quantity: 2, demand: 'medium', category: 'weapons' },
        { id: 'bow', name: 'Лук', icon: '🏹', price: 30, quantity: 4, demand: 'high', category: 'weapons' }
      ]
    },
    {
      name: 'Торговка Аями',
      avatar: '👩‍🌾',
      speciality: 'Еда и зелья',
      reputation: 92,
      items: [
        { id: 'rice', name: 'Рис', icon: '🍚', price: 5, quantity: 20, demand: 'high', category: 'food' },
        { id: 'tea', name: 'Чай', icon: '🍵', price: 8, quantity: 15, demand: 'medium', category: 'food' },
        { id: 'potion', name: 'Зелье здоровья', icon: '🧪', price: 25, quantity: 8, demand: 'high', category: 'food' }
      ]
    },
    {
      name: 'Мастер Такеши',
      avatar: '👨‍🔬',
      speciality: 'Редкие материалы',
      reputation: 78,
      items: [
        { id: 'crystal', name: 'Кристалл маны', icon: '💎', price: 100, quantity: 2, demand: 'high', category: 'luxury' },
        { id: 'silk', name: 'Шёлк', icon: '🪡', price: 15, quantity: 10, demand: 'medium', category: 'luxury' },
        { id: 'spices', name: 'Пряности', icon: '🌶️', price: 12, quantity: 12, demand: 'medium', category: 'luxury' }
      ]
    }
  ];

  useEffect(() => {
    generateTraders();
    generatePlayerInventory();
    updateMarketTrends();
  }, []);

  const generateTraders = () => {
    const traders: Trader[] = traderTemplates.map(template => ({
      id: Math.random().toString(36).substr(2, 9),
      name: template.name,
      avatar: template.avatar,
      reputation: template.reputation,
      speciality: template.speciality,
      items: template.items.map(item => ({
        ...item,
        id: Math.random().toString(36).substr(2, 9),
        price: Math.floor(item.price * (0.8 + Math.random() * 0.4))
      })),
      visitDuration: Math.floor(Math.random() * 300) + 180,
      relationship: Math.floor(Math.random() * 50) + 25
    }));
    setCurrentTraders(traders);
  };

  const generatePlayerInventory = () => {
    const inventory: TradeItem[] = [
      { id: 'wood', name: 'Дерево', icon: '🪵', price: 3, quantity: 45, demand: 'medium', category: 'resources' },
      { id: 'stone', name: 'Камень', icon: '🪨', price: 2, quantity: 30, demand: 'medium', category: 'resources' },
      { id: 'iron', name: 'Железо', icon: '⚙️', price: 8, quantity: 15, demand: 'high', category: 'resources' },
      { id: 'gems', name: 'Самоцветы', icon: '💎', price: 25, quantity: 5, demand: 'high', category: 'luxury' },
      { id: 'craft', name: 'Изделие', icon: '🏺', price: 20, quantity: 8, demand: 'medium', category: 'luxury' }
    ];
    setPlayerInventory(inventory);
  };

  const updateMarketTrends = () => {
    const trends: {[key: string]: 'rising' | 'falling' | 'stable'} = {};
    const categories = ['weapons', 'food', 'resources', 'luxury'];
    categories.forEach(category => {
      const random = Math.random();
      trends[category] = random < 0.3 ? 'rising' : random < 0.6 ? 'falling' : 'stable';
    });
    setMarketTrends(trends);
  };

  const buyItem = (item: TradeItem, quantity: number = 1) => {
    const totalCost = item.price * quantity;
    if (playerGold < totalCost) return;

    setPlayerGold(prev => prev - totalCost);
    setPlayerInventory(prev => {
      const existingItem = prev.find(i => i.name === item.name);
      if (existingItem) {
        return prev.map(i => i.name === item.name ? { ...i, quantity: i.quantity + quantity } : i);
      } else {
        return [...prev, { ...item, quantity }];
      }
    });

    setCurrentTraders(prev => prev.map(trader => 
      trader.id === selectedTrader?.id 
        ? {
            ...trader,
            items: trader.items.map(i => 
              i.id === item.id 
                ? { ...i, quantity: i.quantity - quantity }
                : i
            )
          }
        : trader
    ));

    addToTradeHistory(`Купил ${quantity}x ${item.name} за ${totalCost} золота`);
  };

  const sellItem = (item: TradeItem, quantity: number = 1) => {
    const totalEarn = Math.floor(item.price * quantity * 0.8);
    
    setPlayerGold(prev => prev + totalEarn);
    setPlayerInventory(prev => 
      prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity - quantity } : i)
        .filter(i => i.quantity > 0)
    );

    addToTradeHistory(`Продал ${quantity}x ${item.name} за ${totalEarn} золота`);
  };

  const addToTradeHistory = (message: string) => {
    setTradeHistory(prev => [...prev.slice(-9), message]);
  };

  const getDemandColor = (demand: string) => {
    switch (demand) {
      case 'high': return 'text-green-500';
      case 'medium': return 'text-yellow-500';
      case 'low': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const getDemandIcon = (demand: string) => {
    switch (demand) {
      case 'high': return <TrendingUp size={16} className="text-green-500" />;
      case 'medium': return <span className="text-yellow-500">→</span>;
      case 'low': return <TrendingDown size={16} className="text-red-500" />;
      default: return null;
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'rising': return <TrendingUp size={16} className="text-green-500" />;
      case 'falling': return <TrendingDown size={16} className="text-red-500" />;
      case 'stable': return <span className="text-gray-500">→</span>;
      default: return null;
    }
  };

  return (
    <div className="h-full bg-slate-900 overflow-hidden">
      {/* Header */}
      <div className="bg-slate-800 p-4 border-b border-slate-700">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-200 flex items-center">
            <Store className="mr-2" size={24} />
            Торговый пост
          </h2>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Coins className="text-yellow-500" size={16} />
              <span className="text-slate-300">{playerGold} золота</span>
            </div>
            <div className="flex items-center space-x-2">
              <Users className="text-blue-500" size={16} />
              <span className="text-slate-300">{currentTraders.length} торговцев</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100%-80px)]">
        {/* Traders List */}
        <div className="w-1/3 border-r border-slate-700 overflow-y-auto">
          <div className="p-4">
            <h3 className="text-lg font-semibold text-slate-200 mb-3">Активные торговцы</h3>
            <div className="space-y-3">
              {currentTraders.map((trader) => (
                <div
                  key={trader.id}
                  onClick={() => setSelectedTrader(trader)}
                  className={`bg-slate-800 p-3 rounded-lg cursor-pointer transition-all duration-200 border-2 ${
                    selectedTrader?.id === trader.id
                      ? 'border-purple-500 bg-slate-700'
                      : 'border-slate-700 hover:border-slate-600'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">{trader.avatar}</div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-slate-200">{trader.name}</h4>
                      <p className="text-sm text-slate-400">{trader.speciality}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <div className="flex items-center space-x-1">
                          <Star className="text-yellow-500" size={12} />
                          <span className="text-xs text-slate-300">{trader.reputation}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Package className="text-blue-500" size={12} />
                          <span className="text-xs text-slate-300">{trader.items.length} товаров</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-2 bg-slate-700 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: `${(trader.relationship / 100) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Market Trends */}
          <div className="p-4 border-t border-slate-700">
            <h3 className="text-lg font-semibold text-slate-200 mb-3">Рыночные тренды</h3>
            <div className="space-y-2">
              {Object.entries(marketTrends).map(([category, trend]) => (
                <div key={category} className="flex items-center justify-between">
                  <span className="text-slate-300 capitalize">{category}</span>
                  <div className="flex items-center space-x-1">
                    {getTrendIcon(trend)}
                    <span className="text-sm text-slate-400">{trend}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Trade Interface */}
        <div className="w-1/3 flex flex-col">
          {selectedTrader ? (
            <>
              <div className="bg-slate-800 p-4 border-b border-slate-700">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="text-3xl">{selectedTrader.avatar}</div>
                  <div>
                    <h3 className="font-semibold text-slate-200">{selectedTrader.name}</h3>
                    <p className="text-sm text-slate-400">{selectedTrader.speciality}</p>
                  </div>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-300">Репутация: {selectedTrader.reputation}</span>
                  <span className="text-slate-300">Отношения: {selectedTrader.relationship}%</span>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4">
                <h4 className="font-semibold text-slate-200 mb-3">Товары торговца</h4>
                <div className="space-y-3">
                  {selectedTrader.items.filter(item => item.quantity > 0).map((item) => (
                    <div key={item.id} className="bg-slate-800 p-3 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-3">
                          <span className="text-2xl">{item.icon}</span>
                          <div>
                            <h5 className="font-semibold text-slate-200">{item.name}</h5>
                            <div className="flex items-center space-x-2">
                              <span className="text-sm text-slate-400">Спрос:</span>
                              {getDemandIcon(item.demand)}
                              <span className={`text-sm ${getDemandColor(item.demand)}`}>
                                {item.demand}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-yellow-500">{item.price}g</div>
                          <div className="text-sm text-slate-400">x{item.quantity}</div>
                        </div>
                      </div>
                      <button
                        onClick={() => buyItem(item)}
                        disabled={playerGold < item.price}
                        className={`w-full py-2 px-4 rounded-lg font-semibold transition-colors ${
                          playerGold >= item.price
                            ? 'bg-green-600 hover:bg-green-700 text-white'
                            : 'bg-slate-600 text-slate-400 cursor-not-allowed'
                        }`}
                      >
                        Купить
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full text-slate-400">
              <div className="text-center">
                <Store size={48} className="mx-auto mb-4" />
                <p>Выберите торговца для начала торговли</p>
              </div>
            </div>
          )}
        </div>

        {/* Player Inventory */}
        <div className="w-1/3 border-l border-slate-700 flex flex-col">
          <div className="bg-slate-800 p-4 border-b border-slate-700">
            <h3 className="text-lg font-semibold text-slate-200 mb-3">Ваш инвентарь</h3>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-3">
              {playerInventory.map((item) => (
                <div key={item.id} className="bg-slate-800 p-3 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{item.icon}</span>
                      <div>
                        <h5 className="font-semibold text-slate-200">{item.name}</h5>
                        <div className="text-sm text-slate-400">x{item.quantity}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-yellow-500">
                        {Math.floor(item.price * 0.8)}g
                      </div>
                      <div className="text-xs text-slate-400">цена продажи</div>
                    </div>
                  </div>
                  <button
                    onClick={() => sellItem(item)}
                    disabled={item.quantity <= 0}
                    className={`w-full py-2 px-4 rounded-lg font-semibold transition-colors ${
                      item.quantity > 0
                        ? 'bg-orange-600 hover:bg-orange-700 text-white'
                        : 'bg-slate-600 text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    Продать
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Trade History */}
          <div className="border-t border-slate-700 p-4">
            <h4 className="font-semibold text-slate-200 mb-3">История торговли</h4>
            <div className="space-y-1 max-h-32 overflow-y-auto">
              {tradeHistory.map((entry, index) => (
                <div key={index} className="text-xs text-slate-400 p-2 bg-slate-800 rounded">
                  {entry}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Trading;