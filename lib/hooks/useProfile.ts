import { useEffect, useState, useCallback } from 'react';
import { getCurrentUserProfile } from '@/lib/actions/profile';
import { UserProfile } from '@/lib/types';

interface UseProfileResult {
  profile: UserProfile | null;
  loading: boolean;
  error: string | null;
  reload: () => void;
}

export function useProfile(): UseProfileResult {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadToken, setReloadToken] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function loadProfile() {
      setLoading(true);
      setError(null);
      try {
        const profileData = await getCurrentUserProfile();
        if (cancelled) return;

        if (profileData) {
          setProfile(profileData);
        } else {
          setError('Failed to load profile');
        }
      } catch (err) {
        if (cancelled) return;
        console.error('Error loading profile:', err);
        setError('Failed to load profile');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadProfile();

    return () => {
      cancelled = true;
    };
  }, [reloadToken]);

  const reload = useCallback(() => setReloadToken((t) => t + 1), []);

  return { profile, loading, error, reload };
}