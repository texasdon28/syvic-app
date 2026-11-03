import type { Metadata } from 'next';
import Link from 'next/link';
import { verifyPasswordRecovery } from '@/lib/auth/actions';
import { Logo } from '@/components/logo';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { robots: { index: false, follow: false }, referrer: 'no-referrer' };

export default function RecoveryPage({ searchParams }: { searchParams?: { token_hash?: string } }) {
  const tokenHash = searchParams?.token_hash || '';
  const valid = /^(?:pkce_)?[a-f0-9]{40,128}$/i.test(tokenHash);
  return <main className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 py-8">
    <div className="mb-8"><Logo variant="full" /></div>
    <Card className="w-full max-w-md border-gray-200">
      <CardHeader><CardTitle>Reset your password</CardTitle></CardHeader>
      <CardContent>
        {valid ? <form action={verifyPasswordRecovery} className="space-y-4">
          <input type="hidden" name="token_hash" value={tokenHash} />
          <p className="text-sm text-gray-700">Continue to choose a new password for your SYVIC account.</p>
          <Button type="submit" className="w-full">Continue</Button>
        </form> : <p role="alert" className="text-sm text-red-800">This reset link is invalid. Request a new link below.</p>}
        <Link href="/forgot-password" className="mt-6 block text-center text-sm font-medium hover:underline">Request another reset link</Link>
      </CardContent>
    </Card>
  </main>;
}
