import Link from "next/link";

export const EmptyChat = () => {
  return (
    <div className="min-h-screen bg-app-gradient flex items-center justify-center">
      <div className="text-center max-w-md mx-auto p-8">
        <div className="w-24 h-24 bg-lime border-2 border-ink rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-4xl">💬</span>
        </div>
        <h2 className="text-2xl font-bold text-ink mb-4">
          No Chats Yet
        </h2>
        <p className="text-ink-soft mb-6">
          Start matching with people to begin conversations!
        </p>
        <Link href="/matches" className="btn-primary">
          Find Matches
        </Link>
      </div>
    </div>
  );
};
