import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Plus, Trophy, Swords, Crosshair, TrendingUp, Activity, BarChart2, Shield } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { TeamStanding } from '../types';
import { cn } from '../lib/utils';

interface TeamModalProps {
  team: TeamStanding | null;
  isKillPointEnabled: boolean;
  onClose: () => void;
  onAddMatch: (teamId: string, booyahs: number, roundsWon: number, kills: number) => void;
}

export function TeamModal({ team, isKillPointEnabled, onClose, onAddMatch }: TeamModalProps) {
  const [bInput, setBInput] = useState('');
  const [rInput, setRInput] = useState('');
  const [kInput, setKInput] = useState('');

  const chartData = useMemo(() => {
    if (!team) return [];
    let cumulative = 0;
    const sortedHistory = [...team.matchHistory].sort((a, b) => a.matchNumber - b.matchNumber);
    return sortedHistory.map(m => {
      const pts = (m.booyahs * 5) + (m.roundsWon * 1) + (isKillPointEnabled ? m.kills : 0);
      cumulative += pts;
      return {
        match: `M${m.matchNumber}`,
        points: cumulative,
      };
    });
  }, [team, isKillPointEnabled]);

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!team) return;

    const booyahs = parseInt(bInput) || 0;
    const rounds = parseInt(rInput) || 0;
    const kills = parseInt(kInput) || 0;
    
    // Quick guard to prevent totally empty submissions unless intended
    if(booyahs === 0 && rounds === 0 && kills === 0 && bInput === '') return;

    onAddMatch(team.id, booyahs, rounds, kills);
    setBInput('');
    setRInput('');
    setKInput('');
  };

  if (!team) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="glass-card relative w-full max-w-2xl max-h-[90vh] overflow-y-auto overflow-x-hidden p-0 bg-[#0a0a0c]/95 flex flex-col border border-white/10 shadow-2xl z-10 custom-scrollbar rounded-2xl"
        >
          {/* Header */}
          <div className="sticky top-0 z-20 flex items-start justify-between p-6 bg-[#0a0a0c]/90 backdrop-blur-xl border-b border-white/5">
            <div className="flex flex-col gap-4">
              {/* Glassmorphic Logo Placeholder */}
              <div className="relative flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 shadow-[0_0_20px_rgba(255,255,255,0.05)] backdrop-blur-md overflow-hidden ring-1 ring-white/10">
                {/* Inner glow effect */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent"></div>
                <Shield className="w-8 h-8 text-zinc-400 stroke-[1.5]" />
                <span className="absolute bottom-1.5 text-[8px] font-bold tracking-widest uppercase text-zinc-500">Logo</span>
              </div>

              <div className="flex flex-col gap-1">
                <h2 className="text-3xl font-black italic tracking-tighter uppercase text-white leading-none drop-shadow-md">{team.name}</h2>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                    Rank #{team.rank}
                  </span>
                  <span className="w-1 h-1 rounded-full bg-zinc-600"></span>
                  <span className={cn(
                    "text-[10px] font-bold uppercase tracking-widest",
                    team.status === 'Qualified' ? 'text-[#00ffa3]' : team.status === 'Contender' ? 'text-[#ffea00]' : 'text-red-400'
                  )}>
                    {team.status}
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-zinc-500 hover:text-white bg-white/5 hover:bg-white/10 p-2 rounded-xl transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 flex flex-col gap-6">
            {/* Quick Stats Grid */}
            <section className="relative overflow-hidden p-5 rounded-xl border border-zinc-800 bg-gradient-to-br from-zinc-900/60 to-black/40">
              <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                <TrendingUp className="w-32 h-32" />
              </div>
              
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-4 flex items-center gap-2 relative z-10">
                <BarChart2 className="w-3 h-3 text-orange-500" /> Cumulative Overview
              </h3>
              
              <div className="grid grid-cols-4 gap-3 relative z-10">
                <div className="bento-stat bg-white/5 border border-white/5 gap-1 py-4">
                  <Trophy className="w-4 h-4 text-zinc-400 mb-1" />
                  <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider">Booyahs</span>
                  <span className="text-xl font-bold">{team.booyahs}</span>
                </div>
                <div className="bento-stat bg-white/5 border border-white/5 gap-1 py-4">
                  <Swords className="w-4 h-4 text-blue-400 mb-1" />
                  <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider">Rounds</span>
                  <span className="text-xl font-bold">{team.roundsWon}</span>
                </div>
                <div className="bento-stat bg-white/5 border border-white/5 gap-1 py-4">
                  <Crosshair className="w-4 h-4 text-purple-400 mb-1" />
                  <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider">Kills</span>
                  <span className="text-xl font-bold">{team.kills}</span>
                </div>
                <div className="bento-stat bg-gradient-to-t from-orange-500/20 to-orange-500/5 border border-orange-500/20 shadow-[0_0_15px_rgba(249,115,22,0.1)] gap-1 py-4">
                  <TrendingUp className="w-4 h-4 text-orange-400 mb-1" />
                  <span className="text-[10px] text-orange-500/70 uppercase font-bold tracking-wider">Total Pts</span>
                  <span className="text-2xl font-black text-orange-400">{team.totalPoints}</span>
                </div>
              </div>
            </section>

            {/* Match History Table */}
            <section className="p-5 rounded-xl border border-zinc-800 bg-gradient-to-tr from-zinc-900/60 to-black/40">
               <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-4 flex items-center gap-2">
                 <Activity className="w-3 h-3 text-blue-500" /> Match History Breakdown
               </h3>
               
               <div className="rounded-lg border border-white/5 overflow-hidden bg-black/40">
                  <table className="w-full text-left text-sm whitespace-nowrap">
                    <thead className="bg-[#121214] text-[10px] uppercase font-bold text-zinc-500 tracking-wider">
                      <tr>
                        <th className="px-4 py-3 text-center border-b border-white/5">Match #</th>
                        <th className="px-4 py-3 text-center border-b border-white/5">Booyahs <span className="text-zinc-600">(+5)</span></th>
                        <th className="px-4 py-3 text-center border-b border-white/5">Rounds <span className="text-zinc-600">(+1)</span></th>
                        <th className="px-4 py-3 text-center border-b border-white/5">Kills <span className="text-zinc-600">{isKillPointEnabled && '(+1)'}</span></th>
                        <th className="px-4 py-3 text-right bg-white/[0.02] border-b border-white/5">Balance Pts</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {team.matchHistory.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="px-4 py-8 text-center text-zinc-500 text-xs italic">No matches logged yet.</td>
                        </tr>
                      ) : (
                        team.matchHistory.map((m) => {
                           const pts = (m.booyahs * 5) + (m.roundsWon * 1) + (isKillPointEnabled ? m.kills : 0);
                           return (
                            <tr key={m.id} className="hover:bg-white/5 transition-colors">
                              <td className="px-4 py-3 text-center font-mono text-zinc-400 opacity-80">{m.matchNumber.toString().padStart(2, '0')}</td>
                              <td className="px-4 py-3 text-center font-bold text-white/90">{m.booyahs}</td>
                              <td className="px-4 py-3 text-center font-bold text-blue-400/90">{m.roundsWon}</td>
                              <td className="px-4 py-3 text-center font-bold text-purple-400/90">{m.kills}</td>
                              <td className="px-4 py-3 text-right font-black text-orange-400 bg-white/[0.02]">{pts} pts</td>
                            </tr>
                           )
                        })
                      )}
                    </tbody>
                  </table>
               </div>
            </section>

            {/* Points Trend Chart */}
            {chartData.length > 0 && (
              <section className="p-5 rounded-xl border border-zinc-800 bg-gradient-to-tr from-zinc-900/60 to-black/40">
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-4 flex items-center gap-2">
                  <TrendingUp className="w-3 h-3 text-orange-400" /> Cumulative Points Trend
                </h3>
                <div className="h-[200px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <XAxis 
                        dataKey="match" 
                        stroke="#71717a" 
                        fontSize={10} 
                        tickLine={false} 
                        axisLine={false} 
                      />
                      <YAxis 
                        stroke="#71717a" 
                        fontSize={10} 
                        tickLine={false} 
                        axisLine={false} 
                      />
                      <Tooltip
                        contentStyle={{ 
                          backgroundColor: '#0a0a0c', 
                          borderColor: '#27272a', 
                          borderRadius: '8px', 
                          fontSize: '12px',
                          color: '#fff'
                        }}
                        itemStyle={{ color: '#f97316', fontWeight: 'bold' }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="points" 
                        stroke="#f97316" 
                        strokeWidth={3} 
                        dot={{ r: 4, fill: '#0a0a0c', stroke: '#f97316', strokeWidth: 2 }} 
                        activeDot={{ r: 6, fill: '#f97316' }} 
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </section>
            )}

            {/* Add Match Form */}
            <section className="p-5 rounded-xl border border-orange-500/20 bg-gradient-to-r from-orange-500/10 to-transparent">
               <h3 className="text-[10px] font-bold uppercase tracking-widest text-orange-500 mb-4 flex items-center gap-2">
                 <Plus className="w-3 h-3" /> Log New Match
               </h3>
               <form onSubmit={handleAddSubmit} className="flex flex-col sm:flex-row items-end gap-4">
                  <div className="flex-1 w-full flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Booyahs</label>
                    <input type="number" min="0" value={bInput} onChange={e => setBInput(e.target.value)} className="w-full bg-black/60 border border-white/10 rounded-lg px-3 py-2 text-sm outline-none focus:border-orange-500 transition-colors" placeholder="0" />
                  </div>
                  <div className="flex-1 w-full flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Rounds</label>
                    <input type="number" min="0" value={rInput} onChange={e => setRInput(e.target.value)} className="w-full bg-black/60 border border-white/10 rounded-lg px-3 py-2 text-sm outline-none focus:border-orange-500 transition-colors" placeholder="0" />
                  </div>
                  <div className="flex-1 w-full flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Kills</label>
                    <input type="number" min="0" value={kInput} onChange={e => setKInput(e.target.value)} className="w-full bg-black/60 border border-white/10 rounded-lg px-3 py-2 text-sm outline-none focus:border-orange-500 transition-colors" placeholder="0" />
                  </div>
                  <button type="submit" className="w-full sm:w-auto bg-orange-500 hover:bg-orange-400 text-black px-6 py-2 rounded-lg font-bold text-xs uppercase tracking-widest transition-colors h-[38px]">
                    Submit
                  </button>
               </form>
            </section>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
