import { Container } from '@/components/container';
import { MarketingHeader } from '@/components/marketing-header';
import { MarketingFooter } from '@/components/marketing-footer';
import { officialSources, sourceCheckedOn } from '@/lib/documents/catalog';
import { ExternalLink } from 'lucide-react';

export default function BlogPage() {
  return <div className="flex min-h-screen flex-col"><MarketingHeader /><main className="flex-1 py-10"><Container>
    <h1 className="text-3xl font-bold">Official resources</h1><p className="mt-4 max-w-3xl text-sm text-gray-600">External resources, not personalized legal advice. SYVIC does not determine which form, deadline, or legal procedure applies to your case.</p>
    <ul className="mt-8 max-w-3xl divide-y border-y">{Object.values(officialSources).map(source => <li key={source.url} className="py-5"><a href={source.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm underline">{source.title}<ExternalLink className="h-4 w-4 shrink-0" /></a></li>)}</ul><p className="mt-6 text-sm text-gray-600">Source links checked {sourceCheckedOn}; this is not attorney approval. Verify current requirements directly with the source and a licensed attorney.</p>
  </Container></main><MarketingFooter /></div>;
}
