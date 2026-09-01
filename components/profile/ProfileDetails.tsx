import { UserProfile } from '@/lib/types';

interface ProfileDetailsProps {
  profile: UserProfile;
}

export default function ProfileDetails({ profile }: ProfileDetailsProps) {
  return (
    <>
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
          About Me
        </h3>
        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
          {profile.bio || 'No bio added yet.'}
        </p>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
          Basic Information
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Gender
            </label>
            <p className="text-gray-900 dark:text-white capitalize">
              {profile.gender}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Birthday
            </label>
            <p className="text-gray-900 dark:text-white">
              {new Date(profile.birthdate).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}