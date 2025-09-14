import { supabase } from '../lib/supabase';
import { User, UserRole, UserStatus } from '../types';

// Helper function to handle rate limiting
const withRateLimit = async <T>(fn: () => Promise<T>): Promise<T> => {
  try {
    return await fn();
  } catch (error: any) {
    if (error.status === 429) {
      // Wait for the specified retry-after time or default to 30 seconds
      const retryAfter = error.response?.headers?.get('retry-after') || 30;
      console.warn(`Rate limited. Waiting ${retryAfter} seconds before retrying...`);
      await new Promise(resolve => setTimeout(resolve, parseInt(retryAfter) * 1000));
      return fn();
    }
    throw error;
  }
};

export const supabaseAuth = {
  // Sign in with email and password
  async signIn(email: string, password: string) {
    return withRateLimit(async () => {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        if (error.message.includes('Email not confirmed')) {
          // Resend confirmation email if not confirmed
          await this.resendConfirmationEmail(email);
          throw new Error('Please check your email to confirm your account before signing in.');
        }
        throw error;
      }
      
      return data;
    });
  },

  // Sign up with email and password
  async signUp(email: string, password: string, userData: { username: string; firstName: string; lastName: string }) {
    return withRateLimit(async () => {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: window.location.origin + '/auth/callback',
          data: {
            username: userData.username,
            first_name: userData.firstName,
            last_name: userData.lastName,
            roles: [UserRole.USER],
            status: UserStatus.PENDING_VERIFICATION,
            email_verified: false,
            phone_verified: false,
          },
        },
      });

      if (error) {
        if (error.message.includes('already registered')) {
          // Try to resend confirmation email if user exists but not verified
          await this.resendConfirmationEmail(email);
          throw new Error('This email is already registered. We\'ve resent the confirmation email.');
        }
        throw error;
      }

      return data;
    });
  },

  // Resend confirmation email
  async resendConfirmationEmail(email: string) {
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email,
      options: {
        emailRedirectTo: window.location.origin + '/auth/callback',
      },
    });
    if (error) throw error;
  },

  // Sign out
  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  // Update user profile
  async updateProfile(userData: Partial<{
    firstName: string;
    lastName: string;
    phone?: string;
    bio?: string;
    dateOfBirth?: string;
    avatar?: string;
  }>) {
    const { data, error } = await supabase.auth.updateUser({
      data: {
        first_name: userData.firstName,
        last_name: userData.lastName,
        phone: userData.phone,
        bio: userData.bio,
        date_of_birth: userData.dateOfBirth,
        avatar: userData.avatar,
      },
    });

    if (error) throw error;
    return data;
  },

  // Change password
  async changePassword(newPassword: string) {
    const { data, error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) throw error;
    return data;
  },

  async resetPassword(email: string) {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) throw error;
    return data;
  },

  // Get current user
  async getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error || !user) return null;

    // Map Supabase user to our User type
    return {
      id: user.id,
      username: user.user_metadata?.username || user.email?.split('@')[0] || '',
      email: user.email || '',
      firstName: user.user_metadata?.first_name || '',
      lastName: user.user_metadata?.last_name || '',
      avatar: user.user_metadata?.avatar,
      phone: user.phone,
      bio: user.user_metadata?.bio,
      dateOfBirth: user.user_metadata?.date_of_birth,
      roles: user.user_metadata?.roles || [UserRole.USER],
      status: user.user_metadata?.status || UserStatus.ACTIVE,
      emailVerified: user.user_metadata?.email_verified || user.email_confirmed_at !== null,
      phoneVerified: user.user_metadata?.phone_verified || user.phone_confirmed_at !== null,
      lastLoginAt: user.last_sign_in_at,
      createdAt: user.created_at,
      updatedAt: user.updated_at,
    } as User;
  },

  // Listen for auth state changes
  onAuthStateChange(callback: (user: User | null) => void) {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const user = await this.getCurrentUser();
        callback(user);
      } else {
        callback(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  },
};
