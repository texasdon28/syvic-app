'use server';

import { redirect } from 'next/navigation';
import {
  createServerSupabaseClient,
  createServiceSupabaseClient,
} from '@/lib/supabase/server';
import type { WorkflowType } from '@/lib/types/database';

const workflowTypes: WorkflowType[] = ['eviction', 'small_claims'];

async function getOrCreateOrganization(userId: string, userEmail?: string) {
  const supabase = await createServerSupabaseClient();
  const { data: membership } = await supabase
    .from('organization_members')
    .select('organization_id')
    .eq('user_id', userId)
    .limit(1)
    .maybeSingle();

  if (membership?.organization_id) {
    return membership.organization_id;
  }

  const serviceSupabase = createServiceSupabaseClient();
  const { data: organization, error: orgError } = await serviceSupabase
    .from('organizations')
    .insert({
      name: userEmail ? `${userEmail.split('@')[0]}'s Organization` : 'My Organization',
      type: 'individual_landlord',
    })
    .select('id')
    .single();

  if (orgError || !organization) {
    throw new Error(orgError?.message || 'Could not create organization');
  }

  const { error: memberError } = await serviceSupabase
    .from('organization_members')
    .insert({
      organization_id: organization.id,
      user_id: userId,
      role: 'owner',
    });

  if (memberError) {
    throw new Error(memberError.message);
  }

  await serviceSupabase.from('subscription_status').insert({
    organization_id: organization.id,
    plan: 'free',
    status: 'active',
  });

  return organization.id;
}

export async function createCase(formData: FormData) {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const title = String(formData.get('title') || '').trim();
  const workflowType = String(formData.get('workflow_type') || '') as WorkflowType;
  const description = String(formData.get('description') || '').trim();
  const caseNumber = String(formData.get('case_number') || '').trim();
  const amountClaimed = String(formData.get('amount_claimed') || '').trim();
  const filingDate = String(formData.get('filing_date') || '').trim();
  const hearingDate = String(formData.get('hearing_date') || '').trim();

  if (!title || !workflowTypes.includes(workflowType)) {
    redirect('/cases/new?error=missing-required-fields');
  }

  const organizationId = await getOrCreateOrganization(user.id, user.email);

  const addressLine1 = String(formData.get('address_line1') || '').trim();
  const city = String(formData.get('city') || '').trim();
  const zipCode = String(formData.get('zip_code') || '').trim();
  let propertyId: string | null = null;

  if (addressLine1 && city && zipCode) {
    const { data: property, error: propertyError } = await supabase
      .from('properties')
      .insert({
        organization_id: organizationId,
        address_line1: addressLine1,
        address_line2: String(formData.get('address_line2') || '').trim() || null,
        city,
        state: 'TX',
        zip_code: zipCode,
        property_type: 'single_family',
      })
      .select('id')
      .single();

    if (propertyError) {
      redirect(`/cases/new?error=${encodeURIComponent(propertyError.message)}`);
    }

    propertyId = property.id;
  }

  const firstName = String(formData.get('tenant_first_name') || '').trim();
  const lastName = String(formData.get('tenant_last_name') || '').trim();
  let tenantId: string | null = null;

  if (firstName && lastName) {
    const { data: tenant, error: tenantError } = await supabase
      .from('tenants')
      .insert({
        organization_id: organizationId,
        property_id: propertyId,
        first_name: firstName,
        last_name: lastName,
        email: String(formData.get('tenant_email') || '').trim() || null,
        phone: String(formData.get('tenant_phone') || '').trim() || null,
      })
      .select('id')
      .single();

    if (tenantError) {
      redirect(`/cases/new?error=${encodeURIComponent(tenantError.message)}`);
    }

    tenantId = tenant.id;
  }

  const { error: caseError } = await supabase.from('cases').insert({
    organization_id: organizationId,
    case_number: caseNumber || null,
    workflow_type: workflowType,
    status: 'draft',
    property_id: propertyId,
    tenant_id: tenantId,
    title,
    description: description || null,
    filing_date: filingDate || null,
    hearing_date: hearingDate || null,
    amount_claimed: amountClaimed ? Number(amountClaimed) : null,
    created_by: user.id,
  });

  if (caseError) {
    redirect(`/cases/new?error=${encodeURIComponent(caseError.message)}`);
  }

  redirect('/cases');
}
