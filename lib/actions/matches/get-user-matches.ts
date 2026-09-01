'use server';

import { UserProfile } from '@/lib/types';
import { requireUser, toUserProfile } from './helpers';

export async function getUserMatches(): Promise<UserProfile[]> {
  const { supabase, user } = await requireUser();

  const { data: matches } = await supabase
    .from('matches')
    .select('*')
    .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`)
    .eq('is_active', true);

  if (!matches || matches.length === 0) return [];

  const otherUserIds = matches.map((match) =>
    match.user1_id === user.id ? match.user2_id : match.user1_id
  );

  const { data: otherUsers } = await supabase
    .from('users')
    .select('*')
    .in('id', otherUserIds);

  return matches
    .map((match) => {
      const otherId = match.user1_id === user.id ? match.user2_id : match.user1_id;
      const otherUser = otherUsers?.find((u) => u.id === otherId);
      if (!otherUser) return null;
      return toUserProfile(otherUser, { email: otherUser.email, created_at: match.created_at });
    })
    .filter((profile): profile is UserProfile => profile !== null);
}
