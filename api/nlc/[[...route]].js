// Northern Lights Casino API — single function (Vercel Hobby limit).
// POST /api/nlc/checkout — create a Stripe Checkout session for a credit pack.
// Falls back to demo mode when Stripe isn't configured.
import Stripe from 'stripe';

const PACKS = {
  pack_1: { credits: 5000, price: 4.99, label: 'Starter Stack' },
  pack_2: { credits: 14000, price: 9.99, label: 'Lucky Dozen' },
  pack_3: { credits: 40000, price: 19.99, label: 'Aurora Hoard' },
  pack_4: { credits: 150000, price: 49.99, label: 'Northern Fortune' },
};

function send(res, status, data) {
  res.setHeader('Cache-Control', 'no-store');
  return res.status(status).json(data);
}

export default async function handler(req, res) {
  const url = new URL(req.url, 'http://localhost');
  const parts = url.pathname.split('/').filter(Boolean);
  const route = parts.slice(2).join('/') || 'status';

  if (route === 'status' && req.method === 'GET') {
    return send(res, 200, {
      ok: true,
      stripe: !!process.env.STRIPE_SECRET_KEY,
      mode: process.env.STRIPE_SECRET_KEY ? 'live' : 'demo',
    });
  }

  if (route === 'checkout' && req.method === 'POST') {
    const { packId } = req.body || {};
    const pack = PACKS[packId];
    if (!pack) return send(res, 400, { error: 'invalid_pack' });

    if (!process.env.STRIPE_SECRET_KEY) {
      return send(res, 200, { demo: true, pack });
    }

    try {
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2024-06-20' });
      const origin = req.headers.origin || 'https://northern-lights-casino.vercel.app';
      const session = await stripe.checkout.sessions.create({
        mode: 'payment',
        line_items: [
          {
            price_data: {
              currency: 'usd',
              unit_amount: Math.round(pack.price * 100),
              product_data: {
                name: `${pack.label} — ${pack.credits.toLocaleString()} Casino Credits`,
                description: 'Entertainment credits for Northern Lights Casino. No cash value.',
              },
            },
            quantity: 1,
          },
        ],
        metadata: { packId, credits: String(pack.credits) },
        success_url: `${origin}/wallet?purchase=success&pack=${packId}`,
        cancel_url: `${origin}/wallet?purchase=cancelled`,
      });
      return send(res, 200, { url: session.url });
    } catch (e) {
      return send(res, 500, { error: 'checkout_failed', message: e.message });
    }
  }

  // Stripe webhook for completed credit purchases
  if (route === 'webhook' && req.method === 'POST') {
    return send(res, 200, { received: true });
  }

  return send(res, 404, { error: 'not_found' });
}

export const config = { api: { bodyParser: true } };
