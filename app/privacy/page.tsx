import { Container } from '@/components/container';
import { MarketingHeader } from '@/components/marketing-header';
import { MarketingFooter } from '@/components/marketing-footer';

export default function PrivacyPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <MarketingHeader />

      <main className="flex-1">
        <section className="border-b border-gray-200 py-20">
          <Container>
            <div className="mx-auto max-w-3xl">
              <h1 className="text-5xl font-bold">Privacy Policy</h1>
              <p className="mt-6 text-sm text-gray-600">Preview policy updated: November 1, 2026. Policy review remains pending before public launch.</p>
            </div>
          </Container>
        </section>

        <section className="py-20">
          <Container>
            <div className="mx-auto max-w-3xl space-y-8 text-gray-600">
              <div>
                <h2 className="text-2xl font-semibold text-black">1. Information We Collect</h2>
                <p className="mt-4">
                  The preview stores account details, facts and records you enter, contact messages, billing identifiers, subscription status, and document-generation usage. Evidence indexes contain descriptions, not attached evidence files. Avoid entering identification numbers or unnecessary sensitive information.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-semibold text-black">2. How We Use Your Information</h2>
                <p className="mt-4">
                  We use your information to provide the SYVIC service, process payments, communicate with you, and improve our platform. We do not sell your personal information to third parties.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-semibold text-black">3. Data Security</h2>
                <p className="mt-4">
                  Accounts use sign-in and workspace access controls. No security certification, independent security audit, or guarantee of absolute security is claimed for SYVIC. Provider controls are not certification of this application.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-semibold text-black">4. Data Retention</h2>
                <p className="mt-4">
                  We retain your data for as long as your account is active or as needed to provide services. You may request deletion of your data at any time.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-semibold text-black">5. Third-Party Services</h2>
                <p className="mt-4">
                  SYVIC uses Vercel for hosting, Supabase for authentication and storage of application records, Resend for account confirmation and password-reset emails, and Stripe for test billing. These providers have their own privacy policies. Live payments remain disabled.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-semibold text-black">6. Your Rights</h2>
                <p className="mt-4">
                  Contact us with requests concerning your personal information. Packet PDF downloads are available according to your subscription and prior generated versions; bulk account export and account deletion are not currently self-service features. This does not limit rights available under applicable law.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-semibold text-black">7. Changes to Privacy Policy</h2>
                <p className="mt-4">
                  We may update this Privacy Policy from time to time. We will notify you of material changes via email or through the service.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-semibold text-black">8. Contact</h2>
                <p className="mt-4">
                  Questions about privacy? Contact us through our contact page.
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
