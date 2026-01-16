import Link from 'next/link';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Container } from '@/components/container';
import { Folder, FileText, Clock, Plus } from 'lucide-react';

export default async function DashboardPage() {
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
    .order('created_at', { ascending: false })
    .limit(5);

  const activeCases = cases?.filter((c) => c.status !== 'closed') || [];

  return (
    <main className="flex-1">
      <section className="border-b border-gray-200 py-12">
        <Container>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold">Dashboard</h1>
              <p className="mt-2 text-gray-600">
                Overview of your cases and recent activity
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
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <Card className="border-gray-200">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    Active Cases
                  </CardTitle>
                  <Folder className="h-4 w-4 text-gray-400" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{activeCases.length}</div>
              </CardContent>
            </Card>

            <Card className="border-gray-200">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    Total Cases
                  </CardTitle>
                  <FileText className="h-4 w-4 text-gray-400" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{cases?.length || 0}</div>
              </CardContent>
            </Card>

            <Card className="border-gray-200">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    Upcoming Deadlines
                  </CardTitle>
                  <Clock className="h-4 w-4 text-gray-400" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">0</div>
              </CardContent>
            </Card>
          </div>

          <Card className="mt-8 border-gray-200">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Recent Cases</CardTitle>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/cases">View all</Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {cases && cases.length > 0 ? (
                <div className="space-y-4">
                  {cases.map((caseItem) => (
                    <Link
                      key={caseItem.id}
                      href={`/cases/${caseItem.id}`}
                      className="block rounded-lg border border-gray-200 p-4 transition-colors hover:bg-gray-50"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold">{caseItem.title}</h3>
                          <p className="mt-1 text-sm text-gray-600">
                            {caseItem.workflow_type.replace('_', ' ').charAt(0).toUpperCase() +
                              caseItem.workflow_type.replace('_', ' ').slice(1)}
                          </p>
                        </div>
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
                      <div className="mt-2 text-xs text-gray-500">
                        Created {new Date(caseItem.created_at).toLocaleDateString()}
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="py-12 text-center">
                  <Folder className="mx-auto h-12 w-12 text-gray-300" />
                  <h3 className="mt-4 text-sm font-semibold">No cases yet</h3>
                  <p className="mt-2 text-sm text-gray-600">
                    Create your first case to get started
                  </p>
                  <Button className="mt-4" asChild>
                    <Link href="/cases/new">
                      <Plus className="mr-2 h-4 w-4" />
                      Create case
                    </Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </Container>
      </section>
    </main>
  );
}
