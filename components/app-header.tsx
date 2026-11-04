'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Logo } from './logo';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';
import { LogOut, Menu, X, LayoutDashboard, Folder, FileText, Settings } from 'lucide-react';
import { useEffect, useState } from 'react';
import { logout } from '@/lib/auth/actions';
import { InstallApp } from './install-app';

const mobileNavigation = [
  { name: 'Home', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Cases', href: '/cases', icon: Folder },
  { name: 'Documents', href: '/templates', icon: FileText },
  { name: 'Settings', href: '/settings', icon: Settings },
];

const navigation = [
  { name: 'Dashboard', href: '/dashboard' },
  { name: 'Cases', href: '/cases' },
  { name: 'Documents', href: '/templates' },
  { name: 'Deadlines', href: '/deadlines' },
  { name: 'Settings', href: '/settings' },
];

export function AppHeader() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  useEffect(() => { setMobileMenuOpen(false); }, [pathname]);
  useEffect(() => {
    if (!mobileMenuOpen) return;
    const dismiss = (event: KeyboardEvent) => { if (event.key === 'Escape') setMobileMenuOpen(false); };
    window.addEventListener('keydown', dismiss);
    return () => window.removeEventListener('keydown', dismiss);
  }, [mobileMenuOpen]);

  return (
    <>
    <header className="app-header sticky top-0 z-50 w-full border-b border-gray-200 bg-white print:hidden">
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
            aria-label={mobileMenuOpen ? 'Close navigation' : 'Open navigation'}
            aria-expanded={mobileMenuOpen}
            aria-controls="app-mobile-menu"
            className="flex h-11 w-11 items-center justify-center rounded-md focus-visible:outline focus-visible:outline-2 md:hidden"
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
          <div id="app-mobile-menu" className="max-h-[65dvh] overflow-y-auto border-t border-gray-200 py-4 md:hidden">
            <nav className="flex flex-col gap-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'flex min-h-[44px] items-center text-sm font-medium transition-colors hover:text-gray-600',
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
        <div className={cn('pb-4 md:hidden', !mobileMenuOpen && 'hidden')}><InstallApp /></div>
      </div>
    </header>
    <nav aria-label="Main navigation" className="mobile-tab-bar fixed inset-x-0 bottom-0 z-40 grid grid-cols-4 border-t border-gray-200 bg-white md:hidden print:hidden">
      {mobileNavigation.map(({ name, href, icon: Icon }) => {
        const active = pathname === href || pathname.startsWith(href + '/');
        return <Link key={href} href={href} aria-current={active ? 'page' : undefined}
          className={cn('flex min-h-[64px] min-w-0 flex-col items-center justify-center gap-1 px-1 text-xs font-medium focus-visible:outline focus-visible:outline-2', active ? 'bg-gray-100 text-black' : 'text-gray-600')}>
          <Icon className="h-5 w-5" aria-hidden="true" /><span>{name}</span>
        </Link>;
      })}
    </nav>
    </>
  );
}
