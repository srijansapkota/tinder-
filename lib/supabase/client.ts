import { createBrowserClient } from '@supabase/ssr';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    'Missing Supabase environment variables. Set NEXT_PUBLIC_SUPABASE_URL and one of NEXT_PUBLIC_SUPABASE_ANON_KEY / NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY / NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY.'
  );
}

export function createClient() {
  return createBrowserClient(supabaseUrl!, supabaseKey!, {
    cookies: {
      get(name: string) {
        if (typeof document === 'undefined') return '';
        return document.cookie
          .split('; ')
          .find((row) => row.startsWith(name))
          ?.split('=')[1];
      },
      set(name: string, value: string, options: { path?: string }) {
        if (typeof document === 'undefined') return;
        document.cookie = `${name}=${value}${
          options.path ? `; path=${options.path}` : ''
        }`;
      },
      remove(name: string, options: { path?: string }) {
        if (typeof document === 'undefined') return;
        document.cookie = `${name}=; max-age=0${
          options.path ? `; path=${options.path}` : ''
        }`;
      },
    },
  });
}
