import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import GameShell from '../components/GameShell';
import BetControls from '../components/BetControls';
import { getBalance, spendCredits, addCredits, getSkillConfig, addXP, formatCredits } from '../credits';

const REDS = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];

export default function Roulette() {
  const [spinning, setSpinning] = useState(false);
  const [number, setNumber] = useState(null);
  const [balance, setBal] = useState(getBalance());
  const [bet, setBet] = useState(10);
  const [pick, setPick] = useState('red');
  const skill = getSkillConfig();

  useEffect(() => {
    const update = () => setBal(getBalance());
    window.addEventListener('nlc:balance', update);
    return () => window.removeEventListener('nlc:balance', update);
  }, []);

  useEffect(() => { setBet(skill.minBet); }, [skill.id]);

  const isRed = (n) => REDS.includes(n);

  const spin = async () => {
    if (spinning || !spendCredits(bet)) {
      if (getBalance() < bet) toast.error('Not enough credits — grab a pack in the Wallet.');
      return;
    }
    setSpinning(true);
    setNumber(null);

    const tick = setInterval(() => setNumber(Math.floor(Math.random() * 37)), 80);
    await wait(1200 + Math.random() * 800);
    clearInterval(tick);

    const n = Math.floor(Math.random() * 37);
    setNumber(n);
    setSpinning(false);

    let win = 0;
    if (pick === 'red' && isRed(n)) win = bet * 2;
    else if (pick === 'black' && n !== 0 && !isRed(n)) win = bet * 2;
    else if (pick === 'even' && n !== 0 && n % 2 === 0) win = bet * 2;
    else if (pick === 'odd' && n % 2 === 1) win = bet * 2;
    else if (pick === String(n)) win = bet * 36;

    win = Math.floor(win * skill.payoutMult);

    if (win > 0) {
      addCredits(win, `Roulette win (${n})`);
      addXP(Math.floor(win / 10));
      confetti({ particleCount: 120, spread: 70, origin: { y: 0.4 }, colors: ['#4ade80', '#22d3ee', '#fbbf24', '#e879f9'] });
      toast.success(`${n} — you win +${formatCredits(win)}! 🎉`);
    } else {
      toast.error(`${n} — no luck this time.`);
    }
  };

  const color = number === null ? 'slate' : number === 0 ? 'emerald' : isRed(number) ? 'rose' : 'slate';

  return (
    <GameShell title="Roulette" back="/lobby" balance={balance}>
      <div className="max-w-md mx-auto">
        <div className="rounded-3xl border border-emerald-400/20 bg-gradient-to-b from-slate-900 to-slate-950 p-6 text-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={number === null ? 'x' : number}
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className={`mx-auto w-28 h-28 rounded-full grid place-items-center text-4xl font-extrabold border-4 ${
                color === 'rose' ? 'bg-rose-500/20 border-rose-400 text-rose-300'
                : color === 'emerald' ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
                : 'bg-slate-800 border-white/20 text-slate-200'
              } ${spinning ? 'animate-spin' : ''}`}
              style={{ animationDuration: spinning ? '0.4s' : undefined }}
            >
              {number === null ? '?' : number}
            </motion.div>
          </AnimatePresence>

          <p className="mt-3 text-sm text-slate-400">
            {spinning ? 'Ball is rolling...' : number !== null ? (number === 0 ? 'Green zero!' : isRed(number) ? 'Red' : 'Black') : 'Place your bet'}
          </p>

          <div className="grid grid-cols-4 gap-2 mt-5">
            {[
              { id: 'red', label: 'Red', cls: 'bg-rose-500/20 border-rose-400/40 text-rose-300' },
              { id: 'black', label: 'Black', cls: 'bg-slate-800 border-white/20 text-slate-200' },
              { id: 'even', label: 'Even', cls: 'bg-white/5 border-white/15 text-slate-300' },
              { id: 'odd', label: 'Odd', cls: 'bg-white/5 border-white/15 text-slate-300' },
            ].map((o) => (
              <button
                key={o.id}
                onClick={() => setPick(o.id)}
                disabled={spinning}
                className={`rounded-xl border px-2 py-2.5 text-xs font-bold transition-all ${o.cls} ${pick === o.id ? 'ring-2 ring-emerald-400 scale-105' : 'opacity-70'}`}
              >
                {o.label}
                <span className="block text-[10px] font-normal opacity-70">2x</span>
              </button>
            ))}
          </div>

          <BetControls bet={bet} setBet={setBet} skill={skill} disabled={spinning} />

          <Button
            onClick={spin}
            disabled={spinning}
            className="w-full mt-4 h-14 text-lg font-extrabold bg-gradient-to-r from-emerald-400 to-cyan-500 text-slate-950"
          >
            {spinning ? 'Rolling...' : `SPIN — ${formatCredits(bet)}`}
          </Button>
        </div>
      </div>
    </GameShell>
  );
}

function wait(ms) {
  return new Promise((r) => setTimeout(r, ms));
}
