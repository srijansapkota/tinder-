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
import { useRouter } from 'next/navigation';
import { getStreamVideoToken, createVideoCall } from '@/lib/actions/stream';

interface StreamVideoInterfaceProps {
  otherUserId: string;
  onClose: () => void;
}

export default function StreamVideoInterface({
  otherUserId,
  onClose,
}: StreamVideoInterfaceProps) {
  const router = useRouter();
  const [client, setClient] = useState<StreamVideoClient | null>(null);
  const [call, setCall] = useState<ReturnType<
    StreamVideoClient['call']
  > | null>(null);
  const [loading, setLoading] = useState(false);
  const [shouldStart, setShouldStart] = useState(false);
  const hasLeft = useRef(false);
  const [error, setError] = useState<string | null>(null);

  function isAlreadyLeftError(err: unknown): boolean {
    return err instanceof Error && err.message.includes('already been left');
  }

  const handleLeave = useCallback(async () => {
    if (hasLeft.current) return;
    hasLeft.current = true;
    if (call) {
      try {
        await call.leave();
      } catch (e) {
        if (!isAlreadyLeftError(e)) {
          console.error('Error leaving call:', e);
        }
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
    router.push('/chat');
  }, [call, client, onClose, router]);

  useEffect(() => {
    if (!shouldStart) return;

    let myClient: StreamVideoClient | null = null;
    let myCall: ReturnType<StreamVideoClient['call']> | null = null;

    async function initVideoCall() {
      try {
        setLoading(true);
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
          myCall.leave().catch((e) => {
            if (!isAlreadyLeftError(e)) {
              console.error('Error leaving call during cleanup:', e);
            }
          });
        }
        if (myClient) {
          myClient.disconnectUser().catch(console.error);
        }
      }
    };
  }, [otherUserId, shouldStart]);

  if (!shouldStart) {
    return (
      <div className="fixed inset-0 z-50 bg-gray-900 flex items-center justify-center">
        <div className="text-center space-y-4 px-6">
          <h2 className="text-white text-2xl font-semibold">
            Ready to start video call?
          </h2>
          <p className="text-gray-300">
            Click below to initialize camera/audio.
          </p>
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => setShouldStart(true)}
              className="px-6 py-2 bg-lime hover:bg-lime-dark text-ink rounded-full font-medium transition-colors"
            >
              Start Call
            </button>
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-full font-medium transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-lime mx-auto" />
          <p className="mt-4 text-white text-lg">Connecting call...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 z-50 bg-gray-900 flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-flame text-lg">{error}</p>
          <button
            onClick={onClose}
            className="px-6 py-2 bg-lime hover:bg-lime-dark text-ink rounded-full font-medium transition-colors"
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
              <div className="absolute top-0 left-0 right-0 z-10 px-6 py-4 bg-linear-to-b from-gray-900/80 to-transparent">
                <h2 className="text-white font-semibold text-lg">Video Call</h2>
              </div>

              {/* Video layout */}
              <div className="flex-1">
                <SpeakerLayout />
              </div>

              {/* Call controls */}
              <div className="absolute bottom-0 left-0 right-0 flex justify-center pb-6 bg-linear-to-t from-gray-900/80 to-transparent">
                <CallControls onLeave={handleLeave} />
              </div>
            </div>
          </StreamCall>
        </StreamTheme>
      </StreamVideo>
    </div>
  );
}
