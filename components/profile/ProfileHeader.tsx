import Image from 'next/image';
import { UserProfile } from '@/lib/types';
import { calculateAge } from '@/lib/helpers/calculate-age';

interface ProfileHeaderProps {
  profile: UserProfile;
}

export default function ProfileHeader({ profile }: ProfileHeaderProps) {
  return (
    <div className="flex items-center space-x-6 mb-8">
      <div className="relative">
        <div className="w-24 h-24 rounded-full overflow-hidden">
          <Image
            src={profile.avatar_url || '/default-avatar.png'}
            alt={profile.full_name}
            className="w-full h-full object-cover"
            width={96}
            height={96}
          />
        </div>
      </div>

      <div className="flex-1">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
          {profile.full_name}, {calculateAge(profile.birthdate)}
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-2">
          @{profile.username}
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-500">
          Member since {new Date(profile.created_at).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
}