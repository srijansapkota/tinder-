'use client';

export default function LoadingSpinner() {
  return (
    <div className="min-h-screen bg-app-gradient flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-ink mx-auto"></div>
        <p className="mt-4 text-ink-soft">
          Loading your matches...
        </p>
      </div>
    </div>
  );
}
