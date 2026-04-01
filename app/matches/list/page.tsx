import { UserProfile } from '@/lib/types';
import { getUserMatches } from '@/lib/actions/matches';
import Link from 'next/link';
import { calculateAge } from '@/lib/helpers/calculate-age';
import Image from 'next/image';

export const dynamic = 'force-dynamic';

export default async function MatchesListPage() {
  let matches: UserProfile[] = [];
  try {
    matches = await getUserMatches();
  } catch (error) {
    console.error('Failed to load matches:', error);
  }

  const getAvatarSrc = (avatarUrl: string | null | undefined) => {
    const trimmed = avatarUrl?.trim();
    return trimmed ? trimmed : '/default-avatar.png';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-red-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Your Matches
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {matches.length} match{matches.length !== 1 ? 'es' : ''}
          </p>
        </header>

        {matches.length === 0 ? (
          <div className="text-center max-w-md mx-auto p-8">
            <div className="w-24 h-24 bg-gradient-to-r from-pink-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl">💕</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              No matches yet
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Start swiping to find your perfect match!
            </p>
            <Link
              href="/matches"
              className="bg-gradient-to-r from-pink-500 to-red-500 text-white font-semibold py-3 px-6 rounded-full hover:from-pink-600 hover:to-red-600 transition-all duration-200"
            >
              Start Swiping
            </Link>
          </div>
        ) : (
          <div className="max-w-2xl mx-auto">
            <div className="grid gap-4">
              {matches.map((match, key) => (
                <Link
                  key={key}
                  href={`/chat/${match.id}`}
                  className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
                >
                  <div className="flex items-center space-x-4">
                    <div className="relative w-16 h-16 rounded-full overflow-hidden flex-shrink-0">
                      <Image
                        src={getAvatarSrc(match.avatar_url)}
                        alt={match.full_name || 'User avatar'}
                        fill
                        sizes="64px"
                        className="object-cover"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {match.full_name}, {calculateAge(match.birthdate)}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                        @{match.username}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                        {match.bio}
                      </p>
                    </div>
                    <div className="flex-shrink-0">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
