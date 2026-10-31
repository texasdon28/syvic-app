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
