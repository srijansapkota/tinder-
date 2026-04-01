'use server';

import { UserProfile } from '@/lib/types';
import { createClient } from '../supabase/server';

export async function getPotentialMatches(): Promise<UserProfile[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('Not authenticated.');
  }

  const { data: currentUser, error: userError } = await supabase
    .from('users')
    .select('gender, preferences')
    .eq('id', user.id)
    .single();

  if (userError) {
    throw new Error('Failed to get user profile');
  }

  const currentUserPrefs = currentUser.preferences as Record<
    string,
    unknown
  > | null;
  const genderPreference =
    (currentUserPrefs?.gender_preference as string[]) || [];

  // If no preference is set, show opposite gender by default
  let targetGenders = genderPreference;
  if (!genderPreference || genderPreference.length === 0) {
    if (currentUser.gender === 'male') {
      targetGenders = ['female'];
    } else if (currentUser.gender === 'female') {
      targetGenders = ['male'];
    } else {
      targetGenders = ['male', 'female', 'other'];
    }
  }

  // Fetch likes to perform an Anti-Join
  const { data: likedUsers } = await supabase
    .from('likes')
    .select('to_user_id')
    .eq('from_user_id', user.id);

  const likedIds = likedUsers?.map((l) => l.to_user_id) || [];

  let query = supabase
    .from('users')
    .select('*')
    .neq('id', user.id)
    .in('gender', targetGenders);

  if (likedIds.length > 0) {
    query = query.not('id', 'in', `(${likedIds.join(',')})`);
  }

  const { data: potentialMatches, error } = await query.limit(50);

  if (error) {
    throw new Error('failed to fetch potential matches');
  }

  const filteredMatches =
    potentialMatches.map((match) => ({
      id: match.id,
      full_name: match.full_name,
      username: match.username,
      email: '',
      gender: match.gender,
      birthdate: match.birthdate,
      bio: match.bio,
      avatar_url: match.avatar_url,
      preferences: match.preferences,
      location_lat: undefined,
      location_lng: undefined,
      last_active: new Date().toISOString(),
      is_verified: true,
      is_online: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })) || [];
  return filteredMatches;
}

export async function likeUser(toUserId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('Not authenticated.');
  }

  // Check if like already exists
  const { data: existingOwnLike } = await supabase
    .from('likes')
    .select('*')
    .eq('from_user_id', user.id)
    .eq('to_user_id', toUserId)
    .single();

  // Only insert if like doesn't already exist
  if (!existingOwnLike) {
    const { error: likeError } = await supabase.from('likes').insert({
      from_user_id: user.id,
      to_user_id: toUserId,
    });

    if (likeError) {
      console.error('Like error:', likeError);
      throw new Error(`Failed to create like: ${likeError.message}`);
    }
  }

  // Check if a match was created by the database trigger
  // The trigger uses LEAST/GREATEST to order user IDs consistently
  const user1 = user.id < toUserId ? user.id : toUserId;
  const user2 = user.id < toUserId ? toUserId : user.id;

  const { data: match } = await supabase
    .from('matches')
    .select('*')
    .eq('user1_id', user1)
    .eq('user2_id', user2)
    .single();

  // If a match exists, it means both users liked each other
  if (match) {
    const { data: matchedUser, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', toUserId)
      .single();

    if (userError) {
      throw new Error('Failed to fetch matched user');
    }

    return {
      success: true,
      isMatch: true,
      matchedUser: matchedUser as UserProfile,
    };
  }

  return { success: true, isMatch: false };
}

export async function getUserMatches() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('Not authenticated.');
  }

  const { data: matches, error } = await supabase
    .from('matches')
    .select('*')
    .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`)
    .eq('is_active', true);

  if (error) {
    throw new Error('Failed to fetch matches');
  }

  const matchedUsers: UserProfile[] = [];

  if (matches && matches.length > 0) {
    const otherUserIds = matches.map((match) =>
      match.user1_id === user.id ? match.user2_id : match.user1_id
    );

    const { data: otherUsers, error: usersError } = await supabase
      .from('users')
      .select('*')
      .in('id', otherUserIds);

    if (usersError) {
      throw new Error('Failed to fetch matched users profiles');
    }

    if (otherUsers) {
      for (const match of matches) {
        const otherUserId =
          match.user1_id === user.id ? match.user2_id : match.user1_id;
        const otherUser = otherUsers.find((u) => u.id === otherUserId);

        if (otherUser) {
          matchedUsers.push({
            id: otherUser.id,
            full_name: otherUser.full_name,
            username: otherUser.username,
            email: otherUser.email,
            gender: otherUser.gender,
            birthdate: otherUser.birthdate,
            bio: otherUser.bio,
            avatar_url: otherUser.avatar_url,
            preferences: otherUser.preferences,
            location_lat: undefined,
            location_lng: undefined,
            last_active: new Date().toISOString(),
            is_verified: true,
            is_online: false,
            created_at: match.created_at,
            updated_at: match.created_at,
          });
        }
      }
    }
  }

  return matchedUsers;
}
