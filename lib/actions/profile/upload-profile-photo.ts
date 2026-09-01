'use server';

import { getAuthedUser } from '../get-authed-user';

export async function uploadProfilePhoto(file: File) {
  const { supabase, user } = await getAuthedUser();
  if (!user) return { success: false, error: 'User not authenticated' };

  const fileName = `${user.id}-${Date.now()}.${file.name.split('.').pop()}`;

  const { error } = await supabase.storage
    .from('profile-photos')
    .upload(fileName, file);

  if (error) return { success: false, error: 'Failed to upload photo' };

  const { data } = supabase.storage.from('profile-photos').getPublicUrl(fileName);
  return { success: true, url: data.publicUrl };
}
