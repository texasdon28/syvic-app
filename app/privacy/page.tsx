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
              <p className="mt-6 text-sm text-gray-600">Last updated: January 2024</p>
            </div>
          </Container>
        </section>

        <section className="py-20">
          <Container>
            <div className="mx-auto max-w-3xl space-y-8 text-gray-600">
              <div>
                <h2 className="text-2xl font-semibold text-black">1. Information We Collect</h2>
                <p className="mt-4">
                  We collect information you provide directly, including account information, case data, and uploaded documents. We also collect usage data and analytics to improve the service.
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
                  We implement industry-standard security measures to protect your data. All data is encrypted in transit and at rest. We use secure, SOC 2 compliant infrastructure.
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
                  We use third-party services for payment processing (Stripe), hosting (Vercel/Supabase), and analytics. These services have their own privacy policies.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-semibold text-black">6. Your Rights</h2>
                <p className="mt-4">
                  You have the right to access, correct, or delete your personal information. You may export your data or close your account at any time.
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
