'use server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { packetSchema } from '@/lib/cases/packet';
import { revalidatePath } from 'next/cache';

export async function savePacket(id: string, input: unknown) {
  const parsed = packetSchema.safeParse(input);
  if (!parsed.success) return { error: 'Check dates, descriptions and nonnegative amounts. Maximum 200 rows per section.' };
  const db = await createServerSupabaseClient();
  const { data: { user } } = await db.auth.getUser();
  if (!user) return { error: 'Please log in again.' };
  const { data: item, error } = await db.from('cases').select('metadata').eq('id', id).single();
  if (error || !item) return { error: 'Case unavailable.' };
  const { data: updated, error: saveError } = await db.from('cases').update({ metadata: { ...item.metadata, packet: parsed.data } }).eq('id', id).select('id').single();
  if (saveError || !updated) return { error: 'Could not save. Please try again.' };
  revalidatePath(`/cases/${id}/packet`);
  return { saved: true };
}
