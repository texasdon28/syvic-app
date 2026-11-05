'use server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { landlordIntakeSchema } from '@/lib/cases/landlord-intake';
import { z } from 'zod';
export async function createLandlordCase(form: FormData) {
  const parsed = landlordIntakeSchema.safeParse(Object.fromEntries(form));
  const requestId = z.string().uuid().safeParse(form.get('request_id'));
  if (!parsed.success || !requestId.success) return { error: 'Check the intake fields. This intake covers Harris County residential records only.' };
  const db = await createServerSupabaseClient();
  const { data: { user } } = await db.auth.getUser();
  if (!user) return { error: 'Please log in again before saving.' };
  const { data, error } = await db.rpc('create_landlord_records_case', { p_intake: parsed.data, p_request_id: requestId.data });
  if (error || !data) return { error: 'Could not save the case. Your entries are still here; please try again.' };
  return { caseId: String(data) };
}
