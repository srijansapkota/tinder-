import { UserProfile } from '@/lib/types';
import { getUserMatches } from '@/lib/actions/matches';
import Link from 'next/link';
import { calculateAge } from '@/lib/helpers/calculate-age';
import Image from 'next/image';

export const dynamic = 'force-dynamic';

export default async function MatchesListPage() {
  let matches: UserProfile[] = [];
matches = await getUserMatches();

  const getAvatarSrc = (avatarUrl: string | null | undefined) => {
    const trimmed = avatarUrl?.trim();
    return trimmed ? trimmed : '/default-avatar.png';
  };

  return (
    <div className="min-h-screen bg-app-gradient">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold text-ink mb-2">
            Your Matches
          </h1>
          <p className="text-ink-soft">
            {matches.length} match{matches.length !== 1 ? 'es' : ''}
          </p>
        </header>

        {matches.length === 0 ? (
          <div className="text-center max-w-md mx-auto p-8">
            <div className="w-24 h-24 bg-lime border-2 border-ink rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl">💕</span>
            </div>
            <h2 className="text-2xl font-bold text-ink mb-4">
              No matches yet
            </h2>
            <p className="text-ink-soft mb-6">
              Start swiping to find your perfect match!
            </p>
            <Link href="/matches" className="btn-primary">
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
                  className="block bg-bone-soft border-2 border-ink rounded-lg p-6 transition-transform duration-150 hover:-translate-y-0.5"
                >
                  <div className="flex items-center space-x-4">
                    <div className="relative w-16 h-16 rounded-full overflow-hidden shrink-0 border-2 border-ink">
                      <Image
                        src={getAvatarSrc(match.avatar_url)}
                        alt={match.full_name || 'User avatar'}
                        fill
                        sizes="64px"
                        className="object-cover"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-ink">
                        {match.full_name}, {calculateAge(match.birthdate)}
                      </h3>
                      <p className="text-sm text-ink-soft mb-1">
                        @{match.username}
                      </p>
                      <p className="text-sm text-ink-soft line-clamp-2">
                        {match.bio}
                      </p>
                    </div>
                    <div className="shrink-0">
                      <div className="w-3 h-3 bg-lime border border-ink rounded-full"></div>
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
