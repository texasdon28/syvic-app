import Link from 'next/link';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Container } from '@/components/container';
import { Plus, Folder } from 'lucide-react';

export default async function CasesPage() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: orgMemberships } = await supabase
    .from('organization_members')
    .select('organization_id')
    .eq('user_id', user!.id);

  const orgIds = orgMemberships?.map((m) => m.organization_id) || [];

  const { data: cases } = await supabase
    .from('cases')
    .select('*')
    .in('organization_id', orgIds)
    .order('created_at', { ascending: false });

  return (
    <main className="flex-1">
      <section className="border-b border-gray-200 py-12">
        <Container>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold">Cases</h1>
              <p className="mt-2 text-gray-600">
                Manage your eviction, repair/remedy, and small claims cases
              </p>
            </div>
            <Button asChild>
              <Link href="/cases/new">
                <Plus className="mr-2 h-4 w-4" />
                New case
              </Link>
            </Button>
          </div>
        </Container>
      </section>

      <section className="py-12">
        <Container>
          {cases && cases.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {cases.map((caseItem) => (
                <Link key={caseItem.id} href={`/cases/${caseItem.id}`}>
                  <Card className="border-gray-200 transition-shadow hover:shadow-md">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-lg">{caseItem.title}</CardTitle>
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            caseItem.status === 'draft'
                              ? 'bg-gray-100 text-gray-800'
                              : caseItem.status === 'closed'
                              ? 'bg-gray-100 text-gray-800'
                              : 'bg-black text-white'
                          }`}
                        >
                          {caseItem.status}
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 text-sm">
                        <div>
                          <span className="font-medium">Type:</span>{' '}
                          <span className="text-gray-600">
                            {caseItem.workflow_type.replace('_', ' ').charAt(0).toUpperCase() +
                              caseItem.workflow_type.replace('_', ' ').slice(1)}
                          </span>
                        </div>
                        {caseItem.case_number && (
                          <div>
                            <span className="font-medium">Case #:</span>{' '}
                            <span className="text-gray-600">{caseItem.case_number}</span>
                          </div>
                        )}
                        <div className="pt-2 text-xs text-gray-500">
                          Created {new Date(caseItem.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <div className="py-24 text-center">
              <Folder className="mx-auto h-16 w-16 text-gray-300" />
              <h3 className="mt-4 text-lg font-semibold">No cases yet</h3>
              <p className="mt-2 text-gray-600">
                Create your first case to start organizing evidence and tracking deadlines
              </p>
              <Button className="mt-6" size="lg" asChild>
                <Link href="/cases/new">
                  <Plus className="mr-2 h-4 w-4" />
                  Create your first case
                </Link>
              </Button>
            </div>
          )}
        </Container>
      </section>
    </main>
  );
}
