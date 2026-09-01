'use client';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { useAuth } from '@/contexts/auth-context';
import Link from 'next/link';

export default function Home() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <LoadingSpinner />
    );
  }

  return (
    <div className="min-h-screen bg-app-gradient-alt flex items-center justify-center">
      <section className="w-full">
        <div className="container mx-auto px-6 py-20 lg:py-32">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl lg:text-7xl font-bold text-ink mb-6 leading-[1.05]">
              Find your perfect
              <br />
              StreamMatch
            </h1>
            <p className="text-xl lg:text-2xl text-ink-soft mb-10 leading-relaxed">
              Connect with like-minded people through live streaming, meaningful
              conversations, and authentic connections.
            </p>

            {user ? (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/matches" className="btn-primary text-lg">
                  Start Discovering
                </Link>
                <Link href="/profile" className="btn-outline text-lg">
                  View Profile
                </Link>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/auth" className="btn-primary text-lg">
                  Get Started
                </Link>
                <Link href="/matches" className="btn-outline text-lg">
                  Explore
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
