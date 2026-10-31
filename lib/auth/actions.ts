'use server';

import { redirect } from 'next/navigation';
import { getAppUrl } from '@/lib/auth/app-url';
import {
  createServerSupabaseClient,
  createServiceSupabaseClient,
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
    return { error: authError.message };
  }

  if (!authData.session) {
    redirect('/login?message=confirm-email');
  }

  if (authData.user && authData.session) {
    const serviceSupabase = createServiceSupabaseClient();
    const { data: organization, error: orgError } = await serviceSupabase
      .from('organizations')
      .insert({
        name: `${name}'s Organization`,
        type: 'individual_landlord',
      })
      .select('id')
      .single();

    if (orgError || !organization) {
      return { error: orgError?.message || 'Could not create organization' };
    }

    const { error: memberError } = await serviceSupabase
      .from('organization_members')
      .insert({
        organization_id: organization.id,
        user_id: authData.user.id,
        role: 'owner',
      });

    if (memberError) {
      return { error: memberError.message };
    }

    await serviceSupabase.from('subscription_status').insert({
      organization_id: organization.id,
      plan: 'free',
      status: 'active',
    });
  }

  redirect('/dashboard');
}

export async function logout() {
  const supabase = await createServerSupabaseClient();
  await supabase.auth.signOut();
  redirect('/');
}
