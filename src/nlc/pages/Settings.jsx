import { useState, useEffect } from 'react';
import { GraduationCap, Volume2, VolumeX, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import AppShell from '../components/AppShell';
import { getSkill, setSkill, SKILL_LEVELS } from '../credits';
import { cn } from '@/lib/utils';

export default function Settings() {
  const [skill, setSkillState] = useState(getSkill());

  const pick = (id) => {
    setSkill(id);
    setSkillState(id);
    toast.success(`Skill level set to ${SKILL_LEVELS[id].name}.`);
  };

  const reset = () => {
    if (confirm('Reset all credits, progress and settings?')) {
      ['nlc:credits', 'nlc:last_bonus', 'nlc:transactions', 'nlc:level', 'nlc:xp', 'nlc:skill'].forEach((k) => localStorage.removeItem(k));
      toast.success('Fresh start — 1,000 credits waiting for you.');
      setTimeout(() => window.location.reload(), 800);
    }
  };

  return (
    <AppShell>
      <div className="max-w-2xl">
        <div className="mb-6">
          <h1 className="text-xl md:text-2xl font-bold tracking-tight">Settings</h1>
          <p className="text-sm text-slate-500 mt-1">Tune your casino experience.</p>
        </div>

        <Card className="border-white/10 bg-white/[0.03] mb-4">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-emerald-300" /> Skill level
            </CardTitle>
            <CardDescription>Higher levels unlock bigger bets and better payouts.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2.5">
            {Object.values(SKILL_LEVELS).map((s) => (
              <button
                key={s.id}
                onClick={() => pick(s.id)}
                className={cn(
                  'w-full text-left rounded-xl border p-4 transition-all',
                  skill === s.id ? 'border-emerald-400/50 bg-emerald-400/[0.07]' : 'border-white/10 bg-white/[0.02] hover:border-white/25'
                )}
              >
                <div className="flex items-center justify-between">
                  <p className="font-bold">{s.name}</p>
                  <p className="text-xs text-emerald-300 font-bold">{s.payoutMult}x payouts</p>
                </div>
                <p className="text-xs text-slate-500 mt-1">{s.desc} · Bets {s.minBet.toLocaleString()}–{s.maxBet.toLocaleString()}</p>
              </button>
            ))}
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-white/[0.03]">
          <CardHeader>
            <CardTitle className="text-base">Danger zone</CardTitle>
          </CardHeader>
          <CardContent>
            <Button variant="outline" onClick={reset} className="border-rose-400/30 text-rose-300 hover:bg-rose-400/10">
              <RotateCcw className="w-4 h-4 mr-2" /> Reset everything
            </Button>
          </CardContent>
        </Card>

        <p className="text-[11px] text-slate-600 mt-6 text-center">
          Northern Lights Casino is a social casino for entertainment only. Credits have no cash value.
        </p>
      </div>
    </AppShell>
  );
}
