import { Container } from '@/components/container';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText } from 'lucide-react';

export default function TemplatesPage() {
  return (
    <main className="flex-1">
      <section className="border-b border-gray-200 py-12">
        <Container>
          <h1 className="text-4xl font-bold">Templates</h1>
          <p className="mt-2 text-gray-600">
            System and custom templates for document generation
          </p>
        </Container>
      </section>

      <section className="py-12">
        <Container>
          <div className="py-24 text-center">
            <FileText className="mx-auto h-16 w-16 text-gray-300" />
            <h3 className="mt-4 text-lg font-semibold">Templates coming soon</h3>
            <p className="mt-2 text-gray-600">
              Template management and editor will be available in the next update
            </p>
          </div>
        </Container>
      </section>
    </main>
  );
}
