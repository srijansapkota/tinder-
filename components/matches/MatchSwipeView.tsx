"use client";

import { UserProfile } from "@/lib/types";

import MatchButtons from "@/components/matches/MatchButtons";
import MatchNotification from "@/components/matches/MatchNotifications";
import LoadingSpinner from "../common/LoadingSpinner";
import { useMatchSwipeView } from "@/lib/hooks/useMatchSwipeView";
import UserSwipedAll from "./UserSwipedAll";
import MatchCard from "./MatchCard";

export default function MatchSwipeView({
  initialMatches,
}: {
  initialMatches: UserProfile[];
}) {
  const {
    potentialMatches,
    loading,
    currentIndex,
    showMatchNotification,
    matchedUser,
    loadMatches,
    handleLike,
    handlePass,
    handleCloseMatchNotification,
    handleStartChat,
  } = useMatchSwipeView({ initialMatches });

  if (loading) {
    return <LoadingSpinner />;
  }

  if (currentIndex >= potentialMatches.length) {
    return (
      <UserSwipedAll
        potentialMatches={potentialMatches}
        loadMatches={loadMatches}
        showMatchNotification={showMatchNotification}
        matchedUser={matchedUser}
        handleCloseMatchNotification={handleCloseMatchNotification}
        handleStartChat={handleStartChat}
      />
    );
  }

  const currentPotentialMatch = potentialMatches[currentIndex];

  return (
    <div className="min-h-screen bg-app-gradient">
      <div className="container mx-auto px-4 py-8">
        

        <div className="max-w-md mx-auto h-screen overflow-y-auto">
            <MatchCard user={currentPotentialMatch} />
          <div className="mt-8">
            <MatchButtons onLike={handleLike} onPass={handlePass} />
          </div>
        </div>

        {showMatchNotification && matchedUser && (
          <MatchNotification
            match={matchedUser}
            onClose={handleCloseMatchNotification}
            onStartChat={handleStartChat}
          />
        )}
      </div>
    </div>
  );
}
