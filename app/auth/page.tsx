'use client';

import { useAuthForm } from "@/lib/hooks/useAuthForm";

export default function AuthPage() {
  const {
    isSignUp,
    setIsSignUp,
    email,
    setEmail,
    password,
    setPassword,
    loading,
    error,
    handleAuth,
  } = useAuthForm();

  return (
    <div className="min-h-screen flex items-center justify-center bg-bone">
      <div className="max-w-md w-full space-y-8 p-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-ink mb-2">
            DateYaFate
          </h1>
          <p className="text-ink-soft">
            {isSignUp ? 'Create Your Account' : 'Sign in to your account'}
          </p>
        </div>

        <form className="space-y-6" onSubmit={handleAuth}>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-ink"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border-2 border-ink rounded-lg placeholder-ink-soft focus:outline-none focus:ring-2 focus:ring-lime bg-bone-soft text-ink"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-ink"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border-2 border-ink rounded-lg placeholder-ink-soft focus:outline-none focus:ring-2 focus:ring-lime bg-bone-soft text-ink"
              placeholder="Enter your password"
            />
          </div>

          {error && (
            <div className="text-flame text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full"
          >
            {loading ? 'Loading...' : isSignUp ? 'Sign Up' : 'Sign In'}
          </button>
        </form>

        <div className="text-center">
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-ink-soft hover:text-ink text-sm underline underline-offset-4"
          >
            {isSignUp
              ? 'Already have an account? Sign in'
              : "Don't have an account? Sign up"}
          </button>
        </div>
      </div>
    </div>
  );
}
