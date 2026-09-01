'use server';

import { getAuthedUser } from '../get-authed-user';
import { assertActiveMatch } from '../assert-active-match';
import { generateStreamId } from '@/lib/helpers/generate-stream-id';
import { getStreamServerClient } from './client';

export async function createOrGetChannel(otherUserId: string) {
  const { supabase, user } = await getAuthedUser();
  if (!user) return { success: false, error: 'User not authenticated' };

  await assertActiveMatch(supabase, user.id, otherUserId);

  const { data: otherUser } = await supabase
    .from('users')
    .select('full_name, avatar_url')
    .eq('id', otherUserId)
    .single();

  if (!otherUser) throw new Error('Failed to fetch user data');

  const channelId = generateStreamId('match', [user.id, otherUserId]);
  const client = getStreamServerClient();

  await client.upsertUser({
    id: otherUserId,
    name: otherUser.full_name,
    image: otherUser.avatar_url || undefined,
  });

  const channel = client.channel('messaging', channelId, {
    members: [user.id, otherUserId],
    created_by_id: user.id,
  });

  try {
    await channel.create();
  } catch (error) {
  
    if (error instanceof Error && !error.message.includes('already exists')) {
      throw error;
    }
  }

  return { channelType: 'messaging', channelId };
}
