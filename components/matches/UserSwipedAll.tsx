import { useRouter } from "next/navigation";
import MatchNotification from "./MatchNotifications";
import { UserProfile } from "@/lib/types";

interface UserSwipedAllProps {
  potentialMatches: UserProfile[];
  loadMatches: () => void;
  showMatchNotification: boolean;
  matchedUser: UserProfile | null;
  handleCloseMatchNotification: () => void;
  handleStartChat: () => void;
}

export default function UserSwipedAll({ potentialMatches, loadMatches, showMatchNotification, matchedUser, handleCloseMatchNotification, handleStartChat }: UserSwipedAllProps) {
  const router = useRouter()
  return (
    <>
      <div className="min-h-screen bg-app-gradient flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="w-24 h-24 bg-lime border-2 border-ink rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl">💕</span>
          </div>
          <h2 className="text-2xl font-bold text-ink mb-4">
            {potentialMatches.length === 0
              ? 'No Profiles Available'
              : "You've Seen Everyone!"}
          </h2>
          <p className="text-ink-soft mb-6">
            {potentialMatches.length === 0
              ? 'Check back later for new people to meet.'
              : "Great job exploring! Check back later for new profiles."}
          </p>
          <div className="flex gap-4 justify-center">
            <button onClick={loadMatches} className="btn-primary">
              Refresh
            </button>
            <button
              onClick={() => router.push('/profile/edit')}
              className="btn-outline"
            >
              Edit Profile
            </button>
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
    </>
  )
}
