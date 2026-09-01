import { SupabaseClient } from '@supabase/supabase-js';


export async function assertActiveMatch(
  supabase: SupabaseClient,
  userId: string,
  otherUserId: string
) {
  const { data: match } = await supabase
    .from('matches')
    .select('*')
    .or(
      `and(user1_id.eq.${userId},user2_id.eq.${otherUserId}),and(user1_id.eq.${otherUserId},user2_id.eq.${userId})`
    )
    .eq('is_active', true)
    .single();

  if (!match) throw new Error('Users are not matched.');
  return match;
}
