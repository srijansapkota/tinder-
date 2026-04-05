'use client';

import { UserProfile } from '@/lib/types';
import ChatHeader from '@/components/ChatHeader';
import StreamChatInterface from '@/components/StreamChatInterface';
import StreamVideoInterface from '@/components/StreamVideoInterface';
import { useAuth } from '@/contexts/auth-context';
import { getUserMatches } from '@/lib/actions/matches';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function ChatConversationPage() {
  const params = useParams();
  const router = useRouter();
  const [otheruser, setOtherUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isVideoActive, setIsVideoActive] = useState(false);
  const userId = params.userId as string;

  const { user } = useAuth();

  useEffect(() => {
    async function loadUserData() {
      try {
        const userMatches = await getUserMatches();
        const matchedUser = userMatches.find((match) => match.id === userId);
        if (matchedUser) {
          setOtherUser(matchedUser);
        } else {
          router.push('/chat');
        }
      } catch (error) {
        console.error(error);
        router.push('/chat');
      } finally {
        setLoading(false);
      }
    }
    if (user) {
      loadUserData();
    }
  }, [userId, router, user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-red-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            Loading your matches...
          </p>
        </div>
      </div>
    );
  }

  if (!otheruser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-red-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <p className="text-gray-600 dark:text-gray-400">User not found.</p>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gradient-to-br from-pink-50 to-red-50 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-4xl mx-auto h-full flex flex-col">
        <ChatHeader
          user={otheruser}
          onVideoCall={() => setIsVideoActive(true)}
        />

        <div className="flex-1 min-h-0">
          <StreamChatInterface otherUser={otheruser} />
        </div>
      </div>

      {/* Full-screen video call overlay */}
      {isVideoActive && otheruser && (
        <StreamVideoInterface
          otherUserId={otheruser.id}
          onClose={() => setIsVideoActive(false)}
        />
      )}
    </div>
  );
}
