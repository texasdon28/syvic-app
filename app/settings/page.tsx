import { Container } from '@/components/container';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { createBillingPortalSession } from '@/lib/billing/actions';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default async function SettingsPage({ searchParams }: { searchParams?: { billing?: string } }) {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: memberships } = user ? await supabase.from('organization_members')
    .select('organization_id, role').eq('user_id', user.id) : { data: null };
  const membership = memberships?.length === 1 ? memberships[0] : null;
  const { data: subscription } = membership ? await supabase.from('subscription_status')
    .select('plan, status, current_period_end').eq('organization_id', membership.organization_id).maybeSingle() : { data: null };
  return (
    <main className="flex-1">
      <section className="border-b border-gray-200 py-12">
        <Container>
          <h1 className="text-4xl font-bold">Settings</h1>
          <p className="mt-2 text-gray-600">
            Manage your account and organization settings
          </p>
        </Container>
      </section>

      <section className="py-12">
        <Container>
          <div className="max-w-2xl">
            <h2 className="text-xl font-semibold">Billing</h2>
            <p className="mt-3 text-sm">Plan: {subscription?.plan || 'free'} | Status: {subscription?.status || 'No subscription'}</p>
            {searchParams?.billing === 'processing' && <p className="mt-3 text-sm" role="status">Checkout returned. Your plan updates after payment confirmation. Refresh to check its status.</p>}
            {searchParams?.billing === 'existing' && <p className="mt-3 text-sm">A subscription already exists. Manage it below instead of starting another.</p>}
            {searchParams?.billing === 'unavailable' && <p className="mt-3 text-sm" role="alert">Billing management is temporarily unavailable. Please try again later.</p>}
            {membership?.role === 'owner' ? <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild variant="outline"><Link href="/pricing">View plans</Link></Button>
              <form action={createBillingPortalSession}><Button type="submit">Manage billing</Button></form>
            </div> : <p className="mt-4 text-sm text-gray-600">Contact your workspace owner to manage billing.</p>}
          </div>
        </Container>
      </section>
    </main>
  );
}
