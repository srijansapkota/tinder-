"use client";
 
import Link from "next/link";
 
export default function Unauthorized() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-white px-6">
      <div className="w-full max-w-sm text-center">
        <p className="font-mono text-sm tracking-widest text-neutral-400">
          401
        </p>
 
        <h1 className="mt-3 text-xl font-medium text-neutral-900">
          You don&apos;t have access to this page
        </h1>
 
        <p className="mt-2 text-sm text-neutral-500">
          Sign in with an account that has permission, or go back to the
          homepage.
        </p>
 
        <div className="mt-8 flex items-center justify-center gap-3">
          <Link
            href="/login"
            className="rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-neutral-700"
          >
            Sign in
          </Link>
          <Link
            href="/"
            className="rounded-md px-4 py-2 text-sm font-medium text-neutral-600 transition-colors hover:text-neutral-900"
          >
            Go home
          </Link>
        </div>
      </div>
    </main>
  );
}
 