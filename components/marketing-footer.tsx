import Link from 'next/link';
import { Logo } from './logo';
import { Container } from './container';
import { DISCLAIMER_TEXT } from '@/lib/constants/texas-deadlines';

const footerLinks = {
  product: [
    { name: 'Features', href: '/product' },
    { name: 'Pricing', href: '/pricing' },
    { name: 'Texas Deadlines', href: '/deadlines' },
  ],
  company: [
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
    { name: 'Blog', href: '/blog' },
  ],
  legal: [
    { name: 'Terms of Service', href: '/terms' },
    { name: 'Privacy Policy', href: '/privacy' },
  ],
};

export function MarketingFooter() {
  return (
    <footer className="border-t border-gray-200 bg-white">
      <Container>
        <div className="py-12">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            <div className="col-span-2">
              <Logo variant="full" href="/" />
              <p className="mt-4 text-sm text-gray-600">
                Court-ready packets for Texas Justice Court workflows.
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold">Product</h3>
              <ul className="mt-4 space-y-3">
                {footerLinks.product.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm text-gray-600 hover:text-black"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold">Company</h3>
              <ul className="mt-4 space-y-3">
                {footerLinks.company.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm text-gray-600 hover:text-black"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-12 border-t border-gray-200 pt-8">
            <div className="mb-6 rounded-lg border border-gray-200 bg-gray-50 p-4">
              <p className="text-xs text-gray-600">{DISCLAIMER_TEXT.long}</p>
            </div>

            <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
              <p className="text-sm text-gray-600">
                © {new Date().getFullYear()} SYVIC. All rights reserved.
              </p>
              <div className="flex gap-6">
                {footerLinks.legal.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    className="text-sm text-gray-600 hover:text-black"
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Container>
    </footer>
  );
}
