import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Container } from '@/components/container';
import { MarketingHeader } from '@/components/marketing-header';
import { MarketingFooter } from '@/components/marketing-footer';
import { FileText, Clock, CheckCircle2, Folder, ArrowRight } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <MarketingHeader />

      <main className="flex-1">
        <section className="border-b border-gray-200 py-20 sm:py-32">
          <Container>
            <div className="mx-auto max-w-3xl text-center">
              <h1 className="text-5xl font-bold tracking-tight sm:text-6xl">
                Court-ready packets. Faster filing. Cleaner outcomes.
              </h1>
              <p className="mt-6 text-lg text-gray-600">
                SYVIC helps landlords and property managers assemble eviction, repair/remedy, and small-claims packets with procedural checklists and export-ready PDFs—without giving legal advice.
              </p>
              <div className="mt-10 flex items-center justify-center gap-4">
                <Button size="lg" asChild>
                  <Link href="/signup">Get started</Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/product">Learn more</Link>
                </Button>
              </div>
            </div>
          </Container>
        </section>

        <section className="border-b border-gray-200 py-20">
          <Container>
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold">Procedural clarity for Texas Justice Court</h2>
              <p className="mt-4 text-gray-600">
                Organize evidence, track deadlines, and generate clean document packets for the three most common Justice Court workflows.
              </p>
            </div>

            <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              <Card className="border-gray-200">
                <CardHeader>
                  <FileText className="h-8 w-8" />
                  <CardTitle className="mt-4">Document Organization</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">
                    Upload, tag, and number exhibits automatically. Keep all evidence organized and court-ready.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-gray-200">
                <CardHeader>
                  <Clock className="h-8 w-8" />
                  <CardTitle className="mt-4">Deadline Tracking</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">
                    Texas-specific procedural deadlines for eviction, repair/remedy, and small claims cases.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-gray-200">
                <CardHeader>
                  <CheckCircle2 className="h-8 w-8" />
                  <CardTitle className="mt-4">Procedural Checklists</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">
                    Step-by-step checklists for each workflow type to ensure nothing is missed.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-gray-200">
                <CardHeader>
                  <Folder className="h-8 w-8" />
                  <CardTitle className="mt-4">PDF Export</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">
                    Generate complete packets with cover pages, table of contents, and numbered exhibits.
                  </p>
                </CardContent>
              </Card>
            </div>
          </Container>
        </section>

        <section className="border-b border-gray-200 py-20">
          <Container>
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold">Workflows we support</h2>
              <p className="mt-4 text-gray-600">
                Purpose-built for the three most common Texas Justice Court proceedings.
              </p>
            </div>

            <div className="mt-16 grid gap-8 lg:grid-cols-3">
              <Card className="border-gray-200">
                <CardHeader>
                  <CardTitle>Eviction (Forcible Detainer)</CardTitle>
                  <CardDescription>
                    Organize notice documentation, ledgers, lease agreements, and communications for eviction proceedings.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• Notice to vacate tracking</li>
                    <li>• Rent ledger organization</li>
                    <li>• Hearing date calculations</li>
                    <li>• Post-judgment deadlines</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-gray-200">
                <CardHeader>
                  <CardTitle>Repair and Remedy</CardTitle>
                  <CardDescription>
                    Document repair requests, communications, and evidence for habitability claims and counterclaims.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• Repair request chronology</li>
                    <li>• Photo evidence organization</li>
                    <li>• Citation service tracking</li>
                    <li>• Appeal window monitoring</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-gray-200">
                <CardHeader>
                  <CardTitle>Small Claims / Debt Claims</CardTitle>
                  <CardDescription>
                    Assemble evidence and documentation for property damage claims and outstanding debt recovery.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• Defendant answer deadlines</li>
                    <li>• Service documentation</li>
                    <li>• Default judgment timing</li>
                    <li>• Post-judgment motions</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </Container>
        </section>

        <section className="border-b border-gray-200 py-20">
          <Container>
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold">Pricing</h2>
              <p className="mt-4 text-gray-600">
                Choose the plan that fits your needs.
              </p>
            </div>

            <div className="mt-16 grid gap-8 lg:grid-cols-3">
              <Card className="border-gray-200">
                <CardHeader>
                  <CardTitle>Free</CardTitle>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">$0</span>
                    <span className="text-gray-600">/month</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 text-sm">
                    <li>• 1 active case</li>
                    <li>• Basic document upload</li>
                    <li>• Limited exports</li>
                    <li>• Texas deadlines reference</li>
                  </ul>
                  <Button className="mt-6 w-full" variant="outline" asChild>
                    <Link href="/signup">Get started</Link>
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-2 border-black">
                <CardHeader>
                  <div className="text-xs font-semibold uppercase tracking-wide">Most Popular</div>
                  <CardTitle>Pro</CardTitle>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">$49</span>
                    <span className="text-gray-600">/month</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 text-sm">
                    <li>• Unlimited cases</li>
                    <li>• Unlimited exports</li>
                    <li>• Custom templates</li>
                    <li>• Priority support</li>
                    <li>• 10GB storage</li>
                  </ul>
                  <Button className="mt-6 w-full" asChild>
                    <Link href="/signup">Get started</Link>
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-gray-200">
                <CardHeader>
                  <CardTitle>Team</CardTitle>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">$149</span>
                    <span className="text-gray-600">/month</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 text-sm">
                    <li>• Everything in Pro</li>
                    <li>• Multi-user organizations</li>
                    <li>• Admin controls</li>
                    <li>• 50GB storage</li>
                    <li>• Dedicated support</li>
                  </ul>
                  <Button className="mt-6 w-full" variant="outline" asChild>
                    <Link href="/signup">Get started</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </Container>
        </section>

        <section className="border-b border-gray-200 py-20">
          <Container>
            <div className="mx-auto max-w-3xl">
              <h2 className="text-center text-3xl font-bold">Frequently asked questions</h2>

              <div className="mt-12 space-y-8">
                <div>
                  <h3 className="text-lg font-semibold">Does SYVIC provide legal advice?</h3>
                  <p className="mt-2 text-gray-600">
                    No. SYVIC provides procedural information and document organization tools only. We do not provide legal advice, and all information should be verified with legal counsel.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold">What courts does SYVIC support?</h3>
                  <p className="mt-2 text-gray-600">
                    SYVIC is specifically designed for Texas Justice Courts and the three most common proceedings: eviction, repair and remedy, and small claims.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold">Can I try SYVIC before subscribing?</h3>
                  <p className="mt-2 text-gray-600">
                    Yes. Our Free plan allows you to create one active case and explore the platform before upgrading to Pro or Team.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold">How secure is my data?</h3>
                  <p className="mt-2 text-gray-600">
                    All data is encrypted in transit and at rest. We use industry-standard security practices and host on secure, SOC 2 compliant infrastructure.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold">Can I export my documents?</h3>
                  <p className="mt-2 text-gray-600">
                    Yes. You can export complete case packets as PDFs, including cover pages, table of contents, exhibits, and chronologies.
                  </p>
                </div>
              </div>
            </div>
          </Container>
        </section>

        <section className="py-20">
          <Container>
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold">Ready to get started?</h2>
              <p className="mt-4 text-gray-600">
                Start organizing your cases today with our free plan.
              </p>
              <div className="mt-8 flex items-center justify-center gap-4">
                <Button size="lg" asChild>
                  <Link href="/signup">
                    Get started <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </Container>
        </section>
      </main>

      <MarketingFooter />
    </div>
  );
}
