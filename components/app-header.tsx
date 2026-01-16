'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Logo } from './logo';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';
import { LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { logout } from '@/lib/auth/actions';

const navigation = [
  { name: 'Dashboard', href: '/dashboard' },
  { name: 'Cases', href: '/cases' },
  { name: 'Templates', href: '/templates' },
  { name: 'Deadlines', href: '/deadlines' },
  { name: 'Settings', href: '/settings' },
];

export function AppHeader() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Logo variant="full" href="/dashboard" />

          <nav className="hidden items-center gap-6 md:flex">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'text-sm font-medium transition-colors hover:text-gray-600',
                  pathname === item.href || pathname.startsWith(item.href + '/')
                    ? 'text-black'
                    : 'text-gray-500'
                )}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            <form action={logout}>
              <Button variant="ghost" size="sm" type="submit">
                <LogOut className="mr-2 h-4 w-4" />
                Log out
              </Button>
            </form>
          </div>

          <button
            type="button"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="border-t border-gray-200 py-4 md:hidden">
            <nav className="flex flex-col gap-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'text-sm font-medium transition-colors hover:text-gray-600',
                    pathname === item.href || pathname.startsWith(item.href + '/')
                      ? 'text-black'
                      : 'text-gray-500'
                  )}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <form action={logout} className="pt-4">
                <Button variant="ghost" size="sm" type="submit" className="w-full justify-start">
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </Button>
              </form>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
