import { createServerSupabaseClient } from '@/lib/supabase/server';
import { packetSchema } from '@/lib/cases/packet';
import { buildPacketPdf } from '@/lib/cases/packet-pdf';

export const runtime = 'nodejs';
export async function POST(_request: Request, { params }: { params: { id: string } }) {
  if (_request.headers.get('origin') !== new URL(_request.url).origin) {
    return new Response('Invalid request origin.', { status:403 });
  }
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
  const { data: allowance, error: allowanceError } = await db.rpc('document_allowance', {
    p_organization_id: data.organization_id, p_case_id: params.id,
    p_expected_title: data.title, p_expected_packet: data.metadata.packet,
  });
  if (allowanceError || !allowance) return new Response('Document allowance unavailable. Please try again.', { status:503 });
  if (!allowance.allowed) return new Response(allowance.reason === 'changed'
    ? 'This packet changed. Return to the packet and refresh before exporting.'
    : allowance.reason === 'inactive'
      ? 'An active paid subscription is required to generate a new document. Previously generated versions remain available.'
      : 'Your monthly document allowance has been reached. Your allowance resets on the date shown in Settings.',
    { status: allowance.reason === 'changed' ? 409 : 403, headers: { 'Cache-Control':'private, no-store' } });
  return new Response(Buffer.from(pdf), { headers: {
    'Content-Type':'application/pdf',
    'Content-Disposition':'attachment; filename="syvic-case-packet.pdf"',
    'Cache-Control':'private, no-store',
    'X-Content-Type-Options':'nosniff',
  } });
}
