import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { User, UserRole, UserStatus } from '../types';
import { toast } from 'sonner';

// Define the shape of the auth context
export interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: { 
    email: string; 
    password: string; 
    username: string; 
    firstName: string; 
    lastName: string;
    acceptTerms: boolean;
  }) => Promise<boolean>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  resendVerificationEmail: (email: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

// Create the auth context
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Logout function
  const logout = async (): Promise<void> => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      setUser(null);
      // Navigation will be handled by components that use this context
      toast.success('Logged out successfully');
    } catch (error: any) {
      console.error('Logout error:', error);
      toast.error(error.message || 'Failed to log out');
    } finally {
      setLoading(false);
    }
  };

  // Register function
  const register = async (userData: {
    email: string;
    password: string;
    username: string;
    firstName: string;
    lastName: string;
    acceptTerms: boolean;
  }): Promise<boolean> => {
    try {
      setLoading(true);
      
      // Create auth user
      const { data, error } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          data: {
            username: userData.username,
            first_name: userData.firstName,
            last_name: userData.lastName,
          },
        },
      });

      if (error) throw error;
      
      if (data.user) {
        // Create user profile
        const { error: profileError } = await supabase.from('profiles').insert([
          {
            id: data.user.id,
            username: userData.username,
            first_name: userData.firstName,
            last_name: userData.lastName,
            email: userData.email,
            role: UserRole.USER,
            status: UserStatus.PENDING_VERIFICATION,
          },
        ]);

        if (profileError) throw profileError;

        toast.success('Registration successful! Please check your email to verify your account, then sign in.');
        return true;
      }
      
      return false;
    } catch (error: any) {
      console.error('Registration error:', error);
      toast.error(error.message || 'Failed to register');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Update profile function
  const updateProfile = async (updates: Partial<User>): Promise<void> => {
    if (!user) return;
    
    try {
      setLoading(true);
      
      // Update auth user
      const { error: authError } = await supabase.auth.updateUser({
        data: {
          first_name: updates.firstName,
          last_name: updates.lastName,
        },
      });
      
      if (authError) throw authError;
      
      // Update profile in database
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          username: updates.username,
          first_name: updates.firstName,
          last_name: updates.lastName,
          avatar: updates.avatar,
          phone: updates.phone,
          bio: updates.bio,
          date_of_birth: updates.dateOfBirth,
        })
        .eq('id', user.id);
        
      if (profileError) throw profileError;
      
      // Update local user state
      setUser({
        ...user,
        ...updates,
      });
      
      toast.success('Profile updated successfully');
    } catch (error: any) {
      console.error('Update profile error:', error);
      toast.error(error.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  // Change password function
  const changePassword = async (currentPassword: string, newPassword: string): Promise<void> => {
    try {
      setLoading(true);
      
      // First, re-authenticate the user
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user?.email || '',
        password: currentPassword,
      });
      
      if (signInError) throw signInError;
      
      // Then update the password
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      });
      
      if (updateError) throw updateError;
      
      toast.success('Password changed successfully');
    } catch (error: any) {
      console.error('Change password error:', error);
      toast.error(error.message || 'Failed to change password');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Resend verification email function
  const resendVerificationEmail = async (email: string): Promise<void> => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/verify-email`,
        },
      });
      
      if (error) throw error;
      
      toast.success('Verification email sent. Please check your inbox.');
    } catch (error: any) {
      console.error('Resend verification email error:', error);
      toast.error(error.message || 'Failed to resend verification email');
    } finally {
      setLoading(false);
    }
  };

  // Reset password function
  const resetPassword = async (email: string): Promise<void> => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      if (error) throw error;
      
      toast.success('Password reset email sent. Please check your inbox.');
    } catch (error: any) {
      console.error('Reset password error:', error);
      toast.error(error.message || 'Failed to send password reset email');
    } finally {
      setLoading(false);
    }
  };

  // Login function
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      
      if (data.user) {
        // Check if email is verified
        if (!data.user.email_confirmed_at) {
          toast.warning('Please verify your email before signing in');
          await logout();
          return false;
        }
        
        // Get user profile
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();
          
        if (profileError) throw profileError;
        
        const userData: User = {
          id: data.user.id,
          email: data.user.email || '',
          username: profile.username,
          firstName: profile.first_name,
          lastName: profile.last_name,
          roles: [profile.role || UserRole.USER],
          status: profile.status || UserStatus.ACTIVE,
          emailVerified: data.user.email_confirmed_at !== null,
          phoneVerified: profile.phone_verified || false,
          createdAt: profile.created_at || new Date().toISOString(),
          updatedAt: profile.updated_at || new Date().toISOString(),
          ...(profile.avatar && { avatar: profile.avatar }),
          ...(profile.phone && { phone: profile.phone }),
          ...(profile.bio && { bio: profile.bio }),
          ...(profile.date_of_birth && { dateOfBirth: profile.date_of_birth }),
          ...(profile.last_login_at && { lastLoginAt: profile.last_login_at }),
        };
        
        setUser(userData);
        
        // Update last login time
        await supabase
          .from('profiles')
          .update({ last_login_at: new Date().toISOString() })
          .eq('id', data.user.id);
        
        toast.success('Logged in successfully');
        // Navigation will be handled by components that use this context
        return true;
      }
      
      return false;
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error(error.message || 'Failed to log in');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Set up auth state change listener
  useEffect(() => {
    let isInitialLoad = true;

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        // Get the user's profile data
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (profileError) {
          console.error('Error fetching profile:', profileError);
          setLoading(false); // Set loading to false on error
          return;
        }

        if (profile) {
          const userData: User = {
            id: session.user.id,
            email: session.user.email || '',
            username: profile.username,
            firstName: profile.first_name,
            lastName: profile.last_name,
            roles: [profile.role || UserRole.USER],
            status: profile.status || UserStatus.ACTIVE,
            emailVerified: session.user.email_confirmed_at !== null,
            phoneVerified: profile.phone_verified || false,
            createdAt: profile.created_at || new Date().toISOString(),
            updatedAt: profile.updated_at || new Date().toISOString(),
            ...(profile.avatar && { avatar: profile.avatar }),
            ...(profile.phone && { phone: profile.phone }),
            ...(profile.bio && { bio: profile.bio }),
            ...(profile.date_of_birth && { dateOfBirth: profile.date_of_birth }),
            ...(profile.last_login_at && { lastLoginAt: profile.last_login_at }),
          };

          setUser(userData);

          // Update last login time on initial load
          if (event === 'SIGNED_IN') {
            await supabase
              .from('profiles')
              .update({ last_login_at: new Date().toISOString() })
              .eq('id', session.user.id);
          }
        }
      } else {
        setUser(null);

        // Redirect to login if user signs out
        if (event === 'SIGNED_OUT') {
          // Navigation will be handled by components that use this context
        }
      }

      // Set loading to false after auth state is determined
      if (isInitialLoad) {
        setLoading(false);
        isInitialLoad = false;
      }
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  // Provide the auth context
  const value: AuthContextType = {
    user,
    loading,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    resendVerificationEmail,
    resetPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use the auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
