import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import appConfig from '../../app.json';

const supabaseUrl = process.env.SUPABASE_URL || appConfig.extra?.supabaseUrl;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || appConfig.extra?.supabaseAnonKey;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase is not configured. Set SUPABASE_URL and SUPABASE_ANON_KEY.');
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-anon-key',
  {
    auth: {
      storage: AsyncStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  },
);