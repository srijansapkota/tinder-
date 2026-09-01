import { useAuth } from '@/contexts/auth-context';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface UseAuthFormResult {
  isSignUp: boolean;
  setIsSignUp: (value: boolean) => void;
  email: string;
  setEmail: (value: string) => void;
  password: string;
  setPassword: (value: string) => void;
  loading: boolean;
  error: string;
  handleAuth: (e: React.FormEvent) => Promise<void>;
}

export function useAuthForm(): UseAuthFormResult {
  const [isSignUp, setIsSignUp] = useState<boolean>(false);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const supabase = createClient();
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user && !authLoading) {
      router.push('/');
    }
  }, [user, authLoading, router]);

  async function redirectAfterAuth(userId: string) {
    const { data: profile } = await supabase
      .from('users')
      .select('gender, bio')
      .eq('id', userId)
      .single();

    if (
      profile &&
      (profile.gender === 'other' || !profile.bio || profile.bio === '')
    ) {
      window.location.href = '/profile/edit';
    } else {
      window.location.href = '/profile';
    }
  }

  async function handleAuth(e: React.FormEvent) {
    e.preventDefault();

    setLoading(true);
    setError('');

    try {
      if (isSignUp) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        });

        if (error) throw error;
        if (data.user && !data.session) {
          setError('Please check your email for a confirmation link');
          return;
        }

        if (data.session) {
          window.location.href = '/profile/edit';
          return;
        }
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;

        if (data.user) {
          await redirectAfterAuth(data.user.id);
        }
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  }

  return {
    isSignUp,
    setIsSignUp,
    email,
    setEmail,
    password,
    setPassword,
    loading,
    error,
    handleAuth,
  };
}