import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Coins, CreditCard, Loader2, Check, History } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import AppShell from '../components/AppShell';
import { getBalance, addCredits, getTransactions, CREDIT_PACKS, formatCredits } from '../credits';

export default function Wallet() {
  const [balance, setBalance] = useState(getBalance());
  const [txs, setTxs] = useState(getTransactions());
  const [buying, setBuying] = useState(null);

  useEffect(() => {
    const update = () => { setBalance(getBalance()); setTxs(getTransactions()); };
    window.addEventListener('nlc:balance', update);
    return () => window.removeEventListener('nlc:balance', update);
  }, []);

  const buy = async (pack) => {
    setBuying(pack.id);
    try {
      // Founder: check URL param or saved flag (inline, no imports)
      try {
        const params = new URLSearchParams(window.location.search);
        if (params.get('founder') === 'sefire2026') {
          localStorage.setItem('sfi:founder', 'true');
          const url = new URL(window.location.href);
          url.searchParams.delete('founder');
          window.history.replaceState({}, '', url.toString());
        }
        if (localStorage.getItem('sfi:founder') === 'true') {
          await wait(600);
          const total = pack.credits + pack.bonus;
          addCredits(total, `Founder: ${pack.label}`);
          toast.success(`+${formatCredits(total)} credits! Founder access`);
          return;
        }
      } catch (e) { /* ignore */ }
      // Create a Stripe checkout session for the credit pack
      const res = await fetch('/api/nlc/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ packId: pack.id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Checkout failed');

      if (data.demo) {
        // Demo mode: simulate a successful purchase
        await wait(1200);
        const total = pack.credits + pack.bonus;
        addCredits(total, `Bought ${pack.label}`);
        toast.success(`+${formatCredits(total)} credits! Good luck 🍀`);
      } else if (data.url) {
        window.location.href = data.url;
      }
    } catch (e) {
      toast.error(e.message);
    } finally {
      setBuying(null);
      setBalance(getBalance());
      setTxs(getTransactions());
    }
  };

  return (
    <AppShell>
      <div className="max-w-3xl mx-auto">
        <Card className="border-emerald-400/25 bg-gradient-to-b from-emerald-400/[0.07] to-white/[0.02] mb-6">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-500 font-semibold">Credit balance</p>
              <p className="text-4xl font-extrabold text-emerald-300 tabular-nums mt-1">{formatCredits(balance)}</p>
            </div>
            <span className="grid place-items-center w-14 h-14 rounded-2xl bg-emerald-400/15 border border-emerald-400/30">
              <Coins className="w-7 h-7 text-emerald-300" />
            </span>
          </CardContent>
        </Card>

        <h2 className="font-bold mb-3">Buy credits</h2>
        <div className="grid sm:grid-cols-2 gap-3">
          {CREDIT_PACKS.map((pack, i) => (
            <motion.div key={pack.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
              <Card className={`border-white/10 bg-white/[0.03] hover:border-emerald-400/40 transition-colors ${pack.id === 'pack_3' ? 'border-emerald-400/30' : ''}`}>
                <CardContent className="p-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-bold">{pack.label}</p>
                      <p className="text-2xl font-extrabold text-emerald-300 tabular-nums mt-1">{formatCredits(pack.credits)}</p>
                      {pack.bonus > 0 && (
                        <Badge className="mt-1.5 bg-amber-400/15 text-amber-300 border-amber-400/30 text-[10px]">
                          +{formatCredits(pack.bonus)} bonus
                        </Badge>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold">${pack.price}</p>
                    </div>
                  </div>
                  <Button
                    onClick={() => buy(pack)}
                    disabled={buying !== null}
                    className="w-full mt-4 bg-gradient-to-r from-emerald-400 to-cyan-500 text-slate-950 font-extrabold"
                  >
                    {buying === pack.id ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <CreditCard className="w-4 h-4 mr-2" />}
                    {buying === pack.id ? 'Processing...' : `Buy for $${pack.price}`}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
        <p className="text-[11px] text-slate-500 mt-3 text-center">Credits are for entertainment only — no cash value, no cash-outs. 18+.</p>

        <Card className="border-white/10 bg-white/[0.02] mt-6">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2"><History className="w-4 h-4" /> Recent activity</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-white/5 max-h-64 overflow-y-auto">
              {txs.slice(0, 15).map((t, i) => (
                <div key={i} className="flex items-center justify-between px-5 py-2.5 text-sm">
                  <span className="text-slate-400 truncate">{t.reason}</span>
                  <span className={`font-bold tabular-nums shrink-0 ml-3 ${t.amount >= 0 ? 'text-emerald-300' : 'text-rose-300'}`}>
                    {t.amount >= 0 ? '+' : ''}{formatCredits(t.amount)}
                  </span>
                </div>
              ))}
              {txs.length === 0 && <p className="px-5 py-6 text-sm text-slate-500 text-center">No activity yet.</p>}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}

function wait(ms) {
  return new Promise((r) => setTimeout(r, ms));
}
