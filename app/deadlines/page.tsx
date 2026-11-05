import { Container } from '@/components/container';
import { MarketingHeader } from '@/components/marketing-header';
import { MarketingFooter } from '@/components/marketing-footer';
import { officialSources } from '@/lib/documents/catalog';
import { ExternalLink } from 'lucide-react';

export default function DeadlinesPage() {
  return <div className="flex min-h-screen flex-col"><MarketingHeader />
    <main className="flex-1 py-10"><Container>
      <h1 className="text-3xl font-bold">Court rules and deadline resources</h1>
      <p className="mt-4 max-w-3xl text-sm">SYVIC does not currently calculate deadlines or determine when you may file. Earlier deadline summaries are withheld pending review against current rules. Confirm dates and case-specific requirements with the court and a licensed Texas attorney.</p>
      <ul className="mt-8 max-w-3xl divide-y border-y">{[officialSources.rules, officialSources.county, officialSources.training].map(source => <li key={source.url} className="py-5"><a href={source.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm underline">{source.title}<ExternalLink className="h-4 w-4 shrink-0" /></a></li>)}</ul>
    </Container></main><MarketingFooter />
  </div>;
}
