import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Flame, Star, Gift, Check } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import AppShell from '../components/AppShell';
import { getLevel, getXP, canClaimBonus, claimDailyBonus, addCredits, formatCredits } from '../credits';
import { toast } from 'sonner';
import confetti from 'canvas-confetti';
import { Button } from '@/components/ui/button';

export default function Rewards() {
  const [level, setLevel] = useState(getLevel());
  const xp = getXP();
  const xpInto = xp % 1000;
  const xpPct = (xpInto / 1000) * 100;

  const milestones = [5, 10, 25, 50, 100].map((l) => ({
    level: l,
    reached: level >= l,
    reward: l * 500,
  }));

  const claimBonus = () => {
    const amount = claimDailyBonus();
    if (amount > 0) {
      confetti({ particleCount: 80, spread: 60, origin: { y: 0.3 } });
      toast.success(`+${formatCredits(amount)} daily bonus!`);
    }
  };

  const claimMilestone = (m) => {
    addCredits(m.reward, `Level ${m.level} milestone`);
    toast.success(`Milestone claimed: +${formatCredits(m.reward)} credits!`);
    confetti({ particleCount: 100, spread: 70, origin: { y: 0.4 } });
  };

  return (
    <AppShell>
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <h1 className="text-xl md:text-2xl font-bold tracking-tight">Rewards</h1>
          <p className="text-sm text-slate-500 mt-1">Play more, earn more. Every win pushes you forward.</p>
        </div>

        <Card className="border-violet-400/25 bg-gradient-to-b from-violet-400/[0.07] to-white/[0.02] mb-5">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2.5">
                <span className="grid place-items-center w-11 h-11 rounded-xl bg-gradient-to-br from-violet-400 to-fuchsia-500">
                  <Trophy className="w-5 h-5 text-white" />
                </span>
                <div>
                  <p className="font-extrabold text-lg">Level {level}</p>
                  <p className="text-xs text-slate-500">{formatCredits(xpInto)} / 1,000 XP to next level</p>
                </div>
              </div>
              <Star className="w-6 h-6 text-amber-300" />
            </div>
            <div className="h-2.5 rounded-full bg-white/10 overflow-hidden">
              <motion.div className="h-full rounded-full bg-gradient-to-r from-violet-400 to-fuchsia-400" initial={{ width: 0 }} animate={{ width: `${xpPct}%` }} transition={{ duration: 0.8 }} />
            </div>
          </CardContent>
        </Card>

        {canClaimBonus() && (
          <Card className="border-amber-400/30 bg-amber-400/[0.06] mb-5">
            <CardContent className="p-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Gift className="w-8 h-8 text-amber-300" />
                <div>
                  <p className="font-bold">Daily bonus available</p>
                  <p className="text-xs text-slate-500">+500 free credits, on the house.</p>
                </div>
              </div>
              <Button onClick={claimBonus} className="bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 font-extrabold shrink-0">
                Claim
              </Button>
            </CardContent>
          </Card>
        )}

        <h2 className="font-bold mb-3 flex items-center gap-2"><Flame className="w-4 h-4 text-orange-400" /> Level milestones</h2>
        <div className="space-y-2.5">
          {milestones.map((m, i) => (
            <motion.div key={m.level} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}>
              <Card className={`border-white/10 ${m.reached ? 'bg-emerald-400/[0.05] border-emerald-400/25' : 'bg-white/[0.02] opacity-60'}`}>
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className={`grid place-items-center w-10 h-10 rounded-xl font-extrabold ${m.reached ? 'bg-emerald-400/20 text-emerald-300' : 'bg-white/5 text-slate-500'}`}>
                      {m.reached ? <Check className="w-5 h-5" /> : m.level}
                    </span>
                    <div>
                      <p className="font-semibold text-sm">Reach level {m.level}</p>
                      <p className="text-xs text-slate-500">Reward: {formatCredits(m.reward)} credits</p>
                    </div>
                  </div>
                  {m.reached && (
                    <Button size="sm" variant="outline" onClick={() => claimMilestone(m)} className="border-emerald-400/30 text-emerald-300">
                      Claim
                    </Button>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
