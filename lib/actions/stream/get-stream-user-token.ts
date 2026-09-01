'use server';

import { getAuthedUser } from '../get-authed-user';
import { getStreamServerClient } from './client';

export async function getStreamUserToken() {
  const { supabase, user } = await getAuthedUser();
  if (!user) return { success: false, error: 'User not authenticated' };

  const { data: userData } = await supabase
    .from('users')
    .select('full_name, avatar_url')
    .eq('id', user.id)
    .single();

  if (!userData) throw new Error('Failed to fetch user data');

  const client = getStreamServerClient();
  const token = client.createToken(user.id);

  await client.upsertUser({
    id: user.id,
    name: userData.full_name,
    image: userData.avatar_url || undefined,
  });

  return {
    token,
    userId: user.id,
    userName: userData.full_name,
    userImage: userData.avatar_url || undefined,
  };
}


export async function getStreamVideoToken() {
  return getStreamUserToken();
}
