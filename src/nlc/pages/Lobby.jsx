import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Flame } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import AppShell from '../components/AppShell';
import { getSkill, SKILL_LEVELS } from '../credits';

const GAMES = [
  { id: 'slots', icon: '🎰', name: 'Aurora Slots', desc: 'Spin the reels, chase the jackpot.', path: '/play/slots', hot: true },
  { id: 'blackjack', icon: '🂡', name: 'Blackjack', desc: 'Beat the dealer to 21.', path: '/play/blackjack', hot: true },
  { id: 'roulette', icon: '🎡', name: 'Roulette', desc: 'Red, black, lucky numbers.', path: '/play/roulette', hot: false },
];

export default function Lobby() {
  const navigate = useNavigate();
  const skill = SKILL_LEVELS[getSkill()];

  return (
    <AppShell>
      <div className="flex items-end justify-between mb-6">
        <div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight">Game lobby</h1>
          <p className="text-sm text-slate-500 mt-1">Pick your game. Playing as <span className="text-emerald-300 font-semibold">{skill.name}</span> — change it in Settings.</p>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {GAMES.map((g, i) => (
          <motion.button
            key={g.id}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            onClick={() => navigate(g.path)}
            className="text-left group"
          >
            <Card className="h-full border-white/10 bg-white/[0.03] hover:border-emerald-400/40 hover:scale-[1.02] transition-all overflow-hidden">
              <div className="h-36 bg-gradient-to-br from-emerald-500/20 via-cyan-500/10 to-violet-500/20 grid place-items-center relative">
                <span className="text-6xl group-hover:scale-110 transition-transform">{g.icon}</span>
                {g.hot && (
                  <Badge className="absolute top-3 right-3 bg-amber-400/20 text-amber-300 border-amber-400/40 text-[10px]">
                    <Flame className="w-3 h-3 mr-1" /> HOT
                  </Badge>
                )}
              </div>
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold">{g.name}</h3>
                  <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-300 group-hover:translate-x-1 transition-all" />
                </div>
                <p className="text-sm text-slate-500 mt-1">{g.desc}</p>
              </CardContent>
            </Card>
          </motion.button>
        ))}
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="mt-8 rounded-2xl border border-white/10 bg-white/[0.02] p-5 flex items-center justify-between">
        <div>
          <p className="font-semibold text-sm">Running low on credits?</p>
          <p className="text-xs text-slate-500 mt-0.5">Top up in seconds — more credits, more play.</p>
        </div>
        <button onClick={() => navigate('/wallet')} className="rounded-xl bg-gradient-to-r from-emerald-400 to-cyan-500 px-5 py-2.5 text-sm font-extrabold text-slate-950 shrink-0">
          Get credits
        </button>
      </motion.div>
    </AppShell>
  );
}
