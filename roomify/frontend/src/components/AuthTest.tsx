import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';

const AuthTest: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const { user, login, register, logout, resendVerificationEmail } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      if (isLogin) {
        const success = await login(email, password);
        if (success) {
          toast.success('Logged in successfully!');
          navigate('/dashboard');
        }
      } else {
        const success = await register({ email, password, username, firstName, lastName, acceptTerms });
        if (success) {
          toast.success('Registration successful! Please check your email to verify your account.');
          setIsLogin(true);
          setEmail('');
          setPassword('');
        }
      }
    } catch (error: any) {
      console.error('Auth error:', error);
      toast.error(error.message || 'Authentication failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendVerification = async () => {
    if (!email) {
      toast.error('Please enter your email address');
      return;
    }
    
    try {
      setIsLoading(true);
      await resendVerificationEmail(email);
      toast.success('Verification email sent. Please check your inbox.');
    } catch (error) {
      console.error('Resend verification error:', error);
      toast.error('Failed to resend verification email');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      setIsLoading(true);
      await logout();
      toast.success('Logged out successfully');
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to log out');
    } finally {
      setIsLoading(false);
    }
  };

  if (user) {
    return (
      <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Welcome, {user.email}!</h2>
        <div className="mb-4">
          <p className="text-gray-700">
            Status: <span className="font-medium">{user.status}</span>
          </p>
          <p className="text-gray-700">
            Email Verified: <span className="font-medium">{user.emailVerified ? 'Yes' : 'No'}</span>
          </p>
          {!user.emailVerified && (
            <button
              onClick={handleResendVerification}
              disabled={isLoading}
              className="mt-2 text-sm text-blue-600 hover:text-blue-800 disabled:opacity-50"
            >
              Resend Verification Email
            </button>
          )}
        </div>
        <button
          onClick={handleLogout}
          disabled={isLoading}
          className="w-full bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition disabled:opacity-50"
        >
          {isLoading ? 'Logging out...' : 'Logout'}
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">{isLogin ? 'Login' : 'Create Account'}</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {!isLogin && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                disabled={isLoading}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">First Name</label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  disabled={isLoading}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Last Name</label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  disabled={isLoading}
                />
              </div>
            </div>
          </>
        )}
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            disabled={isLoading}
          />
        </div>
        <div>
          <div className="flex justify-between">
            <label className="block text-sm font-medium text-gray-700">Password</label>
            {isLogin && (
              <button
                type="button"
                onClick={() => navigate('/forgot-password')}
                className="text-xs text-blue-600 hover:text-blue-800"
              >
                Forgot password?
              </button>
            )}
          </div>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            disabled={isLoading}
          />
        </div>
        <div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {isLoading 
              ? 'Processing...' 
              : isLogin 
                ? 'Sign In' 
                : 'Create Account'}
          </button>
        </div>
      </form>
      <div className="mt-4 text-center">
        <button
          onClick={() => {
            setIsLogin(!isLogin);
            setEmail('');
            setPassword('');
          }}
          disabled={isLoading}
          className="text-sm text-blue-600 hover:text-blue-800 disabled:opacity-50"
        >
          {isLogin 
            ? 'Need an account? Create one' 
            : 'Already have an account? Sign In'}
        </button>
      </div>
    </div>
  );
};

export default AuthTest;
