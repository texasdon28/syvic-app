import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createServiceSupabaseClient } from '@/lib/supabase/server';
import { getStripe } from '@/lib/billing/stripe';
import { planForPrice } from '@/lib/billing/plans';

export async function POST(request: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret || !process.env.STRIPE_SECRET_KEY) return NextResponse.json({ error: 'Billing unavailable' }, { status: 503 });
  const signature = request.headers.get('stripe-signature');
  if (!signature) return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
  let stripe: Stripe;
  let event: Stripe.Event;
  try {
    stripe = getStripe();
    event = stripe.webhooks.constructEvent(await request.text(), signature, secret);
  } catch {
    return NextResponse.json({ error: 'Invalid webhook' }, { status: 400 });
  }
  if (event.livemode !== process.env.STRIPE_SECRET_KEY.startsWith('sk_live_')) {
    return NextResponse.json({ error: 'Mode mismatch' }, { status: 400 });
  }
  if (!['customer.subscription.created', 'customer.subscription.updated', 'customer.subscription.deleted'].includes(event.type)) {
    return NextResponse.json({ received: true });
  }
  try {
    // Retrieve current state so delayed webhook deliveries do not restore stale plans.
    const subscription = await stripe.subscriptions.retrieve((event.data.object as Stripe.Subscription).id);
    const item = subscription.items.data[0];
    const selection = item && planForPrice(item.price.id);
    if (!selection || subscription.items.data.length !== 1 || item.quantity !== 1) throw new Error('Unknown subscription price');
    const customerId = typeof subscription.customer === 'string' ? subscription.customer : subscription.customer.id;
    const service = createServiceSupabaseClient();
    const { data: organization, error: lookupError } = await service.from('organizations')
      .select('id').eq('stripe_customer_id', customerId).single();
    if (lookupError || !organization || subscription.metadata.organization_id !== organization.id) throw new Error('Billing customer mismatch');
    const { data: saved, error: savedError } = await service.from('subscription_status')
      .select('stripe_subscription_id').eq('organization_id', organization.id).maybeSingle();
    if (savedError) throw new Error('Could not read subscription');
    if (saved?.stripe_subscription_id && saved.stripe_subscription_id !== subscription.id) {
      const previous = await stripe.subscriptions.retrieve(saved.stripe_subscription_id);
      if (!['canceled', 'incomplete_expired'].includes(previous.status)
        || ['canceled', 'incomplete_expired'].includes(subscription.status)) {
        return NextResponse.json({ received: true });
      }
    }
    const status = ['active', 'trialing', 'past_due'].includes(subscription.status) ? subscription.status : 'canceled';
    const { error } = await service.from('subscription_status').upsert({ organization_id: organization.id,
      plan: selection.plan, billing_interval: selection.interval, stripe_subscription_id: subscription.id, status,
      current_period_end: item.current_period_end ? new Date(item.current_period_end * 1000).toISOString() : null,
      cancel_at_period_end: subscription.cancel_at_period_end }, { onConflict: 'organization_id' });
    if (error) throw new Error('Subscription storage failed');
  } catch {
    return NextResponse.json({ error: 'Subscription synchronization failed' }, { status: 500 });
  }
  return NextResponse.json({ received: true });
}
