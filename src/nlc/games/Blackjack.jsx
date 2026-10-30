import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Spade } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import GameShell from '../components/GameShell';
import BetControls from '../components/BetControls';
import { getBalance, spendCredits, addCredits, getSkillConfig, addXP, formatCredits } from '../credits';

const SUITS = ['♠', '♥', '♦', '♣'];
const RANKS = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

function newDeck() {
  const deck = [];
  for (const s of SUITS) for (const r of RANKS) deck.push({ rank: r, suit: s });
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
}

function handValue(hand) {
  let v = 0, aces = 0;
  for (const c of hand) {
    if (c.rank === 'A') { aces++; v += 11; }
    else if (['K', 'Q', 'J'].includes(c.rank)) v += 10;
    else v += parseInt(c.rank, 10);
  }
  while (v > 21 && aces > 0) { v -= 10; aces--; }
  return v;
}

function Card({ card, hidden }) {
  const red = card.suit === '♥' || card.suit === '♦';
  if (hidden) {
    return (
      <div className="w-14 h-20 rounded-lg bg-gradient-to-br from-violet-600 to-fuchsia-700 border border-white/20 grid place-items-center">
        <Spade className="w-5 h-5 text-white/50" />
      </div>
    );
  }
  return (
    <motion.div initial={{ rotateY: 90, opacity: 0 }} animate={{ rotateY: 0, opacity: 1 }} className="w-14 h-20 rounded-lg bg-white border border-slate-300 grid place-items-center shadow">
      <div className={`text-center leading-none ${red ? 'text-rose-600' : 'text-slate-900'}`}>
        <div className="text-sm font-extrabold">{card.rank}</div>
        <div className="text-lg">{card.suit}</div>
      </div>
    </motion.div>
  );
}

export default function Blackjack() {
  const [deck, setDeck] = useState([]);
  const [player, setPlayer] = useState([]);
  const [dealer, setDealer] = useState([]);
  const [phase, setPhase] = useState('betting'); // betting | player | dealer | done
  const [bet, setBet] = useState(10);
  const [balance, setBal] = useState(getBalance());
  const [result, setResult] = useState('');
  const skill = getSkillConfig();

  useEffect(() => {
    const update = () => setBal(getBalance());
    window.addEventListener('nlc:balance', update);
    return () => window.removeEventListener('nlc:balance', update);
  }, []);

  useEffect(() => { setBet(skill.minBet); }, [skill.id]);

  const deal = () => {
    if (!spendCredits(bet)) {
      toast.error('Not enough credits — grab a pack in the Wallet.');
      return;
    }
    const d = newDeck();
    setDeck(d);
    setPlayer([d.pop(), d.pop()]);
    setDealer([d.pop(), d.pop()]);
    setPhase('player');
    setResult('');
  };

  const hit = () => {
    const d = [...deck];
    const p = [...player, d.pop()];
    setDeck(d);
    setPlayer(p);
    if (handValue(p) > 21) finish(p, dealer, d);
  };

  const stand = () => {
    let d = [...deck];
    let dl = [...dealer];
    while (handValue(dl) < 17) dl.push(d.pop());
    setDeck(d);
    setDealer(dl);
    finish(player, dl, d);
  };

  const finish = (p, dl, d) => {
    const pv = handValue(p), dv = handValue(dl);
    let win = 0, msg = '';
    if (pv > 21) { msg = 'Bust! Dealer wins.'; }
    else if (dv > 21) { win = bet * 2; msg = 'Dealer busts — you win!'; }
    else if (pv === 21 && p.length === 2) { win = Math.floor(bet * 2.5 * skill.payoutMult); msg = 'BLACKJACK! 🎉'; }
    else if (pv > dv) { win = Math.floor(bet * 2 * skill.payoutMult); msg = 'You win!'; }
    else if (pv === dv) { win = bet; msg = 'Push — bet returned.'; }
    else { msg = 'Dealer wins.'; }

    setPhase('done');
    setResult(msg);
    if (win > 0) {
      addCredits(win, `Blackjack (${msg.split('!')[0]})`);
      addXP(Math.floor(win / 10));
      if (win >= bet * 2) {
        confetti({ particleCount: 120, spread: 70, origin: { y: 0.4 }, colors: ['#4ade80', '#22d3ee', '#fbbf24'] });
      }
      toast.success(`${msg} +${formatCredits(win)}`);
    } else {
      toast.error(msg);
    }
  };

  const pv = handValue(player), dv = handValue(dealer);

  return (
    <GameShell title="Blackjack" back="/lobby" balance={balance}>
      <div className="max-w-lg mx-auto">
        <div className="rounded-3xl border border-emerald-400/20 bg-gradient-to-b from-emerald-950/60 to-slate-950 p-6">
          {/* Dealer */}
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Dealer {phase !== 'player' && phase !== 'betting' ? `· ${dv}` : ''}</p>
          </div>
          <div className="flex gap-2 min-h-[84px]">
            {dealer.map((c, i) => <Card key={i} card={c} hidden={phase === 'player' && i === 1} />)}
            {dealer.length === 0 && <p className="text-slate-600 text-sm">Waiting for deal...</p>}
          </div>

          <div className="my-5 border-t border-white/10" />

          {/* Player */}
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">You · {player.length ? pv : ''}</p>
          </div>
          <div className="flex gap-2 min-h-[84px]">
            {player.map((c, i) => <Card key={i} card={c} />)}
          </div>

          {result && (
            <motion.p initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center mt-4 text-xl font-extrabold text-emerald-300">
              {result}
            </motion.p>
          )}

          <div className="mt-5">
            {phase === 'betting' || phase === 'done' ? (
              <>
                <BetControls bet={bet} setBet={setBet} skill={skill} disabled={false} />
                <Button onClick={deal} className="w-full mt-3 h-13 py-3.5 text-lg font-extrabold bg-gradient-to-r from-emerald-400 to-cyan-500 text-slate-950">
                  DEAL — {formatCredits(bet)}
                </Button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <Button onClick={hit} className="h-13 py-3.5 text-lg font-bold bg-violet-500 hover:bg-violet-400">Hit</Button>
                <Button onClick={stand} variant="outline" className="h-13 py-3.5 text-lg font-bold border-white/20">Stand</Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </GameShell>
  );
}
