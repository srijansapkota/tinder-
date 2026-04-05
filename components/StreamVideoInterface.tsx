'use client';

import '@stream-io/video-react-sdk/dist/css/styles.css';
import {
  CallControls,
  SpeakerLayout,
  StreamCall,
  StreamTheme,
  StreamVideo,
  StreamVideoClient,
} from '@stream-io/video-react-sdk';
import { useEffect, useRef, useState, useCallback } from 'react';
import { getStreamVideoToken, createVideoCall } from '@/lib/actions/stream';

interface StreamVideoInterfaceProps {
  otherUserId: string;
  onClose: () => void;
}

export default function StreamVideoInterface({
  otherUserId,
  onClose,
}: StreamVideoInterfaceProps) {
  const [client, setClient] = useState<StreamVideoClient | null>(null);
  const [call, setCall] = useState<ReturnType<StreamVideoClient['call']> | null>(null);
  const [loading, setLoading] = useState(true);
  const hasLeft = useRef(false);
  const [error, setError] = useState<string | null>(null);

  const handleLeave = useCallback(async () => {
    if (hasLeft.current) return;
    hasLeft.current = true;
    if (call) {
      try {
        await call.leave();
      } catch (e) {
        console.error('Error leaving call:', e);
      }
    }
    if (client) {
      try {
        await client.disconnectUser();
      } catch (e) {
        console.error('Error disconnecting video client:', e);
      }
    }
    onClose();
  }, [call, client, onClose]);

  useEffect(() => {
    let myClient: StreamVideoClient | null = null;
    let myCall: ReturnType<StreamVideoClient['call']> | null = null;

    async function initVideoCall() {
      try {
        setError(null);

        // Get the video token for the current user
        const tokenData = await getStreamVideoToken();
        if (!tokenData || 'error' in tokenData) {
          throw new Error('Failed to get video token');
        }
        const { token, userId, userName, userImage } = tokenData;

        // Get a deterministic call ID for this match pair
        const callData = await createVideoCall(otherUserId);
        if (!callData || 'error' in callData) {
          throw new Error('Failed to create video call');
        }
        const { callId, callType } = callData;

        // Initialize Stream Video client
        myClient = new StreamVideoClient({
          apiKey: process.env.NEXT_PUBLIC_STREAM_API_KEY!,
          user: {
            id: userId,
            name: userName ?? undefined,
            image: userImage ?? undefined,
          },
          token,
        });

        // Get or create the call
        myCall = myClient.call(callType, callId);
        await myCall.join({ create: true });

        setClient(myClient);
        setCall(myCall);
      } catch (err) {
        console.error('Video call initialization error:', err);
        setError('Failed to start video call. Please try again.');
      } finally {
        setLoading(false);
      }
    }

    initVideoCall();

    // Cleanup on unmount — only runs if handleLeave hasn't already cleaned up
    return () => {
      if (!hasLeft.current) {
        hasLeft.current = true;
        if (myCall) {
          myCall.leave().catch(console.error);
        }
        if (myClient) {
          myClient.disconnectUser().catch(console.error);
        }
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [otherUserId]);

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-pink-500 mx-auto" />
          <p className="mt-4 text-white text-lg">Connecting call...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 z-50 bg-gray-900 flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-red-400 text-lg">{error}</p>
          <button
            onClick={onClose}
            className="px-6 py-2 bg-pink-500 hover:bg-pink-600 text-white rounded-full font-medium transition-colors"
          >
            Back to Chat
          </button>
        </div>
      </div>
    );
  }

  if (!client || !call) return null;

  return (
    <div className="fixed inset-0 z-50 bg-gray-900">
      <StreamVideo client={client}>
        <StreamTheme>
          <StreamCall call={call}>
            <div className="relative h-full w-full flex flex-col">
              {/* Header bar */}
              <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-6 py-4 bg-gradient-to-b from-gray-900/80 to-transparent">
                <h2 className="text-white font-semibold text-lg">Video Call</h2>
                <button
                  onClick={handleLeave}
                  className="text-gray-300 hover:text-white text-sm underline transition-colors"
                >
                  End Call
                </button>
              </div>

              {/* Video layout */}
              <div className="flex-1">
                <SpeakerLayout />
              </div>

              {/* Call controls */}
              <div className="absolute bottom-0 left-0 right-0 flex justify-center pb-6 bg-gradient-to-t from-gray-900/80 to-transparent">
                <CallControls onLeave={handleLeave} />
              </div>
            </div>
          </StreamCall>
        </StreamTheme>
      </StreamVideo>
    </div>
  );
}
