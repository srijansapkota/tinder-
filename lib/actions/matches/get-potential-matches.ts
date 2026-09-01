'use server';

import { UserProfile } from '@/lib/types';
import { requireUser, toUserProfile } from './helpers';


export async function getPotentialMatches(): Promise<UserProfile[]> {
  const { supabase, user } = await requireUser();

  const { data: likedUsers } = await supabase
    .from('likes')
    .select('to_user_id')
    .eq('from_user_id', user.id);

  const likedIds = likedUsers?.map((like) => like.to_user_id) ?? [];

  let query = supabase.from('users').select('*').neq('id', user.id);

  if (likedIds.length > 0) {
    query = query.not('id', 'in', `(${likedIds.join(',')})`);
  }

  const { data: potentialMatches, error } = await query.limit(50);
  if (error) throw new Error('Failed to fetch potential matches');

  return potentialMatches.map((match) => toUserProfile(match));
}
