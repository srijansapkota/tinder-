'use client';

import { UserProfile } from '@/lib/types';
import { getStreamUserToken, createOrGetChannel } from '@/lib/actions/stream';

import { useEffect, useRef, useState } from 'react';
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

  // Holds the live client reference so cleanup can always reach it,
  // regardless of whether the state update has committed yet.
  const clientRef = useRef<StreamChat | null>(null);

  useEffect(() => {
    // Synchronously set to true when this effect's cleanup runs.
    // Every await checkpoint below checks it before touching state or the network.
    let cancelled = false;

    async function initializeChat() {
      try {
        setError(null);

        const tokenData = await getStreamUserToken();
        if (cancelled) return;

        const { token, userId, userName, userImage } = tokenData as {
          token: string;
          userId: string;
          userName: string;
          userImage?: string;
        };
        if (!token || !userId) throw new Error('Failed to get user token');

        const client = StreamChat.getInstance(
          process.env.NEXT_PUBLIC_STREAM_API_KEY!
        );

        // Only connect if this client instance isn't already connected as
        // this user — avoids the "already connected" error on StrictMode
        // double-invoke or fast HMR reloads.
        if (client.userID !== userId) {
          await client.connectUser(
            { id: userId, name: userName, image: userImage },
            token
          );
        }

        // If cleanup fired while we were awaiting connectUser, disconnect
        // immediately and bail out so we don't leave a ghost connection.
        if (cancelled) {
          await client.disconnectUser();
          return;
        }

        clientRef.current = client;

        const { channelType, channelId } = await createOrGetChannel(
          otherUser.id
        );
        if (cancelled) return;

        if (!channelType || !channelId) throw new Error('Failed to create channel');

        const chatChannel = client.channel(channelType, channelId);
        await chatChannel.watch();
        if (cancelled) return;

        setChatClient(client);
        setChannel(chatChannel);
      } catch (err) {
        if (!cancelled) {
          console.error('Chat initialization error:', err);
          setError('Failed to load chat. Please try again.');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    initializeChat();

    return () => {
      cancelled = true;
      const client = clientRef.current;
      clientRef.current = null;
      if (client) {
        client.disconnectUser().catch(console.error);
        setChatClient(null);
        setChannel(null);
      }
    };
  // otherUser.id is a stable primitive; using the full object would
  // re-run this effect on every parent render (different object ref each time).
  }, [otherUser.id]);


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
