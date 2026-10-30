import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Coins, RotateCw, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import GameShell from '../components/GameShell';
import BetControls from '../components/BetControls';
import { getBalance, spendCredits, addCredits, getSkillConfig, addXP, formatCredits } from '../credits';
import { toast } from 'sonner';

const SYMBOLS = ['🌟', '💎', '🔔', '🍒', '🍋', '⭐', '🃏'];
const PAYOUTS = { '🌟': 50, '💎': 25, '🔔': 15, '🍒': 8, '🍋': 5, '⭐': 3, '🃏': 2 };

function randomReel() {
  return [0, 1, 2].map(() => SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)]);
}

export default function Slots() {
  const [reels, setReels] = useState([randomReel(), randomReel(), randomReel()]);
  const [spinning, setSpinning] = useState(false);
  const [balance, setBal] = useState(getBalance());
  const [bet, setBet] = useState(10);
  const [lastWin, setLastWin] = useState(0);
  const skill = getSkillConfig();

  useEffect(() => {
    const update = () => setBal(getBalance());
    window.addEventListener('nlc:balance', update);
    return () => window.removeEventListener('nlc:balance', update);
  }, []);

  useEffect(() => {
    setBet(skill.minBet);
  }, [skill.id]);

  const spin = async () => {
    if (spinning || !spendCredits(bet)) {
      if (getBalance() < bet) toast.error('Not enough credits — grab a pack in the Wallet.');
      return;
    }
    setSpinning(true);
    setLastWin(0);

    // Animate reels
    const tick = setInterval(() => {
      setReels([randomReel(), randomReel(), randomReel()]);
    }, 100);

    await wait(900 + Math.random() * 600);
    clearInterval(tick);

    const final = [randomReel(), randomReel(), randomReel()];
    setReels(final);
    setSpinning(false);

    // Payline = middle row
    const [a, b, c] = [final[0][1], final[1][1], final[2][1]];
    let win = 0;
    if (a === b && b === c) {
      win = Math.floor(bet * PAYOUTS[a] * skill.payoutMult);
    } else if (a === b || b === c || a === c) {
      win = Math.floor(bet * 0.5 * skill.payoutMult);
    }

    if (win > 0) {
      addCredits(win, `Slots win (${a}${b}${c})`);
      addXP(Math.floor(win / 10));
      setLastWin(win);
      if (win >= bet * 10) {
        confetti({ particleCount: 150, spread: 75, origin: { y: 0.4 }, colors: ['#4ade80', '#22d3ee', '#fbbf24', '#e879f9'] });
        toast.success(`JACKPOT! +${formatCredits(win)} credits 🎉`);
      } else {
        toast.success(`+${formatCredits(win)} credits!`);
      }
    }
  };

  return (
    <GameShell title="Aurora Slots" back="/lobby" balance={balance}>
      <div className="max-w-md mx-auto">
        <div className="rounded-3xl border border-emerald-400/20 bg-gradient-to-b from-slate-900 to-slate-950 p-6 shadow-2xl shadow-emerald-500/10">
          <div className="grid grid-cols-3 gap-3">
            {reels.map((reel, ri) => (
              <div key={ri} className="rounded-2xl bg-slate-950 border border-white/10 py-2 overflow-hidden">
                {reel.map((sym, si) => (
                  <motion.div
                    key={`${ri}-${si}`}
                    animate={spinning ? { y: [0, -8, 0] } : {}}
                    transition={{ repeat: spinning ? Infinity : 0, duration: 0.25 }}
                    className={`text-4xl text-center py-1.5 ${si === 1 ? 'bg-emerald-400/10 rounded-lg' : 'opacity-60'}`}
                  >
                    {sym}
                  </motion.div>
                ))}
              </div>
            ))}
          </div>

          {lastWin > 0 && (
            <motion.p initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center mt-4 text-2xl font-extrabold text-emerald-300">
              +{formatCredits(lastWin)}
            </motion.p>
          )}

          <BetControls bet={bet} setBet={setBet} skill={skill} disabled={spinning} />

          <Button
            onClick={spin}
            disabled={spinning}
            className="w-full mt-4 h-14 text-lg font-extrabold bg-gradient-to-r from-emerald-400 to-cyan-500 text-slate-950"
          >
            {spinning ? <RotateCw className="w-5 h-5 animate-spin mr-2" /> : <Zap className="w-5 h-5 mr-2" />}
            {spinning ? 'Spinning...' : `SPIN — ${formatCredits(bet)}`}
          </Button>

          <div className="mt-4 flex items-center justify-center gap-1.5 text-[11px] text-slate-500">
            <Coins className="w-3.5 h-3.5" />
            3 of a kind pays up to 50x · {skill.name} pays {skill.payoutMult}x
          </div>
        </div>
      </div>
    </GameShell>
  );
}

function wait(ms) {
  return new Promise((r) => setTimeout(r, ms));
}
