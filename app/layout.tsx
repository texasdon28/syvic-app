import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  title: {
    default: 'SYVIC',
    template: '%s | SYVIC',
  },
  description: 'Court-ready document packets and procedural checklists for Texas Justice Court workflows.',
  openGraph: {
    title: 'SYVIC',
    description: 'Court-ready document packets and procedural checklists for Texas Justice Court workflows.',
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
      <body>{children}</body>
    </html>
  );
}
