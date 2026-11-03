'use server';

import { redirect } from 'next/navigation';
import { getAppUrl } from '@/lib/auth/app-url';
import {
  createServerSupabaseClient,
} from '@/lib/supabase/server';

export async function login(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  const supabase = await createServerSupabaseClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    const message = error.code === 'email_not_confirmed'
      ? 'Confirm your email using the link in your inbox, then log in.'
      : 'Could not log in. Check your email and password and try again.';
    redirect(`/login?error=${encodeURIComponent(message)}`);
  }

  const { error: setupError } = await supabase.rpc('ensure_my_workspace');
  if (setupError) {
    await supabase.auth.signOut();
    redirect('/login?error=Account%20setup%20could%20not%20finish.%20Please%20try%20logging%20in%20again.');
  }

  redirect('/dashboard');
}

export async function signup(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const name = formData.get('name') as string;

  const supabase = await createServerSupabaseClient();

  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${getAppUrl()}/auth/callback`,
      data: {
        name,
      },
    },
  });

  if (authError) {
    redirect('/signup?error=signup-failed');
  }

  if (!authData.session) {
    redirect('/login?message=confirm-email');
  }

  const { error: setupError } = await supabase.rpc('ensure_my_workspace');
  if (setupError) {
    await supabase.auth.signOut();
    redirect('/login?error=Account%20setup%20could%20not%20finish.%20Please%20try%20logging%20in%20again.');
  }

  redirect('/dashboard');
}

export async function logout() {
  const supabase = await createServerSupabaseClient();
  await supabase.auth.signOut();
  redirect('/');
}

export async function requestPasswordReset(formData: FormData) {
  const email = String(formData.get('email') || '').trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    redirect('/forgot-password?error=Enter%20a%20valid%20email%20address.');
  }
  const supabase = await createServerSupabaseClient();
  await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${getAppUrl()}/auth/callback?next=/reset-password`,
  });
  // Keep the response identical for unknown accounts and provider failures.
  redirect('/forgot-password?sent=1');
}

export async function updatePassword(formData: FormData) {
  const password = String(formData.get('password') || '');
  const confirmation = String(formData.get('confirmation') || '');
  if (password.length < 8 || password !== confirmation) {
    redirect('/reset-password?error=Use%20at%20least%208%20characters%20and%20matching%20passwords.');
  }
  const supabase = await createServerSupabaseClient();
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) redirect('/forgot-password?error=Request%20a%20new%20reset%20link.');
  const { error } = await supabase.auth.updateUser({ password });
  if (error) redirect('/reset-password?error=Could%20not%20update%20your%20password.%20Try%20a%20different%20password%20or%20request%20a%20new%20link.');
  await supabase.auth.signOut();
  redirect('/login?message=password-updated');
}
