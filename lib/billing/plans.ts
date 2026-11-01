export const plans = {
  essential: { name: 'Essential', monthly: 19, annual: 190, documents: 5 },
  pro: { name: 'Pro', monthly: 49, annual: 490, documents: 20 },
  portfolio: { name: 'Portfolio', monthly: 149, annual: 1490, documents: 75 },
} as const;
export type PaidPlan = keyof typeof plans;
export type BillingInterval = 'monthly' | 'annual';
export function isPaidPlan(value: string): value is PaidPlan {
  return Object.prototype.hasOwnProperty.call(plans, value);
}
export function priceEnvironmentKey(plan: PaidPlan, interval: BillingInterval) {
  return `STRIPE_PRICE_${plan.toUpperCase()}_${interval.toUpperCase()}`;
}
export function planForPrice(priceId: string) {
  for (const plan of Object.keys(plans) as PaidPlan[]) {
    for (const interval of ['monthly', 'annual'] as const) {
      if (process.env[priceEnvironmentKey(plan, interval)] === priceId) return { plan, interval };
    }
  }
  return null;
}
