import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createServiceSupabaseClient } from '@/lib/supabase/server';

function getStripe() {
  const secretKey = process.env.STRIPE_SECRET_KEY;

  if (!secretKey) {
    throw new Error('Missing STRIPE_SECRET_KEY');
  }

  return new Stripe(secretKey);
}

function normalizeStatus(status: Stripe.Subscription.Status) {
  if (status === 'active' || status === 'trialing' || status === 'past_due') {
    return status;
  }

  return 'canceled';
}

async function upsertSubscription(subscription: Stripe.Subscription) {
  const subscriptionWithPeriod = subscription as Stripe.Subscription & {
    current_period_end?: number;
  };
  const organizationId = subscription.metadata.organization_id;
  const plan = subscription.metadata.plan === 'team' ? 'team' : 'pro';

  if (!organizationId) {
    return;
  }

  const currentPeriodEnd =
    typeof subscriptionWithPeriod.current_period_end === 'number'
      ? new Date(subscriptionWithPeriod.current_period_end * 1000).toISOString()
      : null;

  const serviceSupabase = createServiceSupabaseClient();

  await serviceSupabase.from('subscription_status').upsert(
    {
      organization_id: organizationId,
      plan,
      stripe_subscription_id: subscription.id,
      status: normalizeStatus(subscription.status),
      current_period_end: currentPeriodEnd,
    },
    { onConflict: 'organization_id' }
  );
}

export async function POST(request: Request) {
  const stripe = getStripe();
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    return NextResponse.json({ error: 'Missing webhook secret' }, { status: 500 });
  }

  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json({ error: 'Missing Stripe signature' }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Invalid webhook signature';
    return NextResponse.json({ error: message }, { status: 400 });
  }

  if (
    event.type === 'customer.subscription.created' ||
    event.type === 'customer.subscription.updated' ||
    event.type === 'customer.subscription.deleted'
  ) {
    await upsertSubscription(event.data.object as Stripe.Subscription);
  }

  return NextResponse.json({ received: true });
}
