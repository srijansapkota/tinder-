'use client';

import LoadingSpinner from '@/components/common/LoadingSpinner';
import Unauthorized from '@/components/common/UnauthorizedPage';
import AvatarUploadField from '@/components/profile/AvatarUploadField';
import ProfileNameFields from '@/components/profile/ProfileNameFields';
import { useEditProfileForm } from '@/lib/hooks/useProfileEditForm';


export default function EditProfilePage() {
  const {
    user,
    loading,
    saving,
    error,
    formData,
    handleInputChange,
    setAvatarUrl,
    handleFormSubmit,
    goBack,
  } = useEditProfileForm();

  if (!user) {
    return <Unauthorized />;
  }

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-app-gradient">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold text-ink mb-2">
            Edit Profile
          </h1>
          <p className="text-ink-soft">
            Update your profile information
          </p>
        </header>

        <div className="max-w-2xl mx-auto">
          <form
            className="bg-bone-soft border-2 border-ink rounded-lg p-8"
            onSubmit={handleFormSubmit}
          >
            <AvatarUploadField
              avatarUrl={formData.avatar_url}
              onPhotoUploaded={setAvatarUrl}
            />

            <ProfileNameFields formData={formData} onChange={handleInputChange} />

            {error && (
              <div className="mb-6 p-4 bg-bone border-2 border-flame text-flame rounded-lg">
                {error}
              </div>
            )}

            <div className="flex items-center justify-between pt-6 border-t-2 border-ink">
              <button
                type="button"
                onClick={goBack}
                className="px-6 py-2 text-ink-soft hover:text-ink transition-colors duration-150"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="btn-primary"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}