import Link from 'next/link';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import { Container } from '@/components/container';
import { officialSources, sourceCheckedOn } from '@/lib/documents/catalog';

export default function FilingChecklistPage() {
  const items = [
    ['Confirm the court', 'Confirm the property location, precinct, and court with Harris County before filing.', officialSources.county],
    ['Review pre-suit requirements', 'Have the lease, notice type, delivery record, applicable protections, and timing reviewed. SYVIC does not calculate a filing date.', officialSources.training],
    ['Collect factual records', 'Gather the lease, payment history, communications, notice copies, and delivery records. An evidence index does not attach these files.', officialSources.petition],
    ['Check the current petition', 'Use the county resource to obtain the current form. SYVIC does not complete, sign, swear to, or submit it for you.', officialSources.petition],
    ['Confirm filing and service arrangements', 'Check the current rules and ask the court about accepted filing methods, fees, and service arrangements. Your SYVIC subscription does not pay court fees.', officialSources.rules],
  ] as const;
  return <main className="flex-1 py-8"><Container>
    <Link href="/templates" className="inline-flex items-center gap-2 text-sm underline"><ArrowLeft className="h-4 w-4" />Document catalog</Link>
    <h1 className="mt-6 text-3xl font-bold">Harris County preparation checklist</h1>
    <p className="mt-3 max-w-3xl text-sm text-gray-600">General preparation resources, not a determination that you can file. Review case-specific requirements with a Texas attorney. No deadline or notice period is calculated here.</p>
    <ol className="mt-8 max-w-3xl divide-y border-y">{items.map(([title, body, source], index) => <li key={title} className="py-5">
      <h2 className="font-semibold">{index + 1}. {title}</h2><p className="mt-2 text-sm">{body}</p>
      <a href={source.url} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex items-center gap-2 text-sm text-gray-600 underline">{source.title}<ExternalLink className="h-4 w-4 shrink-0" /></a>
    </li>)}</ol>
    <p className="mt-6 max-w-3xl text-sm text-gray-600">Harris County flags 2026 changes and warns that some website guidance may not be current. Check its main eviction page and the Texas Judicial Branch rules rather than relying on older filing instructions.</p>
    <p className="mt-4 text-xs text-gray-500">Source links checked {sourceCheckedOn}. Checklist not yet attorney-reviewed.</p>
  </Container></main>;
}
