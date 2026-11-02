import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Container } from '@/components/container';
import { MarketingHeader } from '@/components/marketing-header';
import { MarketingFooter } from '@/components/marketing-footer';
import { FileText, Folder, ListChecks, ExternalLink, ArrowRight } from 'lucide-react';
import { plans, PaidPlan } from '@/lib/billing/plans';
import { LEGAL_DISCLOSURE, INTERNAL_LEGAL_REVIEW_LABEL, INTERNAL_LEGAL_REVIEW_DESCRIPTION } from '@/lib/legal/disclosures';

const features = [
  { title: 'Factual records', icon: FileText, body: 'Enter rent charges and payments, dated events, and exhibit descriptions. Unknown facts remain unknown.' },
  { title: 'Saved case workspace', icon: Folder, body: 'Save and review property, party, lease, and notice facts in the Harris County residential intake.' },
  { title: 'Packet PDF', icon: ListChecks, body: 'Prepare a rent ledger, chronology, and evidence index in one factual PDF. Supporting evidence files are not attached.' },
  { title: 'Official resources', icon: ExternalLink, body: 'Find the county petition and a general preparation checklist. No deadline or filing eligibility is calculated.' },
];
const questions = [
  ['Does SYVIC provide legal advice?', LEGAL_DISCLOSURE],
  ['What is available in the preview?', 'The guided intake covers Harris County residential landlord records. Existing general and small-claims workspaces can organize facts, but legal notices, petitions, and repair/remedy workflows are not available.'],
  ['Can I try it without paying?', 'A free account can save and review records. Preparing a new packet version for PDF download or print requires an active paid subscription. Checkout currently uses test mode; real payments are disabled.'],
  ['What uses a document credit?', 'The first preparation of a saved packet version for download or print uses one credit for the whole packet. Repeat downloads of that version do not use another credit. Annual billing still provides monthly credits, with no rollover.'],
  ['Are my documents ready to file?', 'SYVIC does not certify legal sufficiency or court acceptance. Its current PDF is a factual records packet, not an eviction notice or court petition. Confirm requirements with the court and a licensed Texas attorney.'],
];

export default function HomePage() {
  return <div className="flex min-h-screen flex-col"><MarketingHeader /><main className="flex-1">
    <section className="border-b py-12 sm:py-16"><Container>
      <div className="mx-auto max-w-3xl text-center">
        <h1 className="text-4xl font-bold sm:text-5xl">SYVIC document organization</h1>
        <p className="mt-5 text-lg text-gray-600">Organize Harris County landlord records into factual packets, with links to official court resources.</p>
        <p className="mt-4 text-sm text-gray-600">Preview release. SYVIC is not a law firm and does not provide legal advice or representation. Real payments are disabled.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3"><Button asChild size="lg"><Link href="/signup">Explore the preview<ArrowRight className="ml-2 h-4 w-4" /></Link></Button><Button asChild variant="outline" size="lg"><Link href="/product">View current offering</Link></Button></div>
      </div>
    </Container></section>
    <section className="border-b py-12"><Container>
      <h2 className="text-2xl font-semibold">Available in the preview</h2>
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">{features.map(feature => <Card key={feature.title}><CardHeader><feature.icon className="h-6 w-6" /><CardTitle className="pt-2 text-lg">{feature.title}</CardTitle></CardHeader><CardContent><p className="text-sm text-gray-600">{feature.body}</p></CardContent></Card>)}</div>
    </Container></section>
    <section className="border-b py-12"><Container>
      <h2 className="text-2xl font-semibold">What is not available</h2>
      <div className="mt-5 max-w-3xl space-y-3 text-sm text-gray-600"><p>Notices to pay rent or vacate, notices to vacate, and SYVIC eviction petition preparation: <strong className="font-medium text-amber-800">{INTERNAL_LEGAL_REVIEW_LABEL}</strong>.</p><p>{INTERNAL_LEGAL_REVIEW_DESCRIPTION}</p><p>Automated deadlines, court filing, evidence-file uploads, custom templates, and team collaboration are not included in this release. Small-claims legal preparation and broader coverage are later scope.</p></div>
    </Container></section>
    <section className="border-b py-12"><Container>
      <h2 className="text-2xl font-semibold">Preview plans</h2><p className="mt-3 text-sm text-gray-600">One saved packet version uses one document credit when first prepared for export or print. No unlimited generation or rollover.</p>
      <div className="mt-8 grid gap-6 md:grid-cols-3">{(Object.keys(plans) as PaidPlan[]).map(key => <Card key={key}><CardHeader><CardTitle className="text-xl">{plans[key].name}</CardTitle></CardHeader><CardContent className="space-y-4"><p><strong className="text-3xl">${plans[key].monthly}</strong><span className="text-sm text-gray-600"> / month</span></p><p className="text-sm">${plans[key].annual.toLocaleString('en-US')} / year with annual billing</p><p className="text-sm font-medium">{plans[key].documents} document credits per month</p><Button asChild variant="outline" className="w-full"><Link href="/pricing">View plan details</Link></Button></CardContent></Card>)}</div>
      <p className="mt-5 text-sm text-gray-600">Saving and reviewing records is free. New packet exports require an active paid subscription. Court fees and legal services are not included. Checkout is test-only until launch.</p>
    </Container></section>
    <section className="py-12"><Container><div className="max-w-3xl"><h2 className="text-2xl font-semibold">Questions</h2><div className="mt-6 divide-y border-y">{questions.map(([title, body]) => <details key={title} className="py-5"><summary className="cursor-pointer font-medium">{title}</summary><p className="mt-3 text-sm text-gray-600">{body}</p></details>)}</div></div></Container></section>
  </main><MarketingFooter /></div>;
}
