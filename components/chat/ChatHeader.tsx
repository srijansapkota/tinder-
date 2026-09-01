'use client';

import { UserProfile } from '@/lib/types';
import { calculateAge } from '@/lib/helpers/calculate-age';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface ChatHeaderProps {
  user: UserProfile;
  onVideoCall?: () => void;
}

export default function CheadHeader({ user, onVideoCall }: ChatHeaderProps) {
  const router = useRouter();

  return (
    <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => router.back()}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 focus:outline-none"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            ></svg>
          </button>

          <div
            className="flex items-center space-x-3
          "
          >
            <div className="relative w-12 h-12 rounded-full overflow-hidden">
              <Image
                src={user.avatar_url || '/default-avatar.png'}
                alt={user.full_name}
                className="w-full h-full object-cover"
                width={48}  
                height={48}
              />
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-gray-800 rounded"></div>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                {user.full_name}, {calculateAge(user.birthdate)}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                @{user.username}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={onVideoCall}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 focus:outline-none"
            title="Start Video call"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 6h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2z"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
