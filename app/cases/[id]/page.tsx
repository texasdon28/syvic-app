import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Calendar, FileText, Home, User } from 'lucide-react';
import { Container } from '@/components/container';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { createServerSupabaseClient } from '@/lib/supabase/server';

function formatWorkflow(value: string) {
  return value
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

export default async function CaseDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = await createServerSupabaseClient();

  const { data: caseItem } = await supabase
    .from('cases')
    .select('*, properties(*), tenants(*)')
    .eq('id', params.id)
    .single();

  if (!caseItem) {
    notFound();
  }

  const property = Array.isArray(caseItem.properties)
    ? caseItem.properties[0]
    : caseItem.properties;
  const tenant = Array.isArray(caseItem.tenants)
    ? caseItem.tenants[0]
    : caseItem.tenants;

  return (
    <main className="flex-1">
      <section className="border-b border-gray-200 py-10">
        <Container>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/cases">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Cases
            </Link>
          </Button>
          <div className="mt-6 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-4xl font-bold">{caseItem.title}</h1>
                <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-800">
                  {caseItem.status}
                </span>
              </div>
              <p className="mt-2 text-gray-600">{formatWorkflow(caseItem.workflow_type)}</p>
            </div>
            <Button asChild>
              <Link href={`/cases/${caseItem.id}/packet`}>
                <FileText className="mr-2 h-4 w-4" />
                Prepare packet
              </Link>
            </Button>
          </div>
        </Container>
      </section>

      <section className="py-10">
        <Container>
          <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
            <div className="space-y-6">
              <Card className="border-gray-200">
                <CardHeader>
                  <CardTitle>Case summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-sm">
                  <div>
                    <div className="font-medium">Description</div>
                    <p className="mt-1 text-gray-600">
                      {caseItem.description || 'No notes have been added yet.'}
                    </p>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-3">
                    <div>
                      <div className="font-medium">Case number</div>
                      <p className="mt-1 text-gray-600">{caseItem.case_number || 'Not entered'}</p>
                    </div>
                    <div>
                      <div className="font-medium">Filing date</div>
                      <p className="mt-1 text-gray-600">{caseItem.filing_date || 'Not entered'}</p>
                    </div>
                    <div>
                      <div className="font-medium">Hearing date</div>
                      <p className="mt-1 text-gray-600">{caseItem.hearing_date || 'Not entered'}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-gray-200">
                <CardHeader>
                  <CardTitle>Packet checklist</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-3 text-sm sm:grid-cols-2">
                    {['Notice or demand letter', 'Lease or agreement', 'Rent ledger or invoice', 'Photos and messages', 'Court forms', 'Service notes'].map((item) => (
                      <div key={item} className="flex items-center gap-3 rounded-md border border-gray-200 p-3">
                        <FileText className="h-4 w-4 text-gray-500" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card className="border-gray-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Home className="h-4 w-4" />
                    Property
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-gray-600">
                  {property ? (
                    <div>
                      <p>{property.address_line1}</p>
                      <p>
                        {property.city}, {property.state} {property.zip_code}
                      </p>
                    </div>
                  ) : (
                    <p>No property added yet.</p>
                  )}
                </CardContent>
              </Card>

              <Card className="border-gray-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Party
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-gray-600">
                  {tenant ? (
                    <div className="space-y-1">
                      <p className="font-medium text-black">
                        {tenant.first_name} {tenant.last_name}
                      </p>
                      {tenant.email && <p>{tenant.email}</p>}
                      {tenant.phone && <p>{tenant.phone}</p>}
                    </div>
                  ) : (
                    <p>No party added yet.</p>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </Container>
      </section>
    </main>
  );
}
