'use server';
import { redirect } from 'next/navigation';
import { createServerSupabaseClient, createServiceSupabaseClient } from '@/lib/supabase/server';
import { getAppUrl } from '@/lib/auth/app-url';
import { isPaidPlan, plans, priceEnvironmentKey } from './plans';
import { getStripe } from './stripe';

async function billingOwner() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');
  const { data: memberships, error } = await supabase.from('organization_members')
    .select('organization_id, role').eq('user_id', user.id);
  if (error || !memberships || memberships.length !== 1 || memberships[0].role !== 'owner') {
    redirect('/pricing?error=billing-owner');
  }
  const service = createServiceSupabaseClient();
  const { data: organization } = await service.from('organizations')
    .select('id, name, stripe_customer_id').eq('id', memberships[0].organization_id).single();
  if (!organization) redirect('/pricing?error=organization');
  return { user, organization, service };
}

export async function createCheckoutSession(formData: FormData) {
  const plan = String(formData.get('plan'));
  const interval = String(formData.get('interval'));
  if (!isPaidPlan(plan) || (interval !== 'monthly' && interval !== 'annual')) redirect('/pricing?error=invalid-plan');
  const priceId = process.env[priceEnvironmentKey(plan, interval)];
  if (!priceId || !process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET) {
    redirect('/pricing?error=not-configured');
  }
  const { user, organization, service } = await billingOwner();
  let checkoutUrl: string | null = null;
  let existingSubscription = false;
  try {
    const stripe = getStripe();
    const price = await stripe.prices.retrieve(priceId);
    if (!price.active || price.currency !== 'usd' || price.unit_amount !== plans[plan][interval] * 100
      || price.recurring?.interval !== (interval === 'annual' ? 'year' : 'month')
      || price.recurring.interval_count !== 1) throw new Error('Invalid configured price');
    let customerId = organization.stripe_customer_id as string | null;
    if (!customerId) {
      const customer = await stripe.customers.create({ email: user.email, name: organization.name,
        metadata: { organization_id: organization.id } }, { idempotencyKey: `syvic-customer-${organization.id}` });
      customerId = customer.id;
      const { error } = await service.from('organizations').update({ stripe_customer_id: customerId }).eq('id', organization.id);
      if (error) throw new Error('Could not save billing customer');
    }
    const subscriptions = await stripe.subscriptions.list({ customer: customerId, status: 'all', limit: 100 });
    existingSubscription = subscriptions.has_more || subscriptions.data.some(s => !['canceled', 'incomplete_expired'].includes(s.status));
    if (!existingSubscription) {
      const open = await stripe.checkout.sessions.list({ customer: customerId, status: 'open', limit: 100 });
      if (open.has_more) throw new Error('Too many pending sessions');
      for (const session of open.data) {
        if (session.mode !== 'subscription') continue;
        if (session.metadata?.plan === plan && session.metadata?.interval === interval && session.url) {
          checkoutUrl = session.url;
          break;
        }
        await stripe.checkout.sessions.expire(session.id);
      }
      if (!checkoutUrl) {
        const metadata = { organization_id: organization.id, plan, interval };
        const session = await stripe.checkout.sessions.create({ mode: 'subscription', customer: customerId,
          line_items: [{ price: priceId, quantity: 1 }], metadata, subscription_data: { metadata },
          success_url: `${getAppUrl()}/settings?billing=processing`, cancel_url: `${getAppUrl()}/pricing?checkout=cancelled` },
          { idempotencyKey: `syvic-checkout-${organization.id}-${plan}-${interval}-${Math.floor(Date.now() / 300000)}` });
        checkoutUrl = session.url;
      }
    }
  } catch {
    redirect('/pricing?error=checkout-unavailable');
  }
  if (existingSubscription) redirect('/settings?billing=existing');
  if (!checkoutUrl) redirect('/pricing?error=checkout-unavailable');
  redirect(checkoutUrl);
}

export async function createBillingPortalSession() {
  const { organization } = await billingOwner();
  if (!organization.stripe_customer_id) redirect('/pricing');
  let url: string;
  try {
    const session = await getStripe().billingPortal.sessions.create({ customer: organization.stripe_customer_id,
      return_url: `${getAppUrl()}/settings` });
    url = session.url;
  } catch {
    redirect('/settings?billing=unavailable');
  }
  redirect(url);
}
