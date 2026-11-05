import type Stripe from 'stripe';

export async function requireWorkspaceCustomer(stripe: Stripe, customerId: string, organizationId: string) {
  const customer = await stripe.customers.retrieve(customerId);
  if (customer.deleted || customer.metadata.organization_id !== organizationId) {
    throw new Error('Billing customer unavailable for this workspace');
  }
}
