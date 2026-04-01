# StreamMatch Dating App - AI Coding Agent Instructions## Architecture OverviewThis is a **Next.js 15 (Turbopack) dating app** with Supabase backend, Stream Chat/Video integration, and a Tinder-like matching system.**Key Tech Stack:**- Next.js 15.5.4 with App Router & Turbopack- Supabase (auth, database, RLS)- Stream Chat & Video SDK for real-time messaging- TypeScript, Tailwind CSS 4## Project Structure`app/              - Next.js App Router pages (Client Components)lib/  actions/        - Server Actions ('use server')  supabase/       - Supabase client factories  types/          - Centralized TypeScript interfaces  helpers/        - Utility functions (calculateAge, etc.)contexts/         - React Context providers (Client Components)components/       - Reusable UI componentsdatabase/         - Database schema (single source of truth)scripts/          - Utility scripts (run with tsx)`## Critical Database Architecture**Automatic Match Creation via Database Trigger:**- When a user likes someone, insert into `likes` table ONLY- Database trigger `create_match_on_mutual_like()` automatically creates match when both users like each other- Trigger uses `LEAST/GREATEST` to consistently order `user1_id` and `user2_id` in matches table- **NEVER manually insert into matches table** from application code- Check for matches by querying with sorted user IDs (see `likeUser()` in `lib/actions/matches.ts`)**Database Tables:**- `users` - extends auth.users with profile data, JSONB preferences, location- `likes` - has UNIQUE(from*user_id, to_user_id) constraint- `matches` - has UNIQUE(user1_id, user2_id) constraint, `is_active` boolean**Schema Location:** Complete schema in `database/schema.sql` - run in Supabase SQL Editor**RLS Policy Critical:** Users need to see all profiles for matching:`sqlCREATE POLICY "Authenticated users can view all profiles" ON public.users    FOR SELECT USING (auth.role() = 'authenticated');`## Supabase Client Pattern (Critical)**Two separate Supabase clients - NEVER mix them:**1. **Server-side** (`lib/supabase/server.ts`): For Server Actions, Server Components - `await createClient()` - async, uses Next.js cookies() - Uses `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`2. **Client-side** (`lib/supabase/client.ts`): For Client Components, hooks - `createClient()` - sync, uses document.cookie - Uses `NEXT_PUBLIC_SUPABASE_ANON_KEY`**Server Actions Pattern:**- All actions in `lib/actions/*` are `'use server'` functions- Always get user with: `const { data: { user } } = await supabase.auth.getUser()`- Check authentication before any DB operation## Environment Variables Required`env# SupabaseNEXT_PUBLIC_SUPABASE_URL=NEXT_PUBLIC_SUPABASE_ANON_KEY=          # Client-sideNEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=   # Server-side (can be same as ANON_KEY)# Stream Chat/VideoNEXT_PUBLIC_STREAM_API_KEY=STREAM_API_SECRET=                       # Server-only`## Stream Chat/Video Integration- Server creates tokens in `lib/actions/stream.ts` using `StreamChat.getInstance()` with secret- Client connects in `components/StreamChatInterface.tsx` with token from server- Channel IDs generated via deterministic hash: `match*${hash(sorted_user_ids)}`- Requires mutual match verification before creating chat channel## Key Workflows**Development:**```bashnpm run dev                    # Start with Turbopack (default)npm run create-fake-profiles   # Generate test users via scripts/create-fake-profile.ts```**Matching Flow:**1. `getPotentialMatches()`fetches users filtered by gender preferences2. User swipes →`likeUser(toUserId)`checks for existing like, then inserts3. Database trigger auto-creates match if mutual like exists4.`likeUser()`checks matches table and returns`isMatch: true`with matched user5. Client shows match notification, enables chat**Chat Flow:**1. Verify mutual match exists in`matches`table2.`getStreamUserToken()`creates/updates Stream user and returns token3.`createOrGetChannel()`generates deterministic channel ID from sorted user IDs4. Client connects to Stream and joins channel## Project-Specific Patterns**Type Definitions:** All interfaces centralized in`lib/types/index.ts`- `UserProfile`- Main user interface-`UserPreferences`- User preference settings- Import with:`import { UserProfile } from '@/lib/types'`**Helper Functions:** Located in `lib/helpers/`- `calculateAge(birthdate: string)`- Age calculation logic (DRY principle)- Import with:`import { calculateAge } from '@/lib/helpers/calculate-age'`**Auth Context:** `contexts/auth-context.tsx`provides global auth state via`AuthProvider` in layout**Duplicate Prevention:** Always check if like/match exists before inserting to avoid unique constraint violations**Error Handling in Actions:**```typescripttry {  // action logic} catch (error) {  console.error('Detailed context:', error);  throw new Error(`User-friendly message: ${error.message}`);}```**JSONB Preferences Structure:**```typescript{  age_range: { min: 18, max: 50 },  distance: 25,  gender_preference: ['male', 'female']  // array}```## Code Quality Standards**DRY (Don't Repeat Yourself):**- Use centralized types from `lib/types/`- Use helper functions from `lib/helpers/`- Avoid duplicate logic across components**KISS (Keep It Simple, Stupid):**- One file per concern

- Clear, descriptive function names
- Minimal abstractions
- Consistent spacing (1 blank line between logical blocks)

## Common Issues & Solutions

**"duplicate key value violates unique constraint":**

- Check if like/match exists before inserting
- Don't manually create matches - let database trigger handle it

**Can't see other users:**

- Missing RLS policy to view all user profiles (see Database section above)

**Stream Chat errors:**

- Verify match exists before creating channel
- Ensure both NEXT_PUBLIC_STREAM_API_KEY and STREAM_API_SECRET are set
- Token must be created server-side with secret key

**Server vs Client Supabase:**

- Use `await createClient()` in Server Actions/Components
- Use `createClient()` (no await) in Client Components
- Check which env vars each client expects

## File Organization

```
app/              - Pages (Client Components by default)
  matches/        - Swipe interface
  chat/           - Message list and conversations
  profile/        - User profile pages
lib/
  actions/        - Server Actions ('use server')
  supabase/       - Client factories
  types/          - TypeScript interfaces
  helpers/        - Utility functions
contexts/         - React Context providers
components/       - Reusable UI components
database/         - Database schema files
scripts/          - Utility scripts
```
