import { createClient } from '@supabase/supabase-js';

// Hardcoded Supabase configuration for testing
const supabaseUrl = 'https://cawchdhjdolihmzmdrnw.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNhd2NoZGhqZG9saWhtem1kcm53Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc4NTcxMjIsImV4cCI6MjA3MzQzMzEyMn0.Nh6QjYGgD9mUOcp5_uXSv3CdgoXBQz9dHvvC6CLOzwc';

console.log('Supabase Config: Using hardcoded values');

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

export default supabase;
