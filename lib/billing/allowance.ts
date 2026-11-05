import { createServerSupabaseClient } from '@/lib/supabase/server';

export type Allowance = {
  allowed: boolean; reused: boolean; limit: number; used: number;
  remaining: number; resetsAt: string | null; reason: 'inactive' | 'limit' | 'changed';
};

export async function getAllowance(organizationId: string) {
  const db = await createServerSupabaseClient();
  const { data, error } = await db.rpc('document_allowance', { p_organization_id: organizationId });
  if (error || !data) return null;
  return data as Allowance;
}
