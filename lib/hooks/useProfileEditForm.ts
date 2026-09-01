import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { getCurrentUserProfile, updateUserProfile } from '@/lib/actions/profile';

export interface EditProfileFormData {
  full_name: string;
  username: string;
  bio: string;
  gender: 'male' | 'female' | 'other';
  birthdate: string;
  avatar_url: string;
}

const initialFormData: EditProfileFormData = {
  full_name: '',
  username: '',
  bio: '',
  gender: 'male',
  birthdate: '',
  avatar_url: '',
};

export function useEditProfileForm() {
  const { user } = useAuth();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<EditProfileFormData>(initialFormData);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    async function loadProfile() {
      try {
        const profileData = await getCurrentUserProfile();
        if (profileData) {
          setFormData({
            full_name: profileData.full_name || '',
            username: profileData.username || '',
            bio: profileData.bio || '',
            gender: profileData.gender || 'male',
            birthdate: profileData.birthdate || '',
            avatar_url: profileData.avatar_url || '',
          });
        }
      } catch {
        setError('Failed to load profile');
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, [user]);

  function handleInputChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  function setAvatarUrl(url: string) {
    setFormData((prev) => ({ ...prev, avatar_url: url }));
  }

  async function handleFormSubmit(e: React.FormEvent) {
    e.preventDefault();

    setSaving(true);
    setError(null);

    try {
      const result = await updateUserProfile(formData);
      if (result.success) {
        router.push('/profile');
      } else {
        setError(result.error || 'Failed to update profile.');
      }
    } catch {
      setError('Failed to update profile.');
    } finally {
      setSaving(false);
    }
  }

  return {
    user,
    loading,
    saving,
    error,
    formData,
    handleInputChange,
    setAvatarUrl,
    handleFormSubmit,
    goBack: () => router.back(),
  };
}
