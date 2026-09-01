import { useEffect, useState } from 'react';
import { getUserMatches } from '@/lib/actions/matches'
import { UserProfile } from '../types';
interface ChatData {
  id: string;
  user: UserProfile;
  lastMessage?: string;
  lastMessageTime: string;
  unreadCount: number;
};
export const useChatDetails = () => {
  const [chats, setChats] = useState<ChatData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadMatches() {
      try {
        const userMatches = await getUserMatches();
        const chatData: ChatData[] = userMatches.map((match) => ({
          id: match.id,
          user: match,
          lastMessage: 'Start your conversation!',
          lastMessageTime: match.created_at,
          unreadCount: 0,
        }));
        setChats(chatData);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    loadMatches();
  }, []);
  return { chats, loading };
}