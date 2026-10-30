import { Minus, Plus } from 'lucide-react';
import { formatCredits } from '../credits';

export default function BetControls({ bet, setBet, skill, disabled }) {
  const step = skill.minBet;
  const down = () => setBet(Math.max(skill.minBet, bet - step));
  const up = () => setBet(Math.min(skill.maxBet, bet + step));

  return (
    <div className="mt-4">
      <div className="flex items-center justify-between mb-2">
        <p className="text-[11px] uppercase tracking-wide text-slate-500 font-semibold">Bet · {skill.name}</p>
        <p className="text-[11px] text-slate-500">{formatCredits(skill.minBet)} – {formatCredits(skill.maxBet)}</p>
      </div>
      <div className="flex items-center gap-3">
        <button onClick={down} disabled={disabled || bet <= skill.minBet} className="grid place-items-center w-10 h-10 rounded-xl border border-white/15 text-slate-300 disabled:opacity-30">
          <Minus className="w-4 h-4" />
        </button>
        <div className="flex-1 text-center rounded-xl bg-white/5 border border-white/10 py-2.5">
          <span className="text-xl font-extrabold tabular-nums text-emerald-300">{formatCredits(bet)}</span>
        </div>
        <button onClick={up} disabled={disabled || bet >= skill.maxBet} className="grid place-items-center w-10 h-10 rounded-xl border border-white/15 text-slate-300 disabled:opacity-30">
          <Plus className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
