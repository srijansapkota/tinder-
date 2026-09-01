'use client';

import { useProfile } from '@/lib/hooks/useProfile';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ProfileError from '@/components/profile/ProfileError';
import ProfileHeader from '@/components/profile/ProfileHeader';
import ProfileDetails from '@/components/profile/ProfileDetails';
import ProfileSidebar from '@/components/profile/ProfileSidebar';

export default function ProfilePage() {
  const { profile, loading, error, reload } = useProfile();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error || !profile) {
    return <ProfileError message={error} onRetry={reload} />;
  }

  return (
    <div className="min-h-screen bg-app-gradient">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            My Profile
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your profile
          </p>
        </header>

        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
                <ProfileHeader profile={profile} />
                <div className="space-y-6">
                  <ProfileDetails profile={profile} />
                </div>
              </div>
            </div>

            <ProfileSidebar profile={profile} />
          </div>
        </div>
      </div>
    </div>
  );
}