'use server';

import Stripe from 'stripe';
import { redirect } from 'next/navigation';
import {
  createServerSupabaseClient,
  createServiceSupabaseClient,
} from '@/lib/supabase/server';

type PaidPlan = 'pro' | 'team';

const priceEnvByPlan: Record<PaidPlan, string> = {
  pro: 'STRIPE_PRICE_ID_PRO',
  team: 'STRIPE_PRICE_ID_TEAM',
};

function getStripe() {
  const secretKey = process.env.STRIPE_SECRET_KEY;

  if (!secretKey) {
    throw new Error('Missing STRIPE_SECRET_KEY');
  }

  return new Stripe(secretKey);
}

export async function createCheckoutSession(formData: FormData) {
  const plan = String(formData.get('plan')) as PaidPlan;

  if (plan !== 'pro' && plan !== 'team') {
    redirect('/pricing?error=invalid-plan');
  }

  const priceId = process.env[priceEnvByPlan[plan]];

  if (!priceId) {
    redirect('/pricing?error=missing-price-id');
  }

  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/signup?plan=${plan}`);
  }

  const { data: membership } = await supabase
    .from('organization_members')
    .select('organization_id')
    .eq('user_id', user.id)
    .limit(1)
    .single();

  if (!membership?.organization_id) {
    redirect('/dashboard');
  }

  const serviceSupabase = createServiceSupabaseClient();
  const { data: organization } = await serviceSupabase
    .from('organizations')
    .select('id, name, stripe_customer_id')
    .eq('id', membership.organization_id)
    .single();

  if (!organization) {
    redirect('/pricing?error=missing-organization');
  }

  const stripe = getStripe();
  let customerId = organization.stripe_customer_id;

  if (!customerId) {
    const customer = await stripe.customers.create({
      email: user.email,
      name: organization.name,
      metadata: {
        organization_id: organization.id,
      },
    });

    customerId = customer.id;

    await serviceSupabase
      .from('organizations')
      .update({ stripe_customer_id: customerId })
      .eq('id', organization.id);
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    customer: customerId,
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    success_url: `${appUrl}/dashboard?checkout=success`,
    cancel_url: `${appUrl}/pricing?checkout=cancelled`,
    metadata: {
      organization_id: organization.id,
      plan,
    },
    subscription_data: {
      metadata: {
        organization_id: organization.id,
        plan,
      },
    },
  });

  if (!session.url) {
    redirect('/pricing?error=checkout-url');
  }

  redirect(session.url);
}
