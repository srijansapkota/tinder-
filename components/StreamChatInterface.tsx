import { UserProfile } from '@/lib/types';
import { getStreamUserToken, createOrGetChannel } from '@/lib/actions/stream';

import { useEffect, useState } from 'react';
import { StreamChat, Channel as StreamChannel } from 'stream-chat';
import {
  Chat,
  Channel,
  MessageList,
  MessageInput,
  Window,
} from 'stream-chat-react';
import 'stream-chat-react/dist/css/v2/index.css';
import './stream-chat-custom.css';

export default function StreamChatInterface({
  otherUser,
}: {
  otherUser: UserProfile;
}) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [chatClient, setChatClient] = useState<StreamChat | null>(null);
  const [channel, setChannel] = useState<StreamChannel | null>(null);

  useEffect(() => {
    async function initializeChat() {
      try {
        setError(null);
        const { token, userId, userName, userImage } =
          await getStreamUserToken();

        if (!token || !userId) {
          throw new Error('Failed to get user token');
        }

        const client = StreamChat.getInstance(
          process.env.NEXT_PUBLIC_STREAM_API_KEY!
        );
        await client.connectUser(
          {
            id: userId,
            name: userName!,
            image: userImage || undefined,
          },
          token
        );

        const { channelType, channelId } = await createOrGetChannel(
          otherUser.id
        );

        if (!channelType || !channelId) {
          throw new Error('Failed to create channel');
        }

        const chatChannel = client.channel(channelType, channelId);
        await chatChannel.watch();

        setChatClient(client);
        setChannel(chatChannel);
      } catch (err) {
        console.error('Chat initialization error:', err);
        setError('Failed to load chat. Please try again.');
      } finally {
        setLoading(false);
      }
    }

    initializeChat();

    return () => {
      if (chatClient) {
        chatClient.disconnectUser();
      }
    };
  }, [otherUser]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-red-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            Loading chat...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-red-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 text-lg">{error}</p>
        </div>
      </div>
    );
  }

  if (!chatClient || !channel) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-red-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400">
            Unable to load chat
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-red-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="h-[calc(100vh-8rem)] bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
            <Chat client={chatClient} theme="messaging light">
              <Channel channel={channel}>
                <Window>
                  <MessageList />
                  <MessageInput />
                </Window>
              </Channel>
            </Chat>
          </div>
        </div>
      </div>
    </div>
  );
}
