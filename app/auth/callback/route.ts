import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { getAppUrl } from '@/lib/auth/app-url';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get('code');
  const origin = getAppUrl();

  if (code) {
    const supabase = await createServerSupabaseClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      const { error: setupError } = await supabase.rpc('ensure_my_workspace');
      if (!setupError) return NextResponse.redirect(new URL('/dashboard', origin));
      await supabase.auth.signOut();
      const destination = new URL('/login', origin);
      destination.searchParams.set('error', 'Account setup could not finish. Please try logging in again.');
      return NextResponse.redirect(destination);
    }
  }

  const destination = new URL('/login', origin);
  destination.searchParams.set('error',
    'This confirmation link could not be used. Try logging in if your email is already confirmed, or request a new confirmation link.');
  return NextResponse.redirect(destination);
}
