'use server';

import { redirect } from 'next/navigation';
import { createServerSupabaseClient } from '@/lib/supabase/server';

export async function login(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  const supabase = await createServerSupabaseClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: error.message };
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
      data: {
                name,
      },
    },
  });

  if (authError) {
    return { error: authError.message };
  }

  if (authData.user) {
    const { error: orgError } = await supabase.from('organizations').insert({
      name: `${name}'s Organization`,
      type: 'individual_landlord',
    }).select().single();

    if (!orgError && authData.user) {
      await supabase.from('organization_members').insert({
        organization_id: (await supabase.from('organizations').select('id').order('created_at', { ascending: false }).limit(1).single()).data?.id,
        user_id: authData.user.id,
        role: 'owner',
      });
    }
  }

  redirect('/dashboard');
}

export async function logout() {
  const supabase = await createServerSupabaseClient();
  await supabase.auth.signOut();
  redirect('/');
}
