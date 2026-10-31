import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Logo } from '@/components/logo';
import { signup } from '@/lib/auth/actions';
import { createServerSupabaseClient } from '@/lib/supabase/server';

export default async function SignupPage({ searchParams }: { searchParams?: { error?: string } }) {
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
          <CardTitle>Create your SYVIC account</CardTitle>
          <CardDescription>
            Get started with our free plan
          </CardDescription>
        </CardHeader>
        <CardContent>
          {searchParams?.error && <p role="alert" className="mb-4 border border-red-200 bg-red-50 p-3 text-sm text-red-800">
            Could not create your account. Please check your details and try again.
          </p>}
          <form action={signup} className="space-y-4">
            <div>
              <Label htmlFor="name">Full name</Label>
              <Input
                id="name"
                name="name"
                type="text"
                required
                placeholder="John Doe"
                className="mt-1"
              />
            </div>

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
                minLength={8}
                className="mt-1"
              />
              <p className="mt-1 text-xs text-gray-500">
                Minimum 8 characters
              </p>
            </div>

            <Button type="submit" className="w-full">
              Create account
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link href="/login" className="font-medium text-black hover:underline">
              Log in
            </Link>
          </div>

          <div className="mt-6 text-center text-xs text-gray-500">
            By signing up, you agree to our{' '}
            <Link href="/terms" className="underline">
              Terms
            </Link>{' '}
            and{' '}
            <Link href="/privacy" className="underline">
              Privacy Policy
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
