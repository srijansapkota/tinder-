import { getPotentialMatches, likeUser } from '@/lib/actions/matches';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { UserProfile } from '@/lib/types';

interface MatchSwipeViewProps {
  initialMatches: UserProfile[];
}

export function useMatchSwipeView({ initialMatches }: MatchSwipeViewProps) {
  const [potentialMatches, setPotentialMatches] =
    useState<UserProfile[]>(initialMatches);
  const [loading, setLoading] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showMatchNotification, setShowMatchNotification] = useState(false);
  const [matchedUser, setMatchedUser] = useState<UserProfile | null>(null);
  const router = useRouter();

  const loadMatches = async () => {
    setLoading(true);
    try {
      const potentialMatchesData = await getPotentialMatches();
      setPotentialMatches(potentialMatchesData);
      setCurrentIndex(0);
    } catch (error) {
      console.error('Error loading matches:', error);
    } finally {
      setLoading(false);
    }
  };

  async function handleLike() {
    if (currentIndex >= potentialMatches.length) return;

    const likedUser = potentialMatches[currentIndex];

    try {
      const result = await likeUser(likedUser.id);

      if (result.isMatch) {
        setMatchedUser(result.matchedUser!);
        setShowMatchNotification(true);
      }

      setCurrentIndex((prev) => prev + 1);
    } catch (err) {
      console.error('Error liking user:', err);
      setCurrentIndex((prev) => prev + 1);
    }
  }

  function handlePass() {
    setCurrentIndex((prev) => prev + 1);
  }

  function handleCloseMatchNotification() {
    setShowMatchNotification(false);
    setMatchedUser(null);
  }

  function handleStartChat() {
    if (matchedUser) {
      router.push(`/chat/${matchedUser.id}`);
    }
  }
  return { potentialMatches, loading, currentIndex, showMatchNotification, matchedUser, loadMatches, handleLike, handlePass, handleCloseMatchNotification, handleStartChat }
}