import { notFound } from 'next/navigation';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { emptyPacket, packetSchema } from '@/lib/cases/packet';
import { PacketEditor } from './packet-editor';

export default async function PacketPage({ params }: { params: { id: string } }) {
  const db = await createServerSupabaseClient();
  const { data } = await db.from('cases').select('id,title,case_number,metadata').eq('id', params.id).single();
  if (!data) notFound();
  const parsed = packetSchema.safeParse(data.metadata?.packet);
  return <PacketEditor id={data.id} title={data.title} caseNumber={data.case_number} initial={parsed.success ? parsed.data : emptyPacket} />;
}
