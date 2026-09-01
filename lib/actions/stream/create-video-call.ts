'use server';

import { getAuthedUser } from '../get-authed-user';
import { assertActiveMatch } from '../assert-active-match';
import { generateStreamId } from '@/lib/helpers/generate-stream-id';

export async function createVideoCall(otherUserId: string) {
  const { supabase, user } = await getAuthedUser();
  if (!user) return { success: false, error: 'User not authenticated' };

  await assertActiveMatch(supabase, user.id, otherUserId);

  const callId = generateStreamId('call', [user.id, otherUserId]);
  return { callId, callType: 'default' };
}
