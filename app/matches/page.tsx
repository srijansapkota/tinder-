import { getPotentialMatches } from '@/lib/actions/matches';
import MatchSwipeView from '@/components/MatchSwipeView';
import { UserProfile } from '@/lib/types';

export const dynamic = 'force-dynamic';

export default async function MatchesPage() {
  let initialMatches: UserProfile[] = [];
  try {
    initialMatches = await getPotentialMatches();
  } catch (error) {
    console.error('Error loading matches:', error);
  }

  return <MatchSwipeView initialMatches={initialMatches} />;
}
