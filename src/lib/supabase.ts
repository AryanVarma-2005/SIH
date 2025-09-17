import { createClient } from '@supabase/supabase-js';
import { Database } from './database.types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Helper function to get current user profile
export const getCurrentUserProfile = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  return profile;
};

// Helper function to create or update user profile
export const upsertUserProfile = async (profileData: {
  id: string;
  name: string;
  role: 'citizen' | 'admin';
  department?: string;
  credits?: number;
  location_lat?: number;
  location_lng?: number;
  location_address?: string;
}) => {
  const { data, error } = await supabase
    .from('profiles')
    .upsert(profileData)
    .select()
    .single();

  if (error) throw error;
  return data;
};