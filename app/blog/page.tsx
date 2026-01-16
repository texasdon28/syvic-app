import Link from 'next/link';
import { Container } from '@/components/container';
import { MarketingHeader } from '@/components/marketing-header';
import { MarketingFooter } from '@/components/marketing-footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const posts = [
  {
    title: 'Understanding Texas Eviction Deadlines',
    description: 'A comprehensive guide to notice periods, hearing timelines, and post-judgment waiting periods for Texas forcible detainer cases.',
    slug: 'texas-eviction-deadlines',
    date: '2024-01-15',
  },
  {
    title: 'Organizing Evidence for Repair and Remedy Claims',
    description: 'Best practices for documenting habitability issues, repair requests, and landlord-tenant communications.',
    slug: 'organizing-repair-remedy-evidence',
    date: '2024-01-10',
  },
  {
    title: 'Small Claims in Texas Justice Court: A Procedural Overview',
    description: 'What you need to know about filing, service, and default judgment procedures in Texas small claims cases.',
    slug: 'small-claims-procedural-overview',
    date: '2024-01-05',
  },
];

export default function BlogPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <MarketingHeader />

      <main className="flex-1">
        <section className="border-b border-gray-200 py-20">
          <Container>
            <div className="mx-auto max-w-2xl text-center">
              <h1 className="text-5xl font-bold">Resources</h1>
              <p className="mt-6 text-lg text-gray-600">
                Procedural guides and best practices for Texas Justice Court workflows.
              </p>
            </div>
          </Container>
        </section>

        <section className="py-20">
          <Container size="md">
            <div className="space-y-8">
              {posts.map((post) => (
                <Card key={post.slug} className="border-gray-200">
                  <CardHeader>
                    <CardTitle>
                      <Link href={`/blog/${post.slug}`} className="hover:underline">
                        {post.title}
                      </Link>
                    </CardTitle>
                    <CardDescription>{post.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">
                        {new Date(post.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </span>
                      <Link
                        href={`/blog/${post.slug}`}
                        className="text-sm font-medium hover:underline"
                      >
                        Read more →
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </Container>
        </section>
      </main>

      <MarketingFooter />
    </div>
  );
}
