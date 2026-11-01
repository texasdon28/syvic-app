import Link from 'next/link';
import { AlertCircle, ArrowLeft, FileText } from 'lucide-react';
import { Container } from '@/components/container';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { createCase } from '@/lib/cases/actions';

export default function NewCasePage({
  searchParams,
}: {
  searchParams?: { error?: string };
}) {
  return (
    <main className="flex-1">
      <section className="border-b border-gray-200 py-10">
        <Container>
          <p className="mb-6 text-sm"><Link href="/cases/new/landlord" className="font-medium underline">Start Harris County landlord intake</Link></p>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/cases">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Cases
            </Link>
          </Button>
          <div className="mt-6 flex items-start gap-4">
            <div className="rounded-md bg-black p-3 text-white">
              <FileText className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-4xl font-bold">New case</h1>
              <p className="mt-2 max-w-2xl text-gray-600">
                Save the essential facts for your Harris County case.
              </p>
            </div>
          </div>
        </Container>
      </section>

      <section className="py-10">
        <Container>
          {searchParams?.error && (
            <div className="mb-6 flex max-w-3xl items-start gap-3 rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-800">
              <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
              <span>Could not create this case. {decodeURIComponent(searchParams.error)}</span>
            </div>
          )}

          <form action={createCase} className="max-w-3xl space-y-6">
            <Card className="border-gray-200">
              <CardHeader>
                <CardTitle>Case details</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-5">
                <div>
                  <Label htmlFor="title">Case title</Label>
                  <Input id="title" name="title" required className="mt-1" placeholder="Tenant name or property address" />
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="workflow_type">Workflow</Label>
                    <select
                      id="workflow_type"
                      name="workflow_type"
                      required
                      defaultValue="eviction"
                      className="mt-1 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    >
                      <option value="eviction">Eviction</option>
                      <option value="small_claims">Small claims</option>
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="case_number">Court case number</Label>
                    <Input id="case_number" name="case_number" className="mt-1" placeholder="Optional" />
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Notes</Label>
                  <Textarea id="description" name="description" className="mt-1" placeholder="Briefly describe what needs to be organized for court." />
                </div>

                <div className="grid gap-5 sm:grid-cols-3">
                  <div>
                    <Label htmlFor="amount_claimed">Amount claimed</Label>
                    <Input id="amount_claimed" name="amount_claimed" type="number" min="0" step="0.01" className="mt-1" placeholder="0.00" />
                  </div>
                  <div>
                    <Label htmlFor="filing_date">Filing date</Label>
                    <Input id="filing_date" name="filing_date" type="date" className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="hearing_date">Hearing date</Label>
                    <Input id="hearing_date" name="hearing_date" type="date" className="mt-1" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-gray-200">
              <CardHeader>
                <CardTitle>Property</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-5">
                <div>
                  <Label htmlFor="address_line1">Address</Label>
                  <Input id="address_line1" name="address_line1" className="mt-1" placeholder="Street address" />
                </div>
                <div className="grid gap-5 sm:grid-cols-[1fr_160px]">
                  <div>
                    <Label htmlFor="city">City</Label>
                    <Input id="city" name="city" className="mt-1" placeholder="Texas city" />
                  </div>
                  <div>
                    <Label htmlFor="zip_code">ZIP</Label>
                    <Input id="zip_code" name="zip_code" className="mt-1" placeholder="77002" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-gray-200">
              <CardHeader>
                <CardTitle>Tenant or opposing party</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="tenant_first_name">First name</Label>
                    <Input id="tenant_first_name" name="tenant_first_name" className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="tenant_last_name">Last name</Label>
                    <Input id="tenant_last_name" name="tenant_last_name" className="mt-1" />
                  </div>
                </div>
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="tenant_email">Email</Label>
                    <Input id="tenant_email" name="tenant_email" type="email" className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="tenant_phone">Phone</Label>
                    <Input id="tenant_phone" name="tenant_phone" className="mt-1" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex items-center justify-end gap-3">
              <Button variant="outline" asChild>
                <Link href="/cases">Cancel</Link>
              </Button>
              <Button type="submit">Create case</Button>
            </div>
          </form>
        </Container>
      </section>
    </main>
  );
}
