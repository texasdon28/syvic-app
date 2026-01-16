import { Container } from '@/components/container';
import { MarketingHeader } from '@/components/marketing-header';
import { MarketingFooter } from '@/components/marketing-footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TEXAS_DEADLINES, DISCLAIMER_TEXT, getDeadlinesByWorkflow } from '@/lib/constants/texas-deadlines';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

export default function DeadlinesPage() {
  const evictionDeadlines = getDeadlinesByWorkflow('eviction');
  const repairDeadlines = getDeadlinesByWorkflow('repair_remedy');
  const smallClaimsDeadlines = getDeadlinesByWorkflow('small_claims');

  return (
    <div className="flex min-h-screen flex-col">
      <MarketingHeader />

      <main className="flex-1">
        <section className="border-b border-gray-200 py-20">
          <Container>
            <div className="mx-auto max-w-2xl text-center">
              <h1 className="text-5xl font-bold">Texas Justice Court Deadlines</h1>
              <p className="mt-6 text-lg text-gray-600">
                Procedural deadlines for eviction, repair/remedy, and small claims cases in Texas.
              </p>
            </div>

            <Alert className="mx-auto mt-8 max-w-3xl border-gray-200">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-sm">{DISCLAIMER_TEXT.long}</AlertDescription>
            </Alert>
          </Container>
        </section>

        <section className="py-20">
          <Container>
            <Tabs defaultValue="eviction" className="w-full">
              <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-3">
                <TabsTrigger value="eviction">Eviction</TabsTrigger>
                <TabsTrigger value="repair_remedy">Repair & Remedy</TabsTrigger>
                <TabsTrigger value="small_claims">Small Claims</TabsTrigger>
              </TabsList>

              <TabsContent value="eviction" className="mt-8">
                <div className="mx-auto max-w-4xl space-y-6">
                  {evictionDeadlines.map((deadline) => (
                    <Card key={deadline.id} className="border-gray-200">
                      <CardHeader>
                        <CardTitle>{deadline.title}</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div>
                          <p className="text-sm font-medium">Timeframe</p>
                          <p className="mt-1 text-sm text-gray-600">{deadline.timeframe}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">Description</p>
                          <p className="mt-1 text-sm text-gray-600">{deadline.description}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">Citation</p>
                          <p className="mt-1 text-sm text-gray-500">{deadline.citation_placeholder}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="repair_remedy" className="mt-8">
                <div className="mx-auto max-w-4xl space-y-6">
                  {repairDeadlines.map((deadline) => (
                    <Card key={deadline.id} className="border-gray-200">
                      <CardHeader>
                        <CardTitle>{deadline.title}</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div>
                          <p className="text-sm font-medium">Timeframe</p>
                          <p className="mt-1 text-sm text-gray-600">{deadline.timeframe}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">Description</p>
                          <p className="mt-1 text-sm text-gray-600">{deadline.description}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">Citation</p>
                          <p className="mt-1 text-sm text-gray-500">{deadline.citation_placeholder}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="small_claims" className="mt-8">
                <div className="mx-auto max-w-4xl space-y-6">
                  {smallClaimsDeadlines.map((deadline) => (
                    <Card key={deadline.id} className="border-gray-200">
                      <CardHeader>
                        <CardTitle>{deadline.title}</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div>
                          <p className="text-sm font-medium">Timeframe</p>
                          <p className="mt-1 text-sm text-gray-600">{deadline.timeframe}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">Description</p>
                          <p className="mt-1 text-sm text-gray-600">{deadline.description}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">Citation</p>
                          <p className="mt-1 text-sm text-gray-500">{deadline.citation_placeholder}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </Container>
        </section>
      </main>

      <MarketingFooter />
    </div>
  );
}
