'use server';

import { getAuthedUser } from '../get-authed-user';

export async function getCurrentUserProfile() {
  const { supabase, user } = await getAuthedUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single();

  return profile;
}
