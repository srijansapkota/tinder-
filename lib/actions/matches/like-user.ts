'use server';

import { UserProfile } from '@/lib/types';
import { requireUser } from './helpers';

export async function likeUser(toUserId: string) {
  const { supabase, user } = await requireUser();

  const { data: alreadyLiked } = await supabase
    .from('likes')
    .select('*')
    .eq('from_user_id', user.id)
    .eq('to_user_id', toUserId)
    .single();

  if (!alreadyLiked) {
    const { error } = await supabase
      .from('likes')
      .insert({ from_user_id: user.id, to_user_id: toUserId });

    if (error) throw new Error(`Failed to create like: ${error.message}`);
  }


  const [user1, user2] = [user.id, toUserId].sort();

  const { data: match } = await supabase
    .from('matches')
    .select('*')
    .eq('user1_id', user1)
    .eq('user2_id', user2)
    .single();

  if (!match) return { success: true, isMatch: false };

  const { data: matchedUser } = await supabase
    .from('users')
    .select('*')
    .eq('id', toUserId)
    .single();

  if (!matchedUser) throw new Error('Failed to fetch matched user');

  return { success: true, isMatch: true, matchedUser: matchedUser as UserProfile };
}
