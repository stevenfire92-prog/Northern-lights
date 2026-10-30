import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, Dices, Coins, Trophy, ShieldCheck, ArrowRight, Check, Gift } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import MusicSection from '../components/MusicSection';
import ShareButtons from '../components/ShareButtons';

const GAMES = [
  { icon: '🎰', name: 'Aurora Slots', desc: 'Spin the reels under the northern lights.' },
  { icon: '🂡', name: 'Blackjack', desc: 'Beat the dealer to 21.' },
  { icon: '🎡', name: 'Roulette', desc: 'Red, black, lucky numbers.' },
];

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.55 },
};

export default function Landing() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 overflow-hidden">
      <header className="fixed top-0 inset-x-0 z-50 border-b border-white/10 bg-slate-950/80 backdrop-blur">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="grid place-items-center w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 via-cyan-400 to-violet-500 shadow-lg shadow-emerald-500/25">
              <Sparkles className="w-5 h-5 text-slate-950" />
            </span>
            <span className="font-bold text-lg tracking-tight">Northern Lights Casino</span>
          </div>
          <Button onClick={() => navigate('/lobby')} className="bg-gradient-to-r from-emerald-400 to-cyan-500 text-slate-950 font-bold">
            Play free <ArrowRight className="w-4 h-4 ml-1.5" />
          </Button>
        </div>
      </header>

      {/* Payments notice */}
      <div className="pt-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="rounded-xl border border-amber-400/30 bg-amber-400/10 px-4 py-3 text-center text-sm text-amber-200">
            We're not accepting cash payments right now — play free with 2,000 credits refreshed daily.
          </div>
        </div>
      </div>

      <section className="relative pt-20 pb-20 px-4">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[800px] h-[380px] rounded-full bg-emerald-500/15 blur-[130px]" />
          <div className="absolute top-32 left-1/4 w-[280px] h-[280px] rounded-full bg-violet-500/15 blur-[100px]" />
          <div className="absolute top-40 right-1/4 w-[280px] h-[280px] rounded-full bg-cyan-500/10 blur-[100px]" />
        </div>
        <div className="relative max-w-4xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3.5 py-1.5 text-xs font-medium text-emerald-300">
              <Gift className="w-3.5 h-3.5" /> 1,000 free credits when you join
            </span>
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mt-6 text-4xl md:text-6xl font-extrabold tracking-tight leading-[1.05]">
            The casino under<br />
            <span className="bg-gradient-to-r from-emerald-300 via-cyan-300 to-violet-300 bg-clip-text text-transparent">the northern lights.</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mt-6 text-lg text-slate-400 max-w-2xl mx-auto">
            Slots, blackjack and roulette — pure entertainment. Win credits, climb levels,
            chase streaks. No real-money gambling, ever.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="mt-8">
            <Button size="lg" onClick={() => navigate('/lobby')} className="bg-gradient-to-r from-emerald-400 to-cyan-500 text-slate-950 font-extrabold text-base px-10 h-13">
              <Dices className="w-5 h-5 mr-2" /> Enter the casino
            </Button>
          </motion.div>
        </div>
      </section>

      <motion.section {...fadeUp} className="px-4 pb-16">
        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-4">
          {GAMES.map((g, i) => (
            <motion.button key={g.name} {...fadeUp} transition={{ delay: i * 0.08 }} onClick={() => navigate('/lobby')} className="text-left">
              <Card className="h-full border-white/10 bg-white/[0.03] hover:border-emerald-400/40 hover:scale-[1.02] transition-all">
                <CardContent className="p-6 text-center">
                  <div className="text-5xl">{g.icon}</div>
                  <h3 className="mt-3 font-bold">{g.name}</h3>
                  <p className="mt-1 text-sm text-slate-500">{g.desc}</p>
                </CardContent>
              </Card>
            </motion.button>
          ))}
        </div>
      </motion.section>

      <section className="px-4 py-14">
        <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-4">
          {[
            { icon: Coins, t: 'Credits, not cash', d: 'Buy credit packs, win more credits. Entertainment only — credits have no cash value.' },
            { icon: Trophy, t: 'Levels & streaks', d: 'Earn XP every win, level up for credit rewards, keep your daily streak alive.' },
            { icon: ShieldCheck, t: 'Skill levels', d: 'Rookie, Player or High Roller — pick your stakes and payout tier.' },
          ].map((f, i) => (
            <motion.div key={f.t} {...fadeUp} transition={{ delay: i * 0.08 }}>
              <Card className="h-full border-white/10 bg-white/[0.03]">
                <CardContent className="p-6">
                  <f.icon className="w-6 h-6 text-emerald-300" />
                  <h3 className="mt-3 font-semibold">{f.t}</h3>
                  <p className="mt-1.5 text-sm text-slate-500">{f.d}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Music + share */}
      <section className="px-4 py-10">
        <div className="max-w-3xl mx-auto grid md:grid-cols-2 gap-4">
          <motion.div {...fadeUp}>
            <MusicSection />
          </motion.div>
          <motion.div {...fadeUp} transition={{ duration: 0.5, delay: 0.1 }}>
            <ShareButtons title="Northern Lights Casino" text="Play slots, blackjack & roulette free at Northern Lights Casino — 1,000 free credits to start!" />
          </motion.div>
        </div>
      </section>

      <section className="px-4 py-16">
        <motion.div {...fadeUp} className="max-w-3xl mx-auto text-center rounded-2xl border border-emerald-400/25 bg-gradient-to-b from-emerald-400/[0.08] to-transparent p-10">
          <h2 className="text-3xl font-bold">Your 1,000 free credits are waiting.</h2>
          <p className="mt-2 text-slate-400 text-sm">No deposit. No catch. Just games.</p>
          <Button size="lg" onClick={() => navigate('/lobby')} className="mt-6 bg-gradient-to-r from-emerald-400 to-cyan-500 text-slate-950 font-extrabold px-10">
            Claim & play <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </motion.div>
      </section>

      <footer className="border-t border-white/10 px-4 py-8">
        <div className="max-w-6xl mx-auto text-center text-xs text-slate-500 space-y-2">
          <p className="font-semibold text-slate-400">Northern Lights Casino — entertainment only.</p>
          <p>Social casino. No real-money gambling. Credits have no cash value and cannot be redeemed, transferred or cashed out. 18+. <a href="/disclaimer" class="underline hover:text-slate-300">Full disclaimer</a></p>
        </div>
      </footer>
    </div>
  );
}
