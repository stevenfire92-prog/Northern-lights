import { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Sparkles, LayoutGrid, Wallet, Trophy, Settings, Coins, Gift } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getBalance, getLevel, getXP, canClaimBonus, claimDailyBonus, formatCredits } from '../credits';
import { toast } from 'sonner';
import confetti from 'canvas-confetti';

const NAV = [
  { to: '/lobby', label: 'Lobby', icon: LayoutGrid },
  { to: '/wallet', label: 'Wallet', icon: Wallet },
  { to: '/rewards', label: 'Rewards', icon: Trophy },
  { to: '/settings', label: 'Settings', icon: Settings },
];

export default function AppShell({ children }) {
  const navigate = useNavigate();
  const [balance, setBalance] = useState(getBalance());
  const [level, setLevel] = useState(getLevel());

  useEffect(() => {
    const update = () => { setBalance(getBalance()); setLevel(getLevel()); };
    window.addEventListener('nlc:balance', update);
    return () => window.removeEventListener('nlc:balance', update);
  }, []);

  const bonus = () => {
    const amount = claimDailyBonus();
    if (amount > 0) {
      confetti({ particleCount: 80, spread: 60, origin: { y: 0.3 }, colors: ['#4ade80', '#22d3ee', '#fbbf24'] });
      toast.success(`Daily bonus claimed: +${formatCredits(amount)} credits!`);
      setBalance(getBalance());
    } else {
      toast.info('Come back tomorrow for your next bonus.');
    }
  };

  const xp = getXP();
  const xpPct = ((xp % 1000) / 1000) * 100;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/90 backdrop-blur">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between gap-3">
          <button onClick={() => navigate('/')} className="flex items-center gap-2">
            <span className="grid place-items-center w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 via-cyan-400 to-violet-500 shadow-lg shadow-emerald-500/25">
              <Sparkles className="w-5 h-5 text-slate-950" />
            </span>
            <span className="font-bold tracking-tight hidden sm:block">Northern Lights</span>
          </button>

          <div className="flex items-center gap-2">
            {canClaimBonus() && (
              <button onClick={bonus} className="flex items-center gap-1.5 rounded-full bg-amber-400/15 border border-amber-400/40 px-3 py-1.5 text-xs font-bold text-amber-300 animate-pulse">
                <Gift className="w-3.5 h-3.5" /> Daily bonus
              </button>
            )}
            <div className="hidden sm:block text-right mr-1">
              <p className="text-[10px] text-slate-500 uppercase tracking-wide">Level {level}</p>
              <div className="w-20 h-1 rounded-full bg-white/10 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-emerald-400 to-cyan-400" style={{ width: `${xpPct}%` }} />
              </div>
            </div>
            <button onClick={() => navigate('/wallet')} className="flex items-center gap-1.5 rounded-full bg-emerald-400/15 border border-emerald-400/30 px-3.5 py-2 text-sm font-extrabold text-emerald-300">
              <Coins className="w-4 h-4" /> {formatCredits(balance)}
            </button>
          </div>
        </div>
        <nav className="max-w-5xl mx-auto px-4 flex gap-1 pb-2 overflow-x-auto">
          {NAV.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) => cn(
                'flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-semibold whitespace-nowrap',
                isActive ? 'bg-emerald-400/15 text-emerald-300' : 'text-slate-500 hover:text-slate-200'
              )}
            >
              <Icon className="w-3.5 h-3.5" /> {label}
            </NavLink>
          ))}
        </nav>
      </header>
      <main className="max-w-5xl mx-auto px-4 py-6">{children}</main>
    </div>
  );
}
