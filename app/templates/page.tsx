import Link from 'next/link';
import { ArrowRight, ExternalLink, FileText, LockKeyhole } from 'lucide-react';
import { Container } from '@/components/container';
import { Button } from '@/components/ui/button';
import { documentCatalog, officialSources, sourceCheckedOn } from '@/lib/documents/catalog';

export default function TemplatesPage() {
  return <main className="flex-1">
    <section className="border-b py-8"><Container>
      <h1 className="text-3xl font-bold">Document catalog</h1>
      <p className="mt-2 text-gray-600">Harris County landlord records</p>
      <p className="mt-4 max-w-3xl text-sm">Available records are bundled in one factual packet. One saved packet version uses one document credit, not one credit per section. Notices and petitions awaiting legal review cannot be generated.</p>
    </Container></section>
    <section className="py-8"><Container>
      <ul className="divide-y border-y">{documentCatalog.map(item => <li key={item.id} className="grid gap-3 py-5 md:grid-cols-[1fr_180px_180px] md:items-center">
        <div className="min-w-0"><h2 className="flex items-center gap-2 font-semibold"><FileText className="h-4 w-4 shrink-0" />{item.name}</h2><p className="mt-1 text-sm text-gray-600">{item.description}</p></div>
        <span className={`text-sm ${item.status === 'available' ? 'text-emerald-700' : 'text-amber-800'}`}>{item.status === 'available' ? 'Available in packet' : 'Awaiting legal review'}</span>
        {item.status === 'available' ? <Button asChild variant="outline" className="w-full md:w-auto"><Link href={`/cases/new/landlord?document=${item.id}`}>Start intake<ArrowRight className="ml-2 h-4 w-4" /></Link></Button>
          : <span className="flex items-center gap-2 text-sm text-gray-500"><LockKeyhole className="h-4 w-4" />Generation unavailable</span>}
      </li>)}</ul>
      <div className="mt-8 grid gap-8 md:grid-cols-2">
        <div><h2 className="text-lg font-semibold">Filing resources</h2><Link href="/templates/filing-checklist" className="mt-3 inline-flex items-center gap-2 text-sm underline">Harris County preparation checklist<ArrowRight className="h-4 w-4" /></Link><p className="mt-2 text-sm text-gray-600">External court forms and resources do not use document credits.</p></div>
        <div><h2 className="text-lg font-semibold">Official court forms</h2><a href={officialSources.petition.url} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex items-center gap-2 text-sm underline">County eviction petition<ExternalLink className="h-4 w-4" /></a><p className="mt-2 text-sm text-gray-600">An external form, not a SYVIC-generated or reviewed filing.</p></div>
      </div>
      <p className="mt-8 border-t pt-5 text-sm text-gray-600">Small-claims legal documents are planned for a later release. Existing small-claims workspaces remain available for factual records. Official source links checked {sourceCheckedOn}; this is not legal approval.</p>
    </Container></section>
  </main>;
}
