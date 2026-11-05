import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Container } from '@/components/container';
import { MarketingHeader } from '@/components/marketing-header';
import { MarketingFooter } from '@/components/marketing-footer';

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <MarketingHeader />

      <main className="flex-1">
        <section className="border-b border-gray-200 py-20">
          <Container>
            <div className="mx-auto max-w-3xl">
              <h1 className="text-5xl font-bold">About SYVIC</h1>
              <p className="mt-6 text-lg text-gray-600">
                We built SYVIC to bring procedural clarity and operational efficiency to Texas Justice Court workflows.
              </p>
            </div>
          </Container>
        </section>

        <section className="border-b border-gray-200 py-20">
          <Container>
            <div className="mx-auto max-w-3xl space-y-8 text-gray-600">
              <div>
                <h2 className="text-2xl font-semibold text-black">Our Mission</h2>
                <p className="mt-4">
                  Justice Court proceedings require precision, organization, and attention to procedural deadlines. SYVIC helps landlords and property managers navigate these requirements without providing legal advice.
                </p>
                <p className="mt-4">
                  We focus on three core principles: procedural clarity, document organization, and accessibility.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-semibold text-black">What We Do</h2>
                <p className="mt-4">
                  SYVIC provides factual record organization, PDF packets, and links to official court resources. Legal notice and petition preparation remain unavailable pending independent template and product-compliance review.
                </p>
                <p className="mt-4">
                  We link to official court resources and provide a general preparation checklist. SYVIC does not calculate deadlines or determine whether a customer may file.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-semibold text-black">What We Don't Do</h2>
                <p className="mt-4">
                  SYVIC does not provide legal advice. We do not interpret laws, represent clients, or guarantee outcomes. We are a procedural information and document organization tool—nothing more, nothing less.
                </p>
                <p className="mt-4">
                  Users should always consult with licensed attorneys for legal advice specific to their situation.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-semibold text-black">Why Texas Justice Court?</h2>
                <p className="mt-4">
                  Our first guided intake is for Harris County residential landlord records. Existing general and small-claims workspaces can store factual records; legal small-claims preparation and repair/remedy workflows are not part of this release.
                </p>
                <p className="mt-4">
                  Our goal is to help people keep accurate, organized records. We do not promise that a packet is legally sufficient, suitable for filing, or accepted by a court.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-semibold text-black">Our Approach to Compliance</h2>
                <p className="mt-4">
                  SYVIC is not a law firm. We organize user-entered records and link to official resources. We do not select legal strategy, determine filing eligibility, or provide case-specific legal advice.
                </p>
                <p className="mt-4">
                  All procedural information should be verified independently before relying on it for court filings or legal proceedings.
                </p>
              </div>
            </div>
          </Container>
        </section>

        <section className="py-20">
          <Container>
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold">Questions about SYVIC?</h2>
              <p className="mt-4 text-gray-600">
                We're here to help. Reach out with any questions about our platform.
              </p>
              <div className="mt-8">
                <Button size="lg" asChild>
                  <Link href="/contact">Contact us</Link>
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
