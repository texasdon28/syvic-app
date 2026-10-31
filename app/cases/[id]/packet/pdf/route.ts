import { createServerSupabaseClient } from '@/lib/supabase/server';
import { packetSchema } from '@/lib/cases/packet';
import { buildPacketPdf } from '@/lib/cases/packet-pdf';

export const runtime = 'nodejs';
export async function GET(_request: Request, { params }: { params: { id: string } }) {
  const db = await createServerSupabaseClient();
  const { data: { user } } = await db.auth.getUser();
  if (!user) return new Response('Please log in.', { status:401 });
  const { data: memberships, error: memberError } = await db.from('organization_members')
    .select('organization_id').eq('user_id',user.id);
  const orgIds = memberships?.map(m=>m.organization_id) || [];
  if (memberError || !orgIds.length) return new Response('Case not found.', { status:404 });
  const { data, error } = await db.from('cases').select('title,metadata,organization_id')
    .eq('id',params.id).in('organization_id',orgIds).single();
  if (error || !data || !orgIds.includes(data.organization_id)) return new Response('Case not found.', { status:404 });
  const packet = packetSchema.safeParse(data.metadata?.packet);
  if (!packet.success) return new Response('Save a valid packet before downloading.', { status:422 });
  const pdf = await buildPacketPdf(data.title,packet.data);
  return new Response(Buffer.from(pdf), { headers: {
    'Content-Type':'application/pdf',
    'Content-Disposition':'attachment; filename="syvic-case-packet.pdf"',
    'Cache-Control':'private, no-store',
    'X-Content-Type-Options':'nosniff',
  } });
}
