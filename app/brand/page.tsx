import { Container } from '@/components/container';
import { Logo } from '@/components/logo';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MarketingHeader } from '@/components/marketing-header';
import { MarketingFooter } from '@/components/marketing-footer';

export default function BrandPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <MarketingHeader />

      <main className="flex-1">
        <section className="border-b border-gray-200 py-20">
          <Container>
            <h1 className="text-5xl font-bold">Brand Assets</h1>
            <p className="mt-6 text-lg text-gray-600">
              Logo usage and placement guidelines for SYVIC.
            </p>
          </Container>
        </section>

        <section className="py-20">
          <Container>
            <div className="space-y-12">
              <Card className="border-gray-200">
                <CardHeader>
                  <CardTitle>Full Logo</CardTitle>
                  <CardDescription>
                    Primary logo for headers, landing pages, and marketing materials.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                  <div className="rounded-lg border border-gray-200 bg-white p-12">
                    <Logo variant="full" />
                  </div>
                  <div className="rounded-lg border border-gray-200 bg-gray-50 p-12">
                    <Logo variant="full" />
                  </div>
                  <div className="rounded-lg border border-gray-200 bg-black p-12">
                    <Logo variant="full" className="invert" />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-gray-200">
                <CardHeader>
                  <CardTitle>Logo Mark</CardTitle>
                  <CardDescription>
                    Compact mark for favicons, app icons, and small spaces.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                  <div className="rounded-lg border border-gray-200 bg-white p-12">
                    <Logo variant="mark" />
                  </div>
                  <div className="rounded-lg border border-gray-200 bg-gray-50 p-12">
                    <Logo variant="mark" />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-gray-200">
                <CardHeader>
                  <CardTitle>Usage Guidelines</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-sm text-gray-600">
                  <div>
                    <h3 className="font-semibold text-black">Logo Placement</h3>
                    <p className="mt-2">
                      The full logo should be used in headers, footers, and auth pages. The logo mark is suitable for favicons and app icons.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-black">Clear Space</h3>
                    <p className="mt-2">
                      Maintain adequate clear space around the logo equal to the height of the letter "S" in the wordmark.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-black">Color Usage</h3>
                    <p className="mt-2">
                      The logo should always appear in black on light backgrounds or white on dark backgrounds. Do not use other colors.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-black">File Locations</h3>
                    <p className="mt-2">
                      Logo files are located in <code className="rounded bg-gray-100 px-1 py-0.5">/public/brand/</code>:
                    </p>
                    <ul className="mt-2 list-disc pl-6">
                      <li><code className="rounded bg-gray-100 px-1 py-0.5">syvic-logo.svg</code> - Full logo (120x32px)</li>
                      <li><code className="rounded bg-gray-100 px-1 py-0.5">syvic-mark.svg</code> - Logo mark (32x32px)</li>
                    </ul>
                  </div>
                  <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                    <h3 className="font-semibold text-black">Replacing Placeholder Logos</h3>
                    <p className="mt-2">
                      To replace the placeholder logos with your actual SYVIC brand assets:
                    </p>
                    <ol className="mt-2 list-decimal pl-6 space-y-1">
                      <li>Export your logo as SVG with dimensions 120x32px (full) and 32x32px (mark)</li>
                      <li>Ensure text is converted to paths/outlines</li>
                      <li>Replace the files in <code className="rounded bg-gray-100 px-1 py-0.5">/public/brand/</code></li>
                      <li>Clear your browser cache and rebuild the application</li>
                    </ol>
                  </div>
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
