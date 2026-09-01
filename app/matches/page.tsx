import { getPotentialMatches } from '@/lib/actions/matches';
import MatchSwipeView from '@/components/matches/MatchSwipeView';
import { UserProfile } from '@/lib/types';

export const dynamic = 'force-dynamic';

export default async function MatchesPage() {
  const initialMatches: UserProfile[] = await getPotentialMatches();
  return <MatchSwipeView initialMatches={initialMatches} />;
}