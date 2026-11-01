import type { SupabaseClient } from '@supabase/supabase-js';

export class CheckoutBusyError extends Error {}

export async function withCheckoutLock<T>(service: SupabaseClient, organizationId: string, work: () => Promise<T>): Promise<T> {
  const { data: token, error } = await service.rpc('acquire_billing_checkout_lock', { p_organization_id: organizationId });
  if (error) throw new Error('Checkout lock unavailable');
  if (!token) throw new CheckoutBusyError('Checkout already in progress');
  try {
    return await work();
  } finally {
    const released = await service.rpc('release_billing_checkout_lock', { p_organization_id: organizationId, p_token: token });
    if (released.error || !released.data) throw new Error('Checkout lock release failed');
  }
}
