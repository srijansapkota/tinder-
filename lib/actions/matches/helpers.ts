import { redirect } from 'next/navigation';
import { UserProfile } from '@/lib/types';
import { getAuthedUser } from '../get-authed-user';


export async function requireUser() {
  const { supabase, user } = await getAuthedUser();
  if (!user) redirect('/auth');
  return { supabase, user };
}


interface UserRow {
  id: string;
  full_name: string;
  username: string;
  gender: 'male' | 'female' | 'other';
  birthdate: string;
  bio: string;
  avatar_url: string | null;
}


export function toUserProfile(row: UserRow, overrides: Partial<UserProfile> = {}): UserProfile {
  const now = new Date().toISOString();
  return {
    id: row.id,
    full_name: row.full_name,
    username: row.username,
    email: overrides.email ?? '',
    gender: row.gender,
    birthdate: row.birthdate,
    bio: row.bio,
    avatar_url: row.avatar_url,
    last_active: now,
    is_verified: true,
    is_online: false,
    created_at: overrides.created_at ?? now,
    updated_at: overrides.updated_at ?? now,
  };
}
