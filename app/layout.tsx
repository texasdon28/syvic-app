import './globals.css';
import type { Metadata, Viewport } from 'next';
import { LEGAL_DISCLOSURE } from '@/lib/legal/disclosures';
import { ConnectionStatus } from '@/components/connection-status';

export const viewport: Viewport = {
  themeColor: '#ffffff',
  width: 'device-width', initialScale: 1, viewportFit: 'cover',
};

export const metadata: Metadata = {
  manifest: '/manifest.webmanifest',
  applicationName: 'SYVIC',
  icons: { icon: '/app-icon?size=192', apple: '/app-icon?size=180' },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  title: {
    default: 'SYVIC',
    template: '%s | SYVIC',
  },
  description: 'Factual document organization and official court resources. SYVIC is not a law firm and does not provide legal advice.',
  openGraph: {
    title: 'SYVIC',
    description: 'Factual document organization and official court resources. SYVIC is not a law firm and does not provide legal advice.',
    images: [
      {
        url: '/brand/syvic-logo.svg',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    images: [
      {
        url: '/brand/syvic-logo.svg',
      },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ConnectionStatus />
        <aside aria-label="Important legal disclosure" className="border-b border-gray-300 bg-gray-50 print:hidden">
          <p className="mx-auto max-w-7xl px-4 py-3 text-sm leading-6 text-gray-800 sm:px-6 lg:px-8">{LEGAL_DISCLOSURE}</p>
        </aside>
        {children}
      </body>
    </html>
  );
}
