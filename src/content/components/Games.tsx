import { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Users, TrendingUp, AlertTriangle } from 'lucide-react';

interface Person {
  id: number;
  x: number;
  y: number;
  status: number;
  happiness: number;
  desire: number;
  hasReligion: boolean;
}

const HierarchySimulator = () => {
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [time, setTime] = useState<number>(0);
  const [people, setPeople] = useState<Person[]>([]);
  const [systemType, setSystemType] = useState<'status' | 'religion'>('status');
  const [tensions, setTensions] = useState<number>(0);
  const [totalValue, setTotalValue] = useState<number>(0);
  
  const initializePeople = () => {
    const newPeople = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 300,
      y: Math.random() * 200,
      status: Math.random() * 100,
      happiness: Math.random() * 50 + 25,
      desire: Math.random() * 80 + 20,
      hasReligion: systemType === 'religion'
    }));
    setPeople(newPeople);
    setTensions(0);
    setTotalValue(0);
  };

  useEffect(() => {
    initializePeople();
  }, [systemType]);

  useEffect(() => {
    let interval: number | undefined;
    if (isRunning) {
      interval = window.setInterval(() => {
        setTime(t => t + 1);
        updateSimulation();
      }, 200);
    }
    return () => clearInterval(interval);
  }, [isRunning, systemType]);

  const updateSimulation = () => {
    setPeople(prevPeople => {
      const newPeople = prevPeople.map(person => {
        let newHappiness = person.happiness;
        let newStatus = person.status;
        let newDesire = person.desire;

        if (systemType === 'status') {
          // In status game: happiness decreases if below average status
          const avgStatus = prevPeople.reduce((sum, p) => sum + p.status, 0) / prevPeople.length;
          if (person.status < avgStatus) {
            newHappiness = Math.max(0, person.happiness - Math.random() * 3);
          }
          // Status fluctuates as people compete
          newStatus = Math.max(0, Math.min(100, person.status + (Math.random() - 0.5) * 8));
          newDesire = Math.min(100, person.desire + Math.random() * 2);
        } else {
          // With religion: higher purpose reduces status competition
          if (person.hasReligion) {
            newHappiness = Math.min(100, person.happiness + Math.random() * 2);
            newDesire = Math.max(10, person.desire - Math.random() * 1.5);
          }
          newStatus = Math.max(0, Math.min(100, person.status + (Math.random() - 0.5) * 3));
        }

        return {
          ...person,
          happiness: newHappiness,
          status: newStatus,
          desire: newDesire
        };
      });

      // Calculate tensions and total value
      const avgHappiness = newPeople.reduce((sum, p) => sum + p.happiness, 0) / newPeople.length;
      const statusVariance = newPeople.reduce((sum, p) => sum + Math.pow(p.status - 50, 2), 0) / newPeople.length;
      
      setTensions(prev => Math.min(100, prev + (100 - avgHappiness) * 0.1 + statusVariance * 0.02));
      setTotalValue(prev => systemType === 'religion' ? prev + avgHappiness * 0.1 : prev + Math.max(0, avgHappiness - 40) * 0.05);

      return newPeople;
    });
  };

  const reset = () => {
    setIsRunning(false);
    setTime(0);
    initializePeople();
  };

  const getPersonColor = (person: Person): string => {
    if (systemType === 'religion' && person.hasReligion) {
      return `hsl(${240 + person.happiness * 1.2}, 70%, ${50 + person.happiness * 0.3}%)`;
    }
    return `hsl(${person.happiness * 1.2}, 70%, ${50 + person.status * 0.3}%)`;
  };

  const getPersonSize = (person: Person): number => {
    return 4 + (person.status / 100) * 8;
  };

  return (
    <div className="max-w-4xl mx-auto p-4 bg-gray-800/70 dark:bg-gray-800/90 rounded-lg shadow-[0_0_8px_rgba(0,0,0,0.8)] border border-gray-700/70">
      <div className="text-center mb-4">
        <h2 className="text-2xl font-bold text-slate-300 mb-2">Social Hierarchy Simulation</h2>
        <p className="text-sm text-slate-400">Watch how different systems affect social harmony and value creation</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-4">
        <div className="lg:w-3/5">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex gap-2">
              <button
                onClick={() => setIsRunning(!isRunning)}
                className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 text-sm ${
                  isRunning ? 'bg-red-600 hover:bg-red-700 text-white' : 'bg-green-600 hover:bg-green-700 text-white'
                }`}
              >
                {isRunning ? <Pause size={14} /> : <Play size={14} />}
                {isRunning ? 'Pause' : 'Start'}
              </button>
              <button
                onClick={reset}
                className="px-3 py-1.5 bg-slate-600 hover:bg-slate-700 text-white rounded-md flex items-center gap-1.5 text-sm"
              >
                <RotateCcw size={14} />
                Reset
              </button>
            </div>
            <div className="text-xs text-slate-400">Time: {time}s</div>
          </div>

          <div className="mb-3">
            <label className="block text-xs font-medium text-slate-300 mb-1">System Type:</label>
            <div className="flex gap-3">
              <label className="flex items-center text-xs text-slate-300">
                <input
                  type="radio"
                  value="status"
                  checked={systemType === 'status'}
                  onChange={(e) => setSystemType(e.target.value as 'status' | 'religion')}
                  className="mr-2"
                />
                Pure Status Competition
              </label>
              <label className="flex items-center text-xs text-slate-300">
                <input
                  type="radio"
                  value="religion"
                  checked={systemType === 'religion'}
                  onChange={(e) => setSystemType(e.target.value as 'status' | 'religion')}
                  className="mr-2"
                />
                With Higher Purpose (Religion)
              </label>
            </div>
          </div>

          <div className="border border-gray-700/50 rounded-md p-2 bg-gray-900/70 relative overflow-hidden" style={{ height: '250px' }}>
            <svg width="100%" height="100%" className="absolute inset-0">
              {people.map(person => (
                <circle
                  key={person.id}
                  cx={person.x}
                  cy={person.y}
                  r={getPersonSize(person)}
                  fill={getPersonColor(person)}
                  opacity={0.8}
                  className="transition-all duration-200"
                />
              ))}
            </svg>
            <div className="absolute bottom-1 left-1 text-xs text-gray-400">
              Circle size = Status level, Color = Happiness/Purpose
            </div>
          </div>
        </div>

        <div className="lg:w-2/5 space-y-3">
          <div className="bg-slate-700/50 p-3 rounded-md border border-slate-600/80">
            <div className="flex items-center gap-1.5 mb-1.5">
              <Users size={16} className="text-sky-400" />
              <h3 className="font-semibold text-sm text-sky-300">Population Metrics</h3>
            </div>
            <div className="space-y-1 text-xs text-slate-300">
              <div className="flex justify-between">
                <span>Average Happiness:</span>
                <span className="font-medium">
                  {people.length ? Math.round(people.reduce((s, p) => s + p.happiness, 0) / people.length) : 0}%
                </span>
              </div>
              <div className="flex justify-between">
                <span>Status Inequality:</span>
                <span className="font-medium">
                  {people.length ? Math.round(Math.max(...people.map(p => p.status)) - Math.min(...people.map(p => p.status))) : 0}%
                </span>
              </div>
            </div>
          </div>

          <div className="bg-slate-700/50 p-3 rounded-md border border-slate-600/80">
            <div className="flex items-center gap-1.5 mb-1.5">
              <AlertTriangle size={16} className="text-red-400" />
              <h3 className="font-semibold text-sm text-red-300">Social Tensions</h3>
            </div>
            <div className="w-full bg-slate-600 rounded-full h-2">
              <div 
                className="bg-red-500 h-2 rounded-full transition-all duration-300" 
                style={{ width: `${Math.min(100, tensions)}%` }}
              ></div>
            </div>
            <div className="text-xs text-red-400 mt-0.5">{Math.round(tensions)}% tension level</div>
          </div>

          <div className="bg-slate-700/50 p-3 rounded-md border border-slate-600/80">
            <div className="flex items-center gap-1.5 mb-1.5">
              <TrendingUp size={16} className="text-green-400" />
              <h3 className="font-semibold text-sm text-green-300">Total Value Created</h3>
            </div>
            <div className="text-xl font-bold text-green-300">{Math.round(totalValue)}</div>
            <div className="text-xs text-green-400">Cumulative societal benefit</div>
          </div>

          <div className="bg-slate-700/50 p-3 rounded-md text-xs border border-slate-600/80">
            <h4 className="font-semibold text-yellow-300 mb-1.5">Observations:</h4>
            <ul className="space-y-0.5 text-yellow-400">
              {systemType === 'status' ? (
                <>
                  <li>• Pure status competition creates inequality</li>
                  <li>• Lower-status individuals become unhappy</li>
                  <li>• Tensions rise as desires increase</li>
                  <li>• Limited value creation occurs</li>
                </>
              ) : (
                <>
                  <li>• Higher purpose reduces status obsession</li>
                  <li>• More stable happiness levels</li>
                  <li>• Reduced social tensions</li>
                  <li>• Consistent value creation</li>
                </>
              )}
            </ul>
          </div>
        </div>
      </div>

     
    </div>
  );
};

export default HierarchySimulator;