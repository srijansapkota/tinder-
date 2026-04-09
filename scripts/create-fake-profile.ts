import { createClient } from '@supabase/supabase-js';
import { faker } from '@faker-js/faker';
import { config as dotenvConfig } from 'dotenv';
import path from 'path';

dotenvConfig({ path: path.resolve(process.cwd(), '.env.local') });
dotenvConfig({ path: path.resolve(process.cwd(), '.env') });

// Configuration
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const PASSWORD = 'password';

if (!SUPABASE_URL || !SUPABASE_KEY) {
  throw new Error(
    'Missing Supabase environment variables for seed script. Set NEXT_PUBLIC_SUPABASE_URL and one of NEXT_PUBLIC_SUPABASE_ANON_KEY / NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY / NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY in .env.local.'
  );
}

function createSupabaseClient() {
  return createClient(SUPABASE_URL!, SUPABASE_KEY!);
}

function createServiceRoleClient() {
  if (!SUPABASE_SERVICE_ROLE_KEY) return null;
  return createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY);
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

type FakeProfile = {
  full_name: string;
  username: string;
  email: string;
  gender: 'male' | 'female' | 'other';
  birthdate: string;
  bio: string;
  avatar_url: string;
  preferences: {
    age_range: { min: number; max: number };
    distance: number;
    gender_preference: ('male' | 'female' | 'other')[];
  };
};

// Fake profile data
const baseFakeProfiles: FakeProfile[] = [
  {
    full_name: 'Sarah Johnson',
    username: 'sarah_j',
    email: 'sarah.johnson@example.com',
    gender: 'female' as const,
    birthdate: '1995-03-15',
    bio: 'Love hiking, coffee, and good conversations. Looking for someone to explore the world with! 🌍',
    avatar_url: ' ',
    preferences: {
      age_range: { min: 25, max: 35 },
      distance: 50,
      gender_preference: ['male'],
    },
  },
  {
    full_name: 'Alex Chen',
    username: 'alex_c',
    email: 'alex.chen@example.com',
    gender: 'female' as const,
    birthdate: '1992-07-22',
    bio: 'Passionate about photography and travel. Always up for an adventure! 📸✈️',
    avatar_url:
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face',
    preferences: {
      age_range: { min: 28, max: 38 },
      distance: 30,
      gender_preference: ['male'],
    },
  },
  {
    full_name: 'Emma Wilson',
    username: 'emma_w',
    email: 'emma.wilson@example.com',
    gender: 'female' as const,
    birthdate: '1990-11-08',
    bio: 'Book lover and yoga enthusiast. Seeking someone who values personal growth and meaningful conversations. 📚🧘‍♀️',
    avatar_url:
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop&crop=face',
    preferences: {
      age_range: { min: 30, max: 40 },
      distance: 25,
      gender_preference: ['male'],
    },
  },
  {
    full_name: 'Michael Rodriguez',
    username: 'mike_r',
    email: 'michael.rodriguez@example.com',
    gender: 'male' as const,
    birthdate: '1988-05-12',
    bio: 'Tech enthusiast and fitness lover. Looking for someone to share adventures and good food with! 💻🏋️‍♂️',
    avatar_url:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
    preferences: {
      age_range: { min: 25, max: 35 },
      distance: 40,
      gender_preference: ['female'],
    },
  },
  {
    full_name: 'Jessica Kim',
    username: 'jess_k',
    email: 'jessica.kim@example.com',
    gender: 'female' as const,
    birthdate: '1993-09-18',
    bio: 'Artist and coffee addict. Love exploring new places and meeting interesting people. 🎨☕',
    avatar_url:
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop&crop=face',
    preferences: {
      age_range: { min: 26, max: 36 },
      distance: 35,
      gender_preference: ['male'],
    },
  },
  {
    full_name: 'David Thompson',
    username: 'dave_t',
    email: 'david.thompson@example.com',
    gender: 'male' as const,
    birthdate: '1989-12-03',
    bio: 'Musician and outdoor enthusiast. Guitar, hiking, and good vibes only! 🎸🏔️',
    avatar_url:
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
    preferences: {
      age_range: { min: 24, max: 34 },
      distance: 45,
      gender_preference: ['female'],
    },
  },
  {
    full_name: 'Sophie Martin',
    username: 'sophie_m',
    email: 'sophie.martin@example.com',
    gender: 'female' as const,
    birthdate: '1994-02-28',
    bio: 'Foodie and travel blogger. Always on the hunt for the best restaurants and hidden gems! 🍕✈️',
    avatar_url:
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=400&fit=crop&crop=face',
    preferences: {
      age_range: { min: 27, max: 37 },
      distance: 30,
      gender_preference: ['male'],
    },
  },
  {
    full_name: 'Ryan Park',
    username: 'ryan_p',
    email: 'ryan.park@example.com',
    gender: 'male' as const,
    birthdate: '1991-06-14',
    bio: 'Entrepreneur and fitness coach. Passionate about helping others achieve their goals! 💪🚀',
    avatar_url:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face',
    preferences: {
      age_range: { min: 25, max: 35 },
      distance: 50,
      gender_preference: ['female'],
    },
  },
  {
    full_name: 'Isabella Garcia',
    username: 'bella_g',
    email: 'isabella.garcia@example.com',
    gender: 'female' as const,
    birthdate: '1996-08-07',
    bio: 'Dance instructor and fitness enthusiast. Love spreading positivity and good energy! 💃✨',
    avatar_url:
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=400&fit=crop&crop=face',
    preferences: {
      age_range: { min: 23, max: 33 },
      distance: 25,
      gender_preference: ['male'],
    },
  },
  {
    full_name: 'James Anderson',
    username: 'james_a',
    email: 'james.anderson@example.com',
    gender: 'male' as const,
    birthdate: '1987-04-25',
    bio: 'Software engineer and board game enthusiast. Looking for someone to share nerdy adventures with! 👨‍💻🎲',
    avatar_url:
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop&crop=face',
    preferences: {
      age_range: { min: 26, max: 36 },
      distance: 40,
      gender_preference: ['female'],
    },
  },
];

const nepaliMaleProfiles = [
  'Aarav Shrestha',
  'Rohan Karki',
  'Sujan Gurung',
  'Bikash Poudel',
  'Niraj Bhandari',
  'Kiran Adhikari',
  'Prabin Rai',
  'Suman Thapa',
  'Roshan Lama',
  'Dipesh Basnet',
];

const nepaliFemaleProfiles = [
  'Anisha Shrestha',
  'Prakriti Karki',
  'Sanjana Gurung',
  'Mina Poudel',
  'Ritu Bhandari',
  'Kabita Adhikari',
  'Nisha Rai',
  'Smriti Thapa',
  'Aakriti Lama',
  'Sushmita Basnet',
];

function generateNepaliProfiles(): FakeProfile[] {
  const maleProfiles: FakeProfile[] = nepaliMaleProfiles.map(
    (fullName, index) => {
      const firstName = fullName.split(' ')[0].toLowerCase();
      const emailSuffix = 200 + index;
      const birthYear = 1989 + (index % 8);

      return {
        full_name: fullName,
        username: `${firstName}_np_m${index + 1}`,
        email: `${firstName}.np${emailSuffix}@example.com`,
        gender: 'male',
        birthdate: `${birthYear}-0${(index % 9) + 1}-1${index % 9}`,
        bio: 'Kathmandu-based and family-oriented. I enjoy mountain walks, momo nights, and meaningful conversations.',
        avatar_url: '',
        preferences: {
          age_range: { min: 22 + (index % 4), max: 33 + (index % 5) },
          distance: 20 + index * 2,
          gender_preference: ['female'],
        },
      };
    }
  );

  const femaleProfiles: FakeProfile[] = nepaliFemaleProfiles.map(
    (fullName, index) => {
      const firstName = fullName.split(' ')[0].toLowerCase();
      const emailSuffix = 300 + index;
      const birthYear = 1991 + (index % 8);

      return {
        full_name: fullName,
        username: `${firstName}_np_f${index + 1}`,
        email: `${firstName}.np${emailSuffix}@example.com`,
        gender: 'female',
        birthdate: `${birthYear}-1${(index % 2) + 1}-0${(index % 9) + 1}`,
        bio: 'Creative and curious. I love Nepali food, short hikes, and building genuine connections.',
        avatar_url: '',
        preferences: {
          age_range: { min: 24 + (index % 4), max: 36 + (index % 5) },
          distance: 18 + index * 2,
          gender_preference: ['male'],
        },
      };
    }
  );

  return [...maleProfiles, ...femaleProfiles];
}

const fakeProfiles: FakeProfile[] = [
  ...baseFakeProfiles,
  ...generateNepaliProfiles(),
];

async function createFakeProfiles() {
  console.log('🚀 Starting to create fake profiles...');

  const adminClient = createServiceRoleClient();
  if (!adminClient) {
    console.log(
      'ℹ️ Seeding with public key (anon/publishable). If your Supabase project requires email confirmations, signUp will hit email rate limits. For best results, either disable email confirmations in Supabase Auth settings for dev, or set SUPABASE_SERVICE_ROLE_KEY in .env.local and rerun.'
    );
  }

  for (let i = 0; i < fakeProfiles.length; i++) {
    const profile = fakeProfiles[i];

    try {
      console.log(
        `\n📝 Creating profile ${i + 1}/${fakeProfiles.length}: ${profile.full_name}`
      );

      // Prefer service-role (no emails, no RLS restrictions)
      if (adminClient) {
        // 1) Create (or reuse) auth user
        const { data: usersList, error: listError } =
          await adminClient.auth.admin.listUsers();
        if (listError) {
          console.error('❌ Error listing users:', listError);
          continue;
        }

        const existing = usersList.users.find((u) => u.email === profile.email);

        const authUser = existing
          ? existing
          : (
              await adminClient.auth.admin.createUser({
                email: profile.email,
                password: PASSWORD,
                email_confirm: true,
                user_metadata: {
                  full_name: profile.full_name,
                  username: profile.username,
                },
              })
            ).data.user;

        if (!authUser) {
          console.error(
            `❌ Failed to create/find auth user for ${profile.full_name}`
          );
          continue;
        }

        const userId = authUser.id;

        // 2) Upsert profile in public.users (service role bypasses RLS)
        const { error: upsertError } = await adminClient.from('users').upsert(
          {
            id: userId,
            full_name: profile.full_name,
            username: profile.username,
            email: profile.email,
            gender: profile.gender,
            birthdate: profile.birthdate,
            bio: profile.bio,
            avatar_url: profile.avatar_url,
            preferences: profile.preferences,
            location_lat: faker.location.latitude({ min: 37.7, max: 37.8 }),
            location_lng: faker.location.longitude({
              min: -122.5,
              max: -122.4,
            }),
            is_verified: true,
            is_online: Math.random() > 0.5,
          },
          { onConflict: 'id' }
        );

        if (upsertError) {
          console.error(
            `❌ Error upserting profile for ${profile.full_name}:`,
            upsertError
          );
          continue;
        }

        console.log(`✅ Profile created successfully for ${profile.full_name}`);
        console.log(`   📧 Email: ${profile.email}`);
        console.log(`   🔑 Password: ${PASSWORD}`);
        console.log(`   👤 Username: ${profile.username}`);
        continue;
      }

      // Fallback: public key flow
      const client = createSupabaseClient();

      // 1) Create or sign in the auth user using the public key.
      // Note: If email confirmation is enabled in your Supabase project,
      // signUp may return no session (can't update profile fields via RLS).
      let userId: string | null = null;
      let hasSession = false;

      const signUpRes = await client.auth.signUp({
        email: profile.email,
        password: PASSWORD,
        options: {
          data: {
            full_name: profile.full_name,
            username: profile.username,
          },
        },
      });

      if (signUpRes.error) {
        const authErrorCode = (signUpRes.error as { code?: string }).code;
        if (authErrorCode === 'over_email_send_rate_limit') {
          console.error(
            '❌ Supabase email rate limit exceeded while signing up users. To seed reliably, either disable email confirmations in Supabase Auth settings (dev only) or set SUPABASE_SERVICE_ROLE_KEY in .env.local and rerun.'
          );
          break;
        }

        const message = signUpRes.error.message.toLowerCase();
        const alreadyExists =
          message.includes('already') ||
          message.includes('registered') ||
          message.includes('exists');

        if (!alreadyExists) {
          console.error(
            `❌ Error signing up ${profile.full_name}:`,
            signUpRes.error
          );
          continue;
        }

        const signInRes = await client.auth.signInWithPassword({
          email: profile.email,
          password: PASSWORD,
        });

        if (signInRes.error) {
          console.error(
            `❌ Error signing in ${profile.full_name}:`,
            signInRes.error
          );
          continue;
        }

        userId = signInRes.data.user?.id ?? null;
        hasSession = !!signInRes.data.session;
      } else {
        userId = signUpRes.data.user?.id ?? null;
        hasSession = !!signUpRes.data.session;
      }

      if (!userId) {
        console.error(
          `❌ Could not determine user id for ${profile.full_name}`
        );
        continue;
      }

      // 2) Update profile fields (requires session due to RLS update policy)
      if (!hasSession) {
        console.log(
          `⚠️ Created auth user for ${profile.full_name}, but no session was returned (email confirmation likely enabled). Profile row was created by DB trigger; to fully seed profile fields, disable email confirmations for dev or use a service-role seed approach.`
        );
        continue;
      }

      const { error: updateError } = await client
        .from('users')
        .update({
          full_name: profile.full_name,
          username: profile.username,
          email: profile.email,
          gender: profile.gender,
          birthdate: profile.birthdate,
          bio: profile.bio,
          avatar_url: profile.avatar_url,
          preferences: profile.preferences,
          location_lat: faker.location.latitude({ min: 37.7, max: 37.8 }),
          location_lng: faker.location.longitude({ min: -122.5, max: -122.4 }),
          is_verified: true,
          is_online: Math.random() > 0.5,
        })
        .eq('id', userId);

      if (updateError) {
        console.error(
          `❌ Error updating profile for ${profile.full_name}:`,
          updateError
        );
        continue;
      }

      console.log(`✅ Profile created successfully for ${profile.full_name}`);
      console.log(`   📧 Email: ${profile.email}`);
      console.log(`   🔑 Password: ${PASSWORD}`);
      console.log(`   👤 Username: ${profile.username}`);

      // Avoid hammering auth/email endpoints in public-key mode
      await sleep(750);
    } catch (error) {
      console.error(
        `❌ Unexpected error creating profile for ${profile.full_name}:`,
        error
      );
    }
  }

  console.log('\n🎉 Fake profile creation completed!');
  console.log('\n📋 Summary:');
  console.log('All accounts use password: "password"');
  if (SUPABASE_SERVICE_ROLE_KEY) {
    console.log('Emails are auto-confirmed (service-role mode)');
    console.log('Profiles include random location data in San Francisco area');
    console.log('Some users are marked as online for testing');
  } else {
    console.log(
      'If email confirmation is enabled, signups may be created without sessions and profile fields may not be fully updated.'
    );
  }
}

// Run the script
createFakeProfiles().catch(console.error);
