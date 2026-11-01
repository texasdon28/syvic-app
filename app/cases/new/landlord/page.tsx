import { Container } from '@/components/container';
import { availableDocument } from '@/lib/documents/catalog';
import { LandlordIntake } from './landlord-intake';
export default function LandlordIntakePage({ searchParams }: { searchParams?: { document?: string } }) {
  const selected = availableDocument(searchParams?.document || '');
  return <main className="flex-1 py-8"><Container>
    <h1 className="text-3xl font-bold">Landlord intake</h1>
    <p className="mt-2 text-sm text-gray-600">Harris County residential records{selected ? ` / ${selected.name}` : ''}</p>
    <LandlordIntake sourceDocument={selected?.id || ''} />
  </Container></main>;
}
