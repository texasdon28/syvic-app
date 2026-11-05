import Link from 'next/link';
import { requestPasswordReset } from '@/lib/auth/actions';
import { Logo } from '@/components/logo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default async function ForgotPasswordPage({ searchParams: pendingSearchParams }: { searchParams?: Promise<{ sent?: string; error?: string }> }) {
  const searchParams = await pendingSearchParams;
  return <main className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 py-8">
    <div className="mb-8"><Logo variant="full" /></div>
    <Card className="w-full max-w-md border-gray-200">
      <CardHeader><CardTitle>Reset your password</CardTitle></CardHeader>
      <CardContent>
        {searchParams?.sent && <p role="status" className="mb-4 text-sm text-gray-700">If an account exists for that address, you will receive a reset email. Check your spam folder too. Use the newest email and select Continue after opening its link. If it does not arrive, wait a minute before trying again.</p>}
        {searchParams?.error && <p role="alert" className="mb-4 text-sm text-red-800">{searchParams.error}</p>}
        <form action={requestPasswordReset} className="space-y-4">
          <div><Label htmlFor="email">Email</Label><Input id="email" name="email" type="email" autoComplete="email" required className="mt-1" /></div>
          <Button type="submit" className="w-full">Send reset link</Button>
        </form>
        <Link href="/login" className="mt-6 block text-center text-sm font-medium hover:underline">Back to login</Link>
      </CardContent>
    </Card>
  </main>;
}
