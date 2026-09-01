'use server';

import { createClient } from '@/lib/supabase/server';
import { UserProfile } from '@/lib/types';

export type PublicUserProfile = Pick<
  UserProfile,
  | 'id' | 'full_name' | 'username' | 'gender' | 'birthdate'
  | 'bio' | 'avatar_url' | 'is_verified' | 'is_online' | 'created_at'
>;


export async function getPublicUserProfile(userId: string): Promise<PublicUserProfile | null> {
  const supabase = await createClient();

  const { data: profile } = await supabase
    .from('users')
    .select('id, full_name, username, gender, birthdate, bio, avatar_url, is_verified, is_online, created_at')
    .eq('id', userId)
    .single();

  return profile;
}
