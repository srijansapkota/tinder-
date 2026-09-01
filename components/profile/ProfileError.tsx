interface ProfileErrorProps {
  message?: string | null;
  onRetry: () => void;
}

export default function ProfileError({ message, onRetry }: ProfileErrorProps) {
  return (
    <div className="min-h-screen bg-app-gradient flex items-center justify-center">
      <div className="text-center max-w-md mx-auto p-8">
        <div className="w-24 h-24 bg-bone-soft border-2 border-flame rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-4xl">❌</span>
        </div>
        <h2 className="text-2xl font-bold text-ink mb-4">
          Profile not found
        </h2>
        <p className="text-ink-soft mb-6">
          {message || 'Unable to load your profile. Please try again.'}
        </p>
        <button onClick={onRetry} className="btn-primary">
          Retry
        </button>
      </div>
    </div>
  );
}
