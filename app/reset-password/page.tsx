import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { updatePassword } from '@/lib/auth/actions';
import { Logo } from '@/components/logo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default async function ResetPasswordPage({ searchParams }: { searchParams?: { error?: string } }) {
  const supabase = await createServerSupabaseClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) redirect('/forgot-password?error=Request%20a%20new%20reset%20link.');
  return <main className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 py-8">
    <div className="mb-8"><Logo variant="full" /></div>
    <Card className="w-full max-w-md border-gray-200">
      <CardHeader><CardTitle>Choose a new password</CardTitle></CardHeader>
      <CardContent>
        {searchParams?.error && <p role="alert" className="mb-4 text-sm text-red-800">{searchParams.error}</p>}
        <form action={updatePassword} className="space-y-4">
          <div><Label htmlFor="password">New password</Label><Input id="password" name="password" type="password" autoComplete="new-password" minLength={8} required className="mt-1" /><p className="mt-1 text-xs text-gray-500">Minimum 8 characters</p></div>
          <div><Label htmlFor="confirmation">Confirm new password</Label><Input id="confirmation" name="confirmation" type="password" autoComplete="new-password" minLength={8} required className="mt-1" /></div>
          <Button type="submit" className="w-full">Update password</Button>
        </form>
        <Link href="/forgot-password" className="mt-6 block text-center text-sm font-medium hover:underline">Request another reset link</Link>
      </CardContent>
    </Card>
  </main>;
}
