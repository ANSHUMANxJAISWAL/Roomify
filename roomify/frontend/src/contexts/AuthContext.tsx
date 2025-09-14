import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabaseAuth } from '../services/supabaseAuth';
import { User, UserRole, UserStatus } from '../types';
import { toast } from 'sonner';

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: { email: string; password: string; username: string; firstName: string; lastName: string }) => Promise<boolean>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  resendVerificationEmail: (email: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check active sessions and sets the user
    const checkUser = async () => {
      try {
        setLoading(true);
        const currentUser = await supabaseAuth.getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        console.error('Failed to fetch user', error);
      } finally {
        setLoading(false);
      }
    };

    checkUser();

    // Listen for changes on auth state
    const unsubscribe = supabaseAuth.onAuthStateChange((currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      await supabaseAuth.signIn(email, password);
      const currentUser = await supabaseAuth.getCurrentUser();
      setUser(currentUser);
      
      if (currentUser?.status === UserStatus.PENDING_VERIFICATION) {
        toast.warning('Please verify your email before signing in');
        await logout();
        return false;
      }
      
      toast.success('Logged in successfully');
      return true;
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error(error.message || 'Failed to log in');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: { email: string; password: string; username: string; firstName: string; lastName: string }) => {
    try {
      setLoading(true);
      await supabaseAuth.signUp(userData.email, userData.password, {
        username: userData.username,
        firstName: userData.firstName,
        lastName: userData.lastName,
      });
      
      toast.success('Registration successful! Please check your email to verify your account.');
      return true;
    } catch (error: any) {
      console.error('Registration error:', error);
      toast.error(error.message || 'Registration failed');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      await supabaseAuth.signOut();
      setUser(null);
      toast.success('Logged out successfully');
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to log out');
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<User>) => {
    try {
      setLoading(true);
      await supabaseAuth.updateProfile(updates);
      const currentUser = await supabaseAuth.getCurrentUser();
      setUser(currentUser);
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Update profile error:', error);
      toast.error('Failed to update profile');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const changePassword = async (currentPassword: string, newPassword: string) => {
    try {
      setLoading(true);
      if (!user?.email) throw new Error('No user email found');
      
      // First verify current password
      await supabaseAuth.signIn(user.email, currentPassword);
      // Then update to new password
      await supabaseAuth.changePassword(newPassword);
      toast.success('Password changed successfully');
    } catch (error) {
      console.error('Change password error:', error);
      toast.error('Failed to change password. Please check your current password.');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const resendVerificationEmail = async (email: string) => {
    try {
      setLoading(true);
      await supabaseAuth.resendConfirmationEmail(email);
      toast.success('Verification email resent. Please check your inbox.');
    } catch (error) {
      console.error('Resend verification error:', error);
      toast.error('Failed to resend verification email');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string): Promise<void> => {
    try {
      setLoading(true);
      await supabaseAuth.resetPassword(email);
      toast.success('Password reset email sent. Please check your inbox.');
    } catch (error) {
      console.error('Reset password error:', error);
      toast.error('Failed to send password reset email');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const value = {
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

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
