'use client';

import { UserProfile } from '@/lib/types';
import ChatHeader from '@/components/chat/ChatHeader';
import { useAuth } from '@/contexts/auth-context';
import { getUserMatches } from '@/lib/actions/matches';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import StreamChatInterface from '@/components/chat/StreamChatInterface';
import StreamVideoInterface from '@/components/chat/StreamVideoInterface';

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
      <LoadingSpinner />
    );
  }

  if (!otheruser) {
    return (
      <div className="min-h-screen bg-app-gradient flex items-center justify-center">
        <p className="text-gray-600 dark:text-gray-400">User not found.</p>
      </div>
    );
  }

  return (
    <div className="h-screen bg-app-gradient">
      <div className="max-w-4xl mx-auto h-full flex flex-col">
        <ChatHeader
          user={otheruser}
          onVideoCall={() => setIsVideoActive(true)}
        />

        <div className="flex-1 min-h-0">
          <StreamChatInterface otherUser={otheruser} />
        </div>
      </div>

      {isVideoActive && otheruser && (
        <StreamVideoInterface
          otherUserId={otheruser.id}
          onClose={() => setIsVideoActive(false)}
        />
      )}
    </div>
  );
}
