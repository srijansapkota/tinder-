'use server';

import { UserProfile } from '@/lib/types';
import { getAuthedUser } from '../get-authed-user';

export async function updateUserProfile(profileData: Partial<UserProfile>) {
  const { supabase, user } = await getAuthedUser();
  if (!user) return { success: false, error: 'User not authenticated' };

  const { full_name, username, bio, gender, birthdate, avatar_url } = profileData;

  const { error } = await supabase
    .from('users')
    .update({
      full_name,
      username,
      bio,
      gender,
      birthdate,
      avatar_url,
      updated_at: new Date().toISOString(),
    })
    .eq('id', user.id);

  if (error) return { success: false, error: error.message };
  return { success: true };
}
