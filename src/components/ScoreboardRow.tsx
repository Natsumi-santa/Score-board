import { motion } from 'motion/react';
import { Trophy, Crosshair, Swords } from 'lucide-react';
import { TeamStanding } from '../types';
import { cn } from '../lib/utils';

interface ScoreboardRowProps {
  standing: TeamStanding;
  onClick: () => void;
}

export function ScoreboardRow({ standing, onClick }: ScoreboardRowProps) {
  const { rank, name, booyahs, roundsWon, kills, totalPoints, status } = standing;

  const rowStyles = {
    Qualified: 'qualified-row',
    Contender: 'contender-row',
    Eliminated: 'eliminated-row',
  };

  const statusTextColors = {
    Qualified: 'status-Qualified',
    Contender: 'status-Contender',
    Eliminated: 'status-Eliminated',
  };

  const statusLabels = {
    Qualified: 'Locked',
    Contender: 'In the Hunt',
    Eliminated: 'At Risk',
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4, type: 'spring', bounce: 0.2 }}
      onClick={onClick}
      className={cn(
        'glass-card grid grid-cols-1 md:grid-cols-12 items-center px-6 py-3 transition-all gap-4 text-white cursor-pointer hover:brightness-125',
        rowStyles[status]
      )}
    >
      {/* Rank & Name section (col-span-5) */}
      <div className="flex items-center gap-4 col-span-1 md:col-span-5">
        <div className={cn(
          "font-mono font-bold text-lg w-8 text-center",
          status === 'Qualified' ? 'text-[#00ffa3]' : status === 'Contender' ? 'text-[#ffea00]' : 'text-red-400'
        )}>
          {rank.toString().padStart(2, '0')}
        </div>
        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-white/5 border border-white/10 shrink-0 overflow-hidden shadow-inner font-black text-white/80">
          {name.substring(0, 2).toUpperCase()}
        </div>
        <div className="flex flex-col">
          <h3 className="font-bold text-base uppercase tracking-wide leading-none mb-1">{name}</h3>
          <span className="text-[10px] text-zinc-500 uppercase font-bold md:hidden">{statusLabels[status]}</span>
        </div>
      </div>

      {/* Bento-style Stats (col-span-4) */}
      <div className="flex items-center justify-center gap-2 col-span-1 md:col-span-4">
        <div className="bento-stat gap-1">
          <div className="flex items-center gap-1">
            <Trophy className="w-3 h-3 text-zinc-400" />
            <span className="text-[8px] text-zinc-400 uppercase">BY</span>
          </div>
          <span className="text-xs font-bold">{booyahs.toString().padStart(2, '0')}</span>
        </div>
        
        <div className="bento-stat gap-1">
          <div className="flex items-center gap-1">
            <Swords className="w-3 h-3 text-zinc-400" />
            <span className="text-[8px] text-zinc-400 uppercase">RD</span>
          </div>
          <span className="text-xs font-bold">{roundsWon.toString().padStart(2, '0')}</span>
        </div>

        <div className="bento-stat gap-1">
          <div className="flex items-center gap-1">
            <Crosshair className="w-3 h-3 text-zinc-400" />
            <span className="text-[8px] text-zinc-400 uppercase">KL</span>
          </div>
          <span className="text-xs font-bold">{kills.toString().padStart(2, '0')}</span>
        </div>
      </div>

      {/* Total Points (col-span-1) */}
      <div className="flex items-center justify-center col-span-1 md:col-span-1">
         <span className="font-black text-xl">{totalPoints}</span>
      </div>

      {/* Status (col-span-2) */}
      <div className="hidden md:flex items-center justify-end col-span-1 md:col-span-2">
        <span className={cn("text-[10px] font-black uppercase px-2 py-0.5 rounded text-center whitespace-nowrap", statusTextColors[status])}>
          {statusLabels[status]}
        </span>
      </div>
    </motion.div>
  );
}
