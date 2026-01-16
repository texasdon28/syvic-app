import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Logo } from '@/components/logo';
import { login } from '@/lib/auth/actions';
import { createServerSupabaseClient } from '@/lib/supabase/server';

export default async function LoginPage() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    redirect('/dashboard');
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4">
      <div className="mb-8">
        <Logo variant="full" />
      </div>

      <Card className="w-full max-w-md border-gray-200">
        <CardHeader>
          <CardTitle>Log in to SYVIC</CardTitle>
          <CardDescription>
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={login} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                placeholder="you@example.com"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                placeholder="••••••••"
                className="mt-1"
              />
            </div>

            <Button type="submit" className="w-full">
              Log in
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-600">
            Don't have an account?{' '}
            <Link href="/signup" className="font-medium text-black hover:underline">
              Sign up
            </Link>
          </div>
        </CardContent>
      </Card>

      <div className="mt-8 text-center text-xs text-gray-500">
        <Link href="/" className="hover:underline">
          ← Back to home
        </Link>
      </div>
    </div>
  );
}
