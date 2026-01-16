import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Container } from '@/components/container';
import { MarketingHeader } from '@/components/marketing-header';
import { MarketingFooter } from '@/components/marketing-footer';
import { FileText, Clock, Folder, CheckSquare, Users, Shield } from 'lucide-react';

export default function ProductPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <MarketingHeader />

      <main className="flex-1">
        <section className="border-b border-gray-200 py-20">
          <Container>
            <div className="mx-auto max-w-3xl text-center">
              <h1 className="text-5xl font-bold">Procedural clarity and case packets for Texas Justice Court</h1>
              <p className="mt-6 text-lg text-gray-600">
                SYVIC helps property managers and landlords organize evidence, track deadlines, and generate export-ready document packets for eviction, repair/remedy, and small claims proceedings.
              </p>
              <div className="mt-10">
                <Button size="lg" asChild>
                  <Link href="/signup">Get started</Link>
                </Button>
              </div>
            </div>
          </Container>
        </section>

        <section className="border-b border-gray-200 py-20">
          <Container>
            <h2 className="text-center text-3xl font-bold">Core Features</h2>

            <div className="mt-16 grid gap-12 lg:grid-cols-2">
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <FileText className="h-8 w-8" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold">Document Organization</h3>
                  <p className="mt-2 text-gray-600">
                    Upload evidence files (PDFs, images) with intelligent tagging. Assign exhibit numbers automatically. Keep all case documentation in one place with search and filtering.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <Clock className="h-8 w-8" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold">Texas Deadlines Library</h3>
                  <p className="mt-2 text-gray-600">
                    Access Texas-specific procedural deadlines for all three workflow types. Contextual deadline calculations based on filing dates and case events. Citations included for verification.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <CheckSquare className="h-8 w-8" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold">Procedural Checklists</h3>
                  <p className="mt-2 text-gray-600">
                    Step-by-step checklists customized for each workflow type. Track progress and ensure every procedural requirement is met. Mark items complete as you go.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <Folder className="h-8 w-8" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold">Packet Builder</h3>
                  <p className="mt-2 text-gray-600">
                    Generate complete case packets with cover pages, table of contents, numbered exhibits, and chronology timelines. Export as PDF for filing or printing.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <Users className="h-8 w-8" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold">Team Collaboration</h3>
                  <p className="mt-2 text-gray-600">
                    Multi-user organizations with role-based access control. Share cases across your team. Track who uploaded what and when.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <Shield className="h-8 w-8" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold">Secure & Compliant</h3>
                  <p className="mt-2 text-gray-600">
                    All data encrypted in transit and at rest. SOC 2 compliant infrastructure. Regular backups. No legal advice provided—procedural information only.
                  </p>
                </div>
              </div>
            </div>
          </Container>
        </section>

        <section className="border-b border-gray-200 py-20">
          <Container>
            <h2 className="text-center text-3xl font-bold">Workflows in Detail</h2>

            <div className="mt-16 space-y-16">
              <div>
                <h3 className="text-2xl font-semibold">Eviction (Forcible Detainer)</h3>
                <div className="mt-6 space-y-4 text-gray-600">
                  <p>
                    Organize all documentation for residential and commercial eviction proceedings in Texas Justice Court.
                  </p>
                  <ul className="list-disc space-y-2 pl-6">
                    <li>Notice to vacate documentation and delivery proof</li>
                    <li>Lease agreements and addenda</li>
                    <li>Rent ledgers and payment history</li>
                    <li>Communication logs and correspondence</li>
                    <li>Pre-filing deadline tracking (minimum 3-day notice period)</li>
                    <li>Hearing date calculations (10-21 day window)</li>
                    <li>Post-judgment writ timing (5-day waiting period)</li>
                  </ul>
                </div>
              </div>

              <div>
                <h3 className="text-2xl font-semibold">Repair and Remedy</h3>
                <div className="mt-6 space-y-4 text-gray-600">
                  <p>
                    Document habitability claims, repair requests, and landlord-tenant repair disputes.
                  </p>
                  <ul className="list-disc space-y-2 pl-6">
                    <li>Repair request documentation and timestamps</li>
                    <li>Photo evidence of conditions</li>
                    <li>Communication history with landlord/tenant</li>
                    <li>Contractor estimates and invoices</li>
                    <li>Citation service tracking (6-day minimum before appearance)</li>
                    <li>Return of service deadlines</li>
                    <li>Appeal window monitoring (21 days post-judgment)</li>
                  </ul>
                </div>
              </div>

              <div>
                <h3 className="text-2xl font-semibold">Small Claims / Debt Claims</h3>
                <div className="mt-6 space-y-4 text-gray-600">
                  <p>
                    Assemble evidence for property damage claims, debt recovery, and Justice Court small claims.
                  </p>
                  <ul className="list-disc space-y-2 pl-6">
                    <li>Damage documentation and estimates</li>
                    <li>Invoices and payment records</li>
                    <li>Contracts and agreements</li>
                    <li>Communication records</li>
                    <li>Defendant answer deadline tracking (14 days after service)</li>
                    <li>Service by publication timing (42 days)</li>
                    <li>Default judgment procedures</li>
                    <li>Post-judgment motion deadlines (14 days)</li>
                    <li>Appeal perfection window (21 days)</li>
                  </ul>
                </div>
              </div>
            </div>
          </Container>
        </section>

        <section className="py-20">
          <Container>
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold">Ready to streamline your case management?</h2>
              <p className="mt-4 text-gray-600">
                Start with our free plan and upgrade as you grow.
              </p>
              <div className="mt-8 flex items-center justify-center gap-4">
                <Button size="lg" asChild>
                  <Link href="/signup">Get started</Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/pricing">View pricing</Link>
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
