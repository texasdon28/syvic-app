import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Container } from '@/components/container';
import { MarketingHeader } from '@/components/marketing-header';
import { MarketingFooter } from '@/components/marketing-footer';
import { createCheckoutSession } from '@/lib/billing/actions';
import { plans, PaidPlan } from '@/lib/billing/plans';
import { Check } from 'lucide-react';

export default function PricingPage({ searchParams }: {
  searchParams?: { error?: string; checkout?: string; interval?: string };
}) {
  const interval = searchParams?.interval === 'annual' ? 'annual' : 'monthly';
  return <div className="flex min-h-screen flex-col"><MarketingHeader />
    <main className="flex-1"><section className="border-b py-12"><Container>
      <h1 className="text-3xl font-bold">SYVIC plans</h1>
      <p className="mt-3 text-gray-600">Harris County eviction and small claims document preparation.</p>
      <nav aria-label="Billing interval" className="mt-6 inline-flex border-b gap-6">
        {(['monthly', 'annual'] as const).map(value => <Link key={value} href={`/pricing?interval=${value}`}
          aria-current={interval === value ? 'page' : undefined}
          className={`pb-3 text-sm ${interval === value ? 'border-b-2 border-black font-semibold' : 'text-gray-600'}`}>
          {value === 'monthly' ? 'Monthly' : 'Annual - save 2 months'}</Link>)}
      </nav>
    </Container></section><section className="py-12"><Container>
      <p className="mb-6 text-sm text-gray-600">Preview offering. Paid document generation is not yet available for public launch.</p>
      {searchParams?.error && <p role="alert" className="mb-6 border border-red-200 bg-red-50 p-4 text-sm">
        {searchParams.error === 'billing-owner' ? 'Only the workspace owner can manage billing.'
          : searchParams.error === 'checkout-busy' ? 'Another checkout request is being processed for this workspace. Return to your existing checkout or try again shortly. If this continues, contact support.'
          : 'Checkout is not available yet. No payment has been taken.'}</p>}
      {searchParams?.checkout === 'cancelled' && <p className="mb-6 text-sm">Checkout cancelled. No subscription was started.</p>}
      <div className="grid gap-6 md:grid-cols-3">{(Object.keys(plans) as PaidPlan[]).map(key => {
        const plan = plans[key];
        return <article key={key} className="rounded-lg border p-6 flex flex-col">
          <h2 className="text-xl font-semibold">{plan.name}</h2>
          <p className="mt-4"><span className="text-3xl font-bold">${plan[interval].toLocaleString('en-US')}</span>
            <span className="text-sm text-gray-600">/{interval === 'annual' ? 'year' : 'month'}</span></p>
          <ul className="my-6 space-y-3 text-sm">
            <li className="flex gap-2"><Check className="h-4 w-4 shrink-0" />{plan.documents} documents per month</li>
            <li className="flex gap-2"><Check className="h-4 w-4 shrink-0" />Case workspace and PDF downloads</li>
            <li className="flex gap-2"><Check className="h-4 w-4 shrink-0" />{interval === 'annual' ? 'Billed annually; monthly document allowance' : 'Billed monthly'}</li>
          </ul>
          <form action={createCheckoutSession} className="mt-auto">
            <input type="hidden" name="plan" value={key} /><input type="hidden" name="interval" value={interval} />
            <Button className="w-full" type="submit">Choose {plan.name}</Button>
          </form>
        </article>;
      })}</div>
      <p className="mt-8 text-sm text-gray-600">Annual plans do not include unlimited generation. Document allowances renew monthly and do not roll over. Court filing fees are separate. SYVIC is not a law firm.</p>
    </Container></section></main><MarketingFooter /></div>;
}
