import Stripe from 'stripe';
export function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error('Stripe is not configured');
  if (key.startsWith('sk_live_')) throw new Error('Live billing is not enabled for launch');
  if (process.env.VERCEL_ENV !== 'production' && !key.startsWith('sk_test_')) {
    throw new Error('Non-production billing requires a Stripe test key');
  }
  return new Stripe(key);
}
