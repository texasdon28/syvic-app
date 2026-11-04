import { Container } from '@/components/container';
import { MarketingHeader } from '@/components/marketing-header';
import { MarketingFooter } from '@/components/marketing-footer';

export default function TermsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <MarketingHeader />

      <main className="flex-1">
        <section className="border-b border-gray-200 py-20">
          <Container>
            <div className="mx-auto max-w-3xl">
              <h1 className="text-5xl font-bold">Terms of Service</h1>
              <p className="mt-6 text-sm text-gray-600">Last updated: January 2024</p>
            </div>
          </Container>
        </section>

        <section className="py-20">
          <Container>
            <div className="mx-auto max-w-3xl space-y-8 text-gray-600">
              <div>
                <h2 className="text-2xl font-semibold text-black">1. Acceptance of Terms</h2>
                <p className="mt-4">
                  By accessing and using SYVIC, you accept and agree to be bound by these Terms of Service and our Privacy Policy. If you do not agree, do not use the service.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-semibold text-black">2. Description of Service</h2>
                <p className="mt-4">
                  SYVIC provides procedural information and document organization tools for Texas Justice Court workflows. We do not provide legal advice.
                </p>
                <p className="mt-4">
                  All information provided is for informational purposes only. Users are responsible for verifying all procedural requirements with legal counsel and the relevant court.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-semibold text-black">3. No Legal Advice</h2>
                <p className="mt-4">
                  SYVIC is not a law firm and does not provide legal advice or legal representation. Our software, documents, and information are not a substitute for the advice of an attorney.
                </p>
                <p className="mt-4">
                  Use of SYVIC does not create an attorney-client relationship. You should always consult with legal counsel for advice specific to your situation.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-semibold text-black">4. User Accounts</h2>
                <p className="mt-4">
                  You are responsible for maintaining the confidentiality of your account credentials. You agree to accept responsibility for all activities that occur under your account.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-semibold text-black">5. Acceptable Use</h2>
                <p className="mt-4">
                  You agree not to use SYVIC for any unlawful purpose or in any way that violates these Terms. You will not attempt to gain unauthorized access to any part of the service.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-semibold text-black">6. Payment and Billing</h2>
                <p className="mt-4">
                  No payments are collected during the controlled beta, and paid subscriptions are not available for purchase. Planned subscriptions include monthly and annual billing, with monthly document allowances that do not roll over. If paid subscriptions become available, the applicable price and billing interval will be displayed before purchase. No purchase is required to save and review records; new beta accounts do not include PDF or print export credits.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-semibold text-black">7. Limitation of Liability</h2>
                <p className="mt-4">
                  SYVIC is provided "as is" without warranties of any kind. We are not liable for any damages arising from your use of the service, including but not limited to procedural errors, missed deadlines, or case outcomes.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-semibold text-black">8. Changes to Terms</h2>
                <p className="mt-4">
                  We reserve the right to modify these Terms at any time. We will notify users of material changes via email or through the service.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-semibold text-black">9. Contact</h2>
                <p className="mt-4">
                  Questions about these Terms? Contact us through our contact page.
                </p>
              </div>
            </div>
          </Container>
        </section>
      </main>

      <MarketingFooter />
    </div>
  );
}
