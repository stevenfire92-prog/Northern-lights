// Northern Lights Casino — credits economy (entertainment only, no cash value).
const BALANCE_KEY = 'nlc:credits';
const LAST_BONUS_KEY = 'nlc:last_bonus';
const TX_KEY = 'nlc:transactions';
const LEVEL_KEY = 'nlc:level';
const SKILL_KEY = 'nlc:skill';

export const SKILL_LEVELS = {
  rookie: { id: 'rookie', name: 'Rookie', minBet: 10, maxBet: 50, payoutMult: 1.0, desc: 'Learn the ropes' },
  player: { id: 'player', name: 'Player', minBet: 50, maxBet: 250, payoutMult: 1.1, desc: 'For regulars' },
  highroller: { id: 'highroller', name: 'High Roller', minBet: 250, maxBet: 1000, payoutMult: 1.25, desc: 'Big bets, big thrills' },
};

export const CREDIT_PACKS = [
  { id: 'pack_1', credits: 5000, price: 4.99, label: 'Starter Stack', bonus: 0 },
  { id: 'pack_2', credits: 12000, price: 9.99, label: 'Lucky Dozen', bonus: 2000 },
  { id: 'pack_3', credits: 30000, price: 19.99, label: 'Aurora Hoard', bonus: 10000 },
  { id: 'pack_4', credits: 100000, price: 49.99, label: 'Northern Fortune', bonus: 50000 },
];

export function getBalance() {
  const v = parseInt(localStorage.getItem(BALANCE_KEY) || '', 10);
  if (isNaN(v)) {
    localStorage.setItem(BALANCE_KEY, '1000');
    addTx('Welcome bonus', 1000);
    return 1000;
  }
  return v;
}

export function setBalance(v) {
  localStorage.setItem(BALANCE_KEY, String(Math.max(0, Math.floor(v))));
  window.dispatchEvent(new Event('nlc:balance'));
}

export function addCredits(amount, reason) {
  setBalance(getBalance() + amount);
  addTx(reason, amount);
}

export function spendCredits(amount) {
  const bal = getBalance();
  if (bal < amount) return false;
  setBalance(bal - amount);
  return true;
}

export function getSkill() {
  return localStorage.getItem(SKILL_KEY) || 'rookie';
}

export function setSkill(id) {
  localStorage.setItem(SKILL_KEY, id);
  window.dispatchEvent(new Event('nlc:skill'));
}

export function getSkillConfig() {
  return SKILL_LEVELS[getSkill()] || SKILL_LEVELS.rookie;
}

export function claimDailyBonus() {
  const today = new Date().toISOString().slice(0, 10);
  if (localStorage.getItem(LAST_BONUS_KEY) === today) return 0;
  localStorage.setItem(LAST_BONUS_KEY, today);
  addCredits(500, 'Daily bonus');
  return 500;
}

export function canClaimBonus() {
  return localStorage.getItem(LAST_BONUS_KEY) !== new Date().toISOString().slice(0, 10);
}

function addTx(reason, amount) {
  try {
    const txs = JSON.parse(localStorage.getItem(TX_KEY) || '[]');
    txs.unshift({ reason, amount, at: Date.now() });
    localStorage.setItem(TX_KEY, JSON.stringify(txs.slice(0, 50)));
  } catch { /* ignore */ }
}

export function getTransactions() {
  try {
    return JSON.parse(localStorage.getItem(TX_KEY) || '[]');
  } catch {
    return [];
  }
}

// XP / levels — the addictive progression layer
export function getLevel() {
  return parseInt(localStorage.getItem(LEVEL_KEY) || '1', 10);
}

export function addXP(amount) {
  const xpKey = 'nlc:xp';
  const xp = parseInt(localStorage.getItem(xpKey) || '0', 10) + amount;
  localStorage.setItem(xpKey, String(xp));
  const newLevel = Math.floor(xp / 1000) + 1;
  const oldLevel = getLevel();
  if (newLevel > oldLevel) {
    localStorage.setItem(LEVEL_KEY, String(newLevel));
    const bonus = newLevel * 250;
    addCredits(bonus, `Level ${newLevel} reward`);
    return { leveledUp: true, level: newLevel, bonus };
  }
  return { leveledUp: false };
}

export function getXP() {
  return parseInt(localStorage.getItem('nlc:xp') || '0', 10);
}

export function formatCredits(n) {
  return Math.floor(n).toLocaleString();
}
