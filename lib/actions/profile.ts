'use server';

import { UserProfile } from '@/lib/types';
import { createClient } from '../supabase/server';

export async function getCurrentUserProfile() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data: profile, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single();

  if (error) {
    console.error('Error fetching profile:', error);
    return null;
  }

  return profile;
}

export async function updateUserProfile(profileData: Partial<UserProfile>) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: 'User not authenticated' };
  }

  // Auto-set gender preference based on user's gender
  let preferences = profileData.preferences;
  if (profileData.gender && !preferences) {
    if (profileData.gender === 'male') {
      preferences = {
        age_range: { min: 18, max: 50 },
        distance: 25,
        gender_preference: ['female'],
      };
    } else if (profileData.gender === 'female') {
      preferences = {
        age_range: { min: 18, max: 50 },
        distance: 25,
        gender_preference: ['male'],
      };
    }
  }

  const { error } = await supabase
    .from('users')
    .update({
      full_name: profileData.full_name,
      username: profileData.username,
      bio: profileData.bio,
      gender: profileData.gender,
      birthdate: profileData.birthdate,
      avatar_url: profileData.avatar_url,
      preferences: preferences,
      updated_at: new Date().toISOString(),
    })
    .eq('id', user.id);

  if (error) {
    console.log(error);
    return { success: false, error: error.message };
  }

  return { success: true };
}

export async function uploadProfilePhoto(file: File) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: 'User not authenticated' };
  }

  const fileExt = file.name.split('.').pop();
  const fileName = `${user.id}-${Date.now()}.${fileExt}`;

  const { error: uploadError } = await supabase.storage
    .from('profile-photos')
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (uploadError) {
    return {
      success: false,
      error: uploadError.message.includes('bucket')
        ? 'Profile photos storage not configured'
        : 'Failed to upload photo',
    };
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from('profile-photos').getPublicUrl(fileName);
  return { success: true, url: publicUrl };
}
