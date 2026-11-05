'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Container } from '@/components/container';
import { MarketingHeader } from '@/components/marketing-header';
import { MarketingFooter } from '@/components/marketing-footer';

export default function ContactPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');
  const [failed, setFailed] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setResult('');
    setFailed(false);

    const form = e.currentTarget;
    const formData = new FormData(form);
    const data = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      company: formData.get('company') as string,
      message: formData.get('message') as string,
    };

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setResult('Your message was received. No response time is guaranteed.');
        form.reset();
      } else {
        throw new Error('Failed to send message');
      }
    } catch (error) {
      setFailed(true);
      setResult('Could not send your message. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <MarketingHeader />

      <main className="flex-1">
        <section className="border-b border-gray-200 py-20">
          <Container>
            <div className="mx-auto max-w-2xl text-center">
              <h1 className="text-5xl font-bold">Contact us</h1>
              <p className="mt-6 text-lg text-gray-600">
                Have questions about SYVIC? We're here to help.
              </p>
            </div>
          </Container>
        </section>

        <section className="py-20">
          <Container size="md">
            <div className="grid gap-12 lg:grid-cols-2">
              <div>
                <h2 className="text-2xl font-semibold">Get in touch</h2>
                <p className="mt-4 text-gray-600">
                  Whether you have questions about features, pricing, or implementation, our team is ready to help.
                </p>

                <div className="mt-8 space-y-6">
                  <div>
                    <h3 className="font-semibold">Support</h3>
                    <p className="mt-2 text-sm text-gray-600">
                      Contact us about technical or account questions. Priority support and guaranteed response times are not included in the preview.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold">Sales</h3>
                    <p className="mt-2 text-sm text-gray-600">
                      Ask about Essential, Pro, or Portfolio. The preview plans differ by monthly document credits, not by legal services or team features.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold">Compliance</h3>
                    <p className="mt-2 text-sm text-gray-600">
                      Ask about our product boundaries or report a source issue. We cannot advise on your legal matter, select a notice, or represent you.
                    </p>
                  </div>
                </div>
              </div>

              <Card className="border-gray-200">
                <CardHeader>
                  <CardTitle>Send us a message</CardTitle>
                  <CardDescription>
                    Product and account inquiries only. Do not send confidential case documents, identification numbers, or requests for legal advice.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {result && <p role={failed ? 'alert' : 'status'} className={`mb-4 border-l-4 p-3 text-sm ${failed ? 'border-red-500 bg-red-50' : 'border-emerald-600 bg-emerald-50'}`}>{result}</p>}
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        name="name"
                        required
                        placeholder="Your name"
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        required
                        placeholder="you@example.com"
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="company">Company (optional)</Label>
                      <Input
                        id="company"
                        name="company"
                        placeholder="Your company"
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="message">Message</Label>
                      <Textarea
                        id="message"
                        name="message"
                        required
                        placeholder="Tell us how we can help..."
                        rows={5}
                        className="mt-1"
                      />
                    </div>

                    <Button type="submit" className="w-full" disabled={loading}>
                      {loading ? 'Sending...' : 'Send message'}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </Container>
        </section>
      </main>

      <MarketingFooter />
    </div>
  );
}
