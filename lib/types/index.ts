export interface UserProfile {
  id: string;
  full_name: string;
  username: string;
  email: string;
  gender: 'male' | 'female' | 'other';
  birthdate: string;
  bio: string;
  avatar_url: string | null;
  location_lat?: number;
  location_lng?: number;
  last_active: string;
  is_verified: boolean;
  is_online: boolean;
  created_at: string;
  updated_at: string;
}