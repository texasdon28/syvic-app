import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Container } from '@/components/container';
import { MarketingHeader } from '@/components/marketing-header';
import { MarketingFooter } from '@/components/marketing-footer';
import { Check } from 'lucide-react';

export default function PricingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <MarketingHeader />

      <main className="flex-1">
        <section className="border-b border-gray-200 py-20">
          <Container>
            <div className="mx-auto max-w-2xl text-center">
              <h1 className="text-5xl font-bold">Simple, transparent pricing</h1>
              <p className="mt-6 text-lg text-gray-600">
                Choose the plan that fits your workflow. Upgrade or downgrade anytime.
              </p>
            </div>
          </Container>
        </section>

        <section className="border-b border-gray-200 py-20">
          <Container>
            <div className="grid gap-8 lg:grid-cols-3">
              <Card className="border-gray-200">
                <CardHeader>
                  <CardTitle>Free</CardTitle>
                  <div className="mt-4">
                    <span className="text-5xl font-bold">$0</span>
                    <span className="text-gray-600">/month</span>
                  </div>
                  <p className="mt-4 text-sm text-gray-600">
                    For individual landlords getting started with case organization.
                  </p>
                </CardHeader>
                <CardContent className="space-y-6">
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <Check className="h-5 w-5 flex-shrink-0" />
                      <span className="text-sm">1 active case at a time</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="h-5 w-5 flex-shrink-0" />
                      <span className="text-sm">Basic document uploads</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="h-5 w-5 flex-shrink-0" />
                      <span className="text-sm">3 PDF exports per month</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="h-5 w-5 flex-shrink-0" />
                      <span className="text-sm">Texas deadlines reference</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="h-5 w-5 flex-shrink-0" />
                      <span className="text-sm">500MB storage</span>
                    </li>
                  </ul>
                  <Button className="w-full" variant="outline" asChild>
                    <Link href="/signup">Get started</Link>
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-2 border-black shadow-lg">
                <CardHeader>
                  <div className="inline-block rounded-full bg-black px-3 py-1 text-xs font-semibold text-white">
                    MOST POPULAR
                  </div>
                  <CardTitle className="mt-4">Pro</CardTitle>
                  <div className="mt-4">
                    <span className="text-5xl font-bold">$49</span>
                    <span className="text-gray-600">/month</span>
                  </div>
                  <p className="mt-4 text-sm text-gray-600">
                    For active property managers handling multiple cases.
                  </p>
                </CardHeader>
                <CardContent className="space-y-6">
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <Check className="h-5 w-5 flex-shrink-0" />
                      <span className="text-sm">Unlimited cases</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="h-5 w-5 flex-shrink-0" />
                      <span className="text-sm">Unlimited document uploads</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="h-5 w-5 flex-shrink-0" />
                      <span className="text-sm">Unlimited PDF exports</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="h-5 w-5 flex-shrink-0" />
                      <span className="text-sm">Custom templates</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="h-5 w-5 flex-shrink-0" />
                      <span className="text-sm">Priority support</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="h-5 w-5 flex-shrink-0" />
                      <span className="text-sm">10GB storage</span>
                    </li>
                  </ul>
                  <Button className="w-full" asChild>
                    <Link href="/signup">Get started</Link>
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-gray-200">
                <CardHeader>
                  <CardTitle>Team</CardTitle>
                  <div className="mt-4">
                    <span className="text-5xl font-bold">$149</span>
                    <span className="text-gray-600">/month</span>
                  </div>
                  <p className="mt-4 text-sm text-gray-600">
                    For property management companies with multiple team members.
                  </p>
                </CardHeader>
                <CardContent className="space-y-6">
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <Check className="h-5 w-5 flex-shrink-0" />
                      <span className="text-sm">Everything in Pro</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="h-5 w-5 flex-shrink-0" />
                      <span className="text-sm">Up to 10 team members</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="h-5 w-5 flex-shrink-0" />
                      <span className="text-sm">Role-based access control</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="h-5 w-5 flex-shrink-0" />
                      <span className="text-sm">Admin dashboard</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="h-5 w-5 flex-shrink-0" />
                      <span className="text-sm">Dedicated support</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="h-5 w-5 flex-shrink-0" />
                      <span className="text-sm">50GB storage</span>
                    </li>
                  </ul>
                  <Button className="w-full" variant="outline" asChild>
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
                  <h3 className="text-lg font-semibold">Can I switch plans anytime?</h3>
                  <p className="mt-2 text-gray-600">
                    Yes. You can upgrade or downgrade your plan at any time. Changes take effect immediately, and billing is prorated.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold">What happens if I exceed my plan limits?</h3>
                  <p className="mt-2 text-gray-600">
                    On the Free plan, you'll be prompted to upgrade when you reach case or export limits. Pro and Team plans have no case or export limits.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold">Do you offer annual billing?</h3>
                  <p className="mt-2 text-gray-600">
                    Not yet, but annual billing with a discount will be available soon. Contact us if you're interested.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold">What payment methods do you accept?</h3>
                  <p className="mt-2 text-gray-600">
                    We accept all major credit cards through Stripe. ACH and wire transfers are available for Team plans upon request.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold">Is there a refund policy?</h3>
                  <p className="mt-2 text-gray-600">
                    Yes. If you're not satisfied within the first 14 days, contact us for a full refund. No questions asked.
                  </p>
                </div>
              </div>
            </div>
          </Container>
        </section>
      </main>

      <MarketingFooter />
    </div>
  );
}
