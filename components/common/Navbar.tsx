'use client';
import { useAuth } from '@/contexts/auth-context';
import Link from 'next/link';

export default function Navbar() {
  const { signOut, user } = useAuth();
  return (
    <nav className="relative z-50 bg-app-gradient border-b-2 border-ink">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center space-x-3">
            <span className="text-xl font-bold text-ink">
              DateYaFate
            </span>
          </Link>

          {user && (
            <div className="hidden md:flex items-center space-x-8">
              <Link
                href="/matches"
                className="text-ink-soft hover:text-ink font-medium transition-colors duration-150"
              >
                Discover
              </Link>
              <Link
                href="/matches/list"
                className="text-ink-soft hover:text-ink font-medium transition-colors duration-150"
              >
                Matches
              </Link>
              <Link
                href="/chat"
                className="text-ink-soft hover:text-ink font-medium transition-colors duration-150"
              >
                Messages
              </Link>
              <Link
                href="/profile"
                className="text-ink-soft hover:text-ink font-medium transition-colors duration-150"
              >
                Profile
              </Link>
            </div>
          )}

          {user ? (
            <button onClick={signOut} className="btn-outline py-2 px-4 text-sm">
              Sign Out
            </button>
          ) : (
            <Link href="/auth" className="btn-primary py-2 px-4 text-sm">
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
