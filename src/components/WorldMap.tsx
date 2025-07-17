import { useState, useEffect } from 'react';
import { Plus, Minus, RotateCcw, Mountain, TreePine, Waves, Pickaxe, Eye } from 'lucide-react';

interface TerrainCell {
  type: 'stone' | 'dirt' | 'water' | 'tree' | 'mountain' | 'grass' | 'ore';
  discovered: boolean;
  building?: string;
  dwarf?: boolean;
  resources?: number;
}

const WorldMap = () => {
  const [mapSize] = useState({ width: 20, height: 30 });
  const [zoom, setZoom] = useState(1);
  const [selectedCell, setSelectedCell] = useState<{x: number, y: number} | null>(null);
  const [map, setMap] = useState<TerrainCell[][]>([]);
  const [gameStats, setGameStats] = useState({
    population: 7,
    food: 50,
    stone: 25,
    wood: 30,
    gold: 15,
    season: 'Весна',
    day: 1
  });

  const generateMap = () => {
    const newMap: TerrainCell[][] = [];
    for (let y = 0; y < mapSize.height; y++) {
      newMap[y] = [];
      for (let x = 0; x < mapSize.width; x++) {
        const random = Math.random();
        let type: TerrainCell['type'];
        
        if (y < 5) type = 'mountain';
        else if (y < 10 && random < 0.3) type = 'stone';
        else if (y < 15 && random < 0.4) type = 'dirt';
        else if (random < 0.1) type = 'water';
        else if (random < 0.3) type = 'tree';
        else if (random < 0.15) type = 'ore';
        else type = 'grass';

        newMap[y][x] = {
          type,
          discovered: y > 15 || (y > 10 && Math.random() < 0.6),
          resources: type === 'ore' ? Math.floor(Math.random() * 10) + 5 : 0,
          dwarf: y > 20 && x > 8 && x < 12 && Math.random() < 0.3
        };
      }
    }
    setMap(newMap);
  };

  useEffect(() => {
    generateMap();
  }, []);

  const getCellIcon = (cell: TerrainCell) => {
    if (cell.dwarf) return '🧙‍♀️';
    if (cell.building) return '🏠';
    
    switch (cell.type) {
      case 'mountain': return '⛰️';
      case 'stone': return '🪨';
      case 'dirt': return '🟤';
      case 'water': return '💧';
      case 'tree': return '🌸';
      case 'ore': return '✨';
      case 'grass': return '🌱';
      default: return '🟫';
    }
  };

  const getCellColor = (cell: TerrainCell) => {
    if (!cell.discovered) return 'bg-gray-800';
    
    switch (cell.type) {
      case 'mountain': return 'bg-gray-600';
      case 'stone': return 'bg-gray-500';
      case 'dirt': return 'bg-yellow-800';
      case 'water': return 'bg-blue-500';
      case 'tree': return 'bg-green-600';
      case 'ore': return 'bg-purple-600';
      case 'grass': return 'bg-green-400';
      default: return 'bg-gray-700';
    }
  };

  const handleCellClick = (x: number, y: number) => {
    if (map[y][x].discovered) {
      setSelectedCell({ x, y });
    }
  };

  return (
    <div className="h-full bg-slate-900 overflow-hidden">
      {/* Stats Bar */}
      <div className="bg-slate-800 p-2 border-b border-slate-700">
        <div className="grid grid-cols-3 gap-2 text-xs">
          <div className="text-center">
            <div className="text-blue-400">👥 {gameStats.population}</div>
            <div className="text-yellow-400">🍞 {gameStats.food}</div>
          </div>
          <div className="text-center">
            <div className="text-gray-400">🪨 {gameStats.stone}</div>
            <div className="text-green-400">🌳 {gameStats.wood}</div>
          </div>
          <div className="text-center">
            <div className="text-yellow-400">💰 {gameStats.gold}</div>
            <div className="text-purple-400">{gameStats.season} {gameStats.day}</div>
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div className="flex-1 relative overflow-auto">
        <div 
          className="inline-block p-2"
          style={{ transform: `scale(${zoom})`, transformOrigin: 'top left' }}
        >
          <div className="grid gap-px bg-slate-800 p-1 rounded-lg">
            {map.map((row, y) => (
              <div key={y} className="flex gap-px">
                {row.map((cell, x) => (
                  <button
                    key={`${x}-${y}`}
                    onClick={() => handleCellClick(x, y)}
                    className={`w-8 h-8 ${getCellColor(cell)} relative border border-slate-700 hover:border-slate-500 transition-all duration-200 flex items-center justify-center text-xs ${
                      selectedCell?.x === x && selectedCell?.y === y ? 'ring-2 ring-purple-500' : ''
                    }`}
                    disabled={!cell.discovered}
                  >
                    {cell.discovered ? (
                      <span className="text-xs">{getCellIcon(cell)}</span>
                    ) : (
                      <div className="w-full h-full bg-gray-800 flex items-center justify-center text-gray-600">
                        ?
                      </div>
                    )}
                  </button>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Selected Cell Info */}
      {selectedCell && map[selectedCell.y] && map[selectedCell.y][selectedCell.x] && (
        <div className="bg-slate-800 border-t border-slate-700 p-3">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-slate-200">
              {getCellIcon(map[selectedCell.y][selectedCell.x])} 
              Клетка ({selectedCell.x}, {selectedCell.y})
            </h3>
            <button 
              onClick={() => setSelectedCell(null)}
              className="text-slate-400 hover:text-slate-200"
            >
              ✕
            </button>
          </div>
          <div className="text-sm text-slate-300">
            <p>Тип: {map[selectedCell.y][selectedCell.x].type}</p>
            {map[selectedCell.y][selectedCell.x].resources > 0 && (
              <p>Ресурсы: {map[selectedCell.y][selectedCell.x].resources}</p>
            )}
            {map[selectedCell.y][selectedCell.x].dwarf && (
              <p className="text-blue-400">👥 Дварф здесь!</p>
            )}
          </div>
          <div className="flex space-x-2 mt-2">
            <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-1 px-2 rounded text-xs">
              <Pickaxe size={14} className="inline mr-1" />
              Копать
            </button>
            <button className="flex-1 bg-green-600 hover:bg-green-700 text-white py-1 px-2 rounded text-xs">
              <Plus size={14} className="inline mr-1" />
              Строить
            </button>
          </div>
        </div>
      )}

      {/* Zoom Controls */}
      <div className="absolute top-20 right-4 flex flex-col space-y-2">
        <button
          onClick={() => setZoom(Math.min(zoom + 0.2, 2))}
          className="bg-slate-800 hover:bg-slate-700 text-white p-2 rounded-lg border border-slate-600"
        >
          <Plus size={16} />
        </button>
        <button
          onClick={() => setZoom(Math.max(zoom - 0.2, 0.5))}
          className="bg-slate-800 hover:bg-slate-700 text-white p-2 rounded-lg border border-slate-600"
        >
          <Minus size={16} />
        </button>
        <button
          onClick={generateMap}
          className="bg-slate-800 hover:bg-slate-700 text-white p-2 rounded-lg border border-slate-600"
        >
          <RotateCcw size={16} />
        </button>
      </div>
    </div>
  );
};

export default WorldMap;