import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ScoreboardRow } from './ScoreboardRow';
import { TeamModal } from './TeamModal';
import { Team, TeamStanding } from '../types';
import { calculateStandings } from '../lib/scoreboard';

const INITIAL_TEAMS: Team[] = [
  { id: '1', name: 'Team Alpha', booyahs: 2, roundsWon: 15, kills: 42, matchHistory: [] },
  { id: '2', name: 'Bravo Six', booyahs: 1, roundsWon: 12, kills: 35, matchHistory: [] },
  { id: '3', name: 'Delta Force', booyahs: 0, roundsWon: 8, kills: 22, matchHistory: [] },
  { id: '4', name: 'Echo Squad', booyahs: 0, roundsWon: 10, kills: 28, matchHistory: [] },
  { id: '5', name: 'Ghost Protocol', booyahs: 3, roundsWon: 18, kills: 50, matchHistory: [] },
  { id: '6', name: 'Nova Gaming', booyahs: 1, roundsWon: 9, kills: 19, matchHistory: [] },
  { id: '7', name: 'Omega Legion', booyahs: 0, roundsWon: 5, kills: 12, matchHistory: [] },
  { id: '8', name: 'Titan Esports', booyahs: 0, roundsWon: 7, kills: 18, matchHistory: [] },
  { id: '9', name: 'Vanguard', booyahs: 1, roundsWon: 11, kills: 25, matchHistory: [] },
  { id: '10', name: 'Phoenix', booyahs: 0, roundsWon: 4, kills: 10, matchHistory: [] },
].map(t => ({
  ...t,
  matchHistory: [{
    id: `m-init-${t.id}`,
    matchNumber: 1,
    booyahs: t.booyahs,
    roundsWon: t.roundsWon,
    kills: t.kills,
  }]
}));

export function Scoreboard() {
  const [teams, setTeams] = useState<Team[]>(INITIAL_TEAMS);
  const [isKillPointEnabled, setIsKillPointEnabled] = useState(true);
  const [matchesRemaining, setMatchesRemaining] = useState(2);
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);

  const standings = useMemo(() => {
    return calculateStandings(teams, isKillPointEnabled, matchesRemaining);
  }, [teams, isKillPointEnabled, matchesRemaining]);

  const selectedTeam = useMemo(() => {
    return standings.find(s => s.id === selectedTeamId) || null;
  }, [standings, selectedTeamId]);

  const handleAddMatch = (teamId: string, booyahs: number, roundsWon: number, kills: number) => {
    setTeams(prev => prev.map(t => {
      if (t.id === teamId) {
        const newRecord = {
          id: Math.random().toString(),
          matchNumber: t.matchHistory.length + 1,
          booyahs,
          roundsWon,
          kills,
        };
        return {
          ...t,
          booyahs: t.booyahs + booyahs,
          roundsWon: t.roundsWon + roundsWon,
          kills: t.kills + kills,
          matchHistory: [...t.matchHistory, newRecord]
        };
      }
      return t;
    }));
  };

  const simulateUpdate = () => {
    setTeams(prevTeams => 
      prevTeams.map(t => {
        const addBooyah = Math.random() > 0.8 ? 1 : 0;
        const addRounds = Math.floor(Math.random() * 3);
        const addKills = Math.floor(Math.random() * 5);
        const newRecord = {
          id: Math.random().toString(),
          matchNumber: t.matchHistory.length + 1,
          booyahs: addBooyah,
          roundsWon: addRounds,
          kills: addKills,
        };
        return {
          ...t,
          booyahs: t.booyahs + addBooyah,
          roundsWon: t.roundsWon + addRounds,
          kills: t.kills + addKills,
          matchHistory: [...t.matchHistory, newRecord]
        };
      })
    );
  };

  const cutoffRank = 6;
  const cutoffPoints = standings.length >= cutoffRank ? standings[cutoffRank - 1].totalPoints : 0;

  return (
    <div className="w-full h-full flex flex-col gap-6">
      {/* Header aligned with design */}
      <header className="flex flex-col md:flex-row md:justify-between md:items-end gap-4">
        <div className="flex flex-col">
          <span className="text-xs font-bold tracking-[0.3em] text-zinc-500 uppercase">eSports Championship Series</span>
          <h1 className="text-3xl sm:text-4xl font-black italic tracking-tighter uppercase">
            Pro League <span className="text-orange-500">Qualifier</span>
          </h1>
        </div>
        <div className="flex gap-4 items-center">
          <div className="glass-card px-4 py-2 flex flex-col items-end">
             <span className="text-[10px] uppercase text-zinc-400">Current Cut-off</span>
             <span className="text-xl font-mono font-bold text-white">{cutoffPoints} PTS</span>
          </div>
          <div className="bg-red-600 px-3 py-1 rounded flex items-center gap-2 animate-pulse">
             <div className="w-2 h-2 bg-white rounded-full"></div>
             <span className="text-xs font-bold uppercase">Live</span>
          </div>
        </div>
      </header>

      {/* Controls & Threshold Info */}
      <div className="glass-card p-4 sm:px-6 flex flex-col md:flex-row md:items-center justify-between gap-6 bg-gradient-to-r from-orange-600/20 to-transparent border-l-4 border-l-orange-500 border-t border-r border-b">
        <div className="flex flex-col space-y-1">
          <span className="text-xs font-bold uppercase text-orange-500">Prediction Engine Variables</span>
          <p className="text-sm text-zinc-300">
            Customize parameters to recalculate Safety Threshold.
          </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-4">
          <label className="flex items-center gap-2 text-zinc-300 text-[10px] uppercase font-bold tracking-wider cursor-pointer hover:text-white transition-colors">
            <input 
              type="checkbox" 
              checked={isKillPointEnabled}
              onChange={(e) => setIsKillPointEnabled(e.target.checked)}
              className="rounded border-zinc-500 bg-black/50 text-orange-500 focus:ring-orange-500"
            />
            Kill Points
          </label>
          <div className="flex flex-col text-center">
            <span className="text-[10px] uppercase text-zinc-500 font-bold mb-1">Rounds Left</span>
            <input 
              type="number"
              min="0"
              max="10"
              value={matchesRemaining}
              onChange={(e) => setMatchesRemaining(parseInt(e.target.value) || 0)}
              className="w-16 bg-black/30 border border-white/10 text-white font-mono text-center rounded px-2 py-1 outline-none focus:border-orange-500 text-sm"
            />
          </div>
          <button 
            onClick={simulateUpdate}
            className="px-4 py-2 rounded bg-white/10 hover:bg-white/20 border border-white/20 text-white text-[10px] uppercase tracking-widest font-bold active:scale-95 transition-all"
          >
            Simulate
          </button>
        </div>
      </div>

      <main className="flex-1 flex flex-col gap-6">
        {/* Column Headers */}
        <div className="hidden md:grid grid-cols-12 px-6 text-[10px] uppercase font-bold text-zinc-500 tracking-wider w-full">
           <div className="col-span-5 flex gap-4">
              <div className="w-8 text-center">Rk</div>
              <div>Team Identity</div>
           </div>
           <div className="col-span-4 text-center">Bento Stats (B | R | K)</div>
           <div className="col-span-1 text-center">Pts</div>
           <div className="col-span-2 text-right">Status</div>
        </div>

        {/* Standings List */}
        <div className="flex flex-col gap-3 pb-8">
          <AnimatePresence mode="popLayout">
            {standings.map(standing => (
              <ScoreboardRow 
                key={standing.id} 
                standing={standing} 
                onClick={() => setSelectedTeamId(standing.id)} 
              />
            ))}
          </AnimatePresence>
        </div>
      </main>

      <footer className="flex justify-between items-center text-[10px] uppercase tracking-widest text-zinc-600 border-t border-white/5 pt-4">
        <p>Free Fire Scoreboard Engine v4.2 // Automated Predicted Logic</p>
        <p>Live Data Stream: #BR-QUAL-402</p>
      </footer>
      
      {/* Team Details Modal */}
      <TeamModal 
        team={selectedTeam} 
        isKillPointEnabled={isKillPointEnabled}
        onClose={() => setSelectedTeamId(null)} 
        onAddMatch={handleAddMatch}
      />
    </div>
  );
}
