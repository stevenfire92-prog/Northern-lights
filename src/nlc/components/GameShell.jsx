import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Coins } from 'lucide-react';
import { formatCredits } from '../credits';

export default function GameShell({ title, back, balance, children }) {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/90 backdrop-blur">
        <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between">
          <button onClick={() => navigate(back)} className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-100">
            <ArrowLeft className="w-4 h-4" /> Lobby
          </button>
          <h1 className="font-bold text-sm">{title}</h1>
          <button onClick={() => navigate('/wallet')} className="flex items-center gap-1.5 rounded-full bg-emerald-400/15 border border-emerald-400/30 px-3 py-1.5 text-xs font-bold text-emerald-300">
            <Coins className="w-3.5 h-3.5" /> {formatCredits(balance)}
          </button>
        </div>
      </header>
      <main className="max-w-3xl mx-auto px-4 py-6">{children}</main>
    </div>
  );
}
