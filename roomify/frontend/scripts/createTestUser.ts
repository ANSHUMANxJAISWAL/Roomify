import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env file
const envPath = path.resolve(__dirname, '../.env');
dotenv.config({ path: envPath });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase configuration in .env file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function createTestUser() {
  const testEmail = 'test@example.com';
  const testPassword = 'Test@1234';
  
  try {
    // First, check if user already exists
    const { data: existingUser } = await supabase.auth.admin.getUserByEmail(testEmail);
    
    if (existingUser) {
      console.log('Test user already exists. Here are the credentials:');
      console.log('Email:', testEmail);
      console.log('Password:', testPassword);
      return;
    }

    // Create new user
    const { data, error } = await supabase.auth.signUp({
      email: testEmail,
      password: testPassword,
      options: {
        data: {
          username: 'testuser',
          first_name: 'Test',
          last_name: 'User',
          roles: ['user'],
          status: 'active',
          email_verified: true
        },
        emailRedirectTo: window.location.origin + '/auth/callback'
      }
    });

    if (error) {
      console.error('Error creating test user:', error.message);
      return;
    }

    console.log('Test user created successfully!');
    console.log('Email:', testEmail);
    console.log('Password:', testPassword);
    
    // Note: In a real application, you would need to verify the email
    // For testing, you can manually verify the email in Supabase Dashboard
    console.log('\nNote: You may need to manually verify this email in Supabase Dashboard');
    console.log('Go to: https://app.supabase.com/project/YOUR_PROJECT_REF/auth/users');
    
  } catch (error) {
    console.error('Error:', error);
  }
}

createTestUser();
