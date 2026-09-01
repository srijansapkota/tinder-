import { useMatchNotification } from '@/lib/hooks/useMatchNotification';
import { UserProfile } from '@/lib/types';
import Image from 'next/image';


interface MatchNotificationProps {
  match: UserProfile;
  onClose: () => void;
  onStartChat: () => void;
}

export default function MatchNotification({
  match,
  onClose,
  onStartChat,
}: MatchNotificationProps) {
  const { isVisible, handleClose, handleStartChat } = useMatchNotification({onClose, onStartChat});
  return (
    <div
      className={`fixed top-4 right-4 z-50 transition-all duration-300 ${
        isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
      }`}
    >
      <div className="bg-bone-soft border-2 border-ink rounded-lg p-6 max-w-sm" style={{ boxShadow: '6px 6px 0 var(--color-ink)' }}>
        <div className="flex items-start space-x-4">
          <div className="relative w-16 h-16 rounded-full overflow-hidden shrink-0 border-2 border-ink">
            <Image
              src={match.avatar_url || '/default-avatar.png'}
              alt={match.full_name}
              className="w-full h-full object-cover"
              width={64}
              height={64}
            />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold text-berry">
                It&apos;s a Match! 🎉
              </h3>
              <button
                onClick={handleClose}
                className="text-ink-soft hover:text-ink"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>

            <p className="text-sm text-ink-soft mb-3">
              You and <span className="font-semibold">{match.full_name}</span>{' '}
              liked each other!
            </p>

            <div className="flex space-x-2">
              <button
                onClick={handleStartChat}
                className="flex-1 btn-primary py-2 px-4 text-sm"
              >
                Start Chat
              </button>
              <button
                onClick={handleClose}
                className="flex-1 btn-outline py-2 px-4 text-sm"
              >
                Later
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
