import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { User } from '../types'
import { authAPI, userAPI } from '../services/api'
import toast from 'react-hot-toast'

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string, rememberMe?: boolean) => Promise<boolean>
  register: (userData: any) => Promise<boolean>
  logout: () => Promise<void>
  updateProfile: (userData: Partial<User>) => Promise<boolean>
  changePassword: (currentPassword: string, newPassword: string) => Promise<boolean>
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAuthStatus()
  }, [])

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem('accessToken')
      if (token) {
        const response = await userAPI.getCurrentUser()
        if (response.data) {
          setUser(response.data)
        } else {
          localStorage.removeItem('accessToken')
          localStorage.removeItem('refreshToken')
        }
      }
    } catch (error) {
      console.error('Auth check failed:', error)
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
    } finally {
      setLoading(false)
    }
  }

  const login = async (email: string, password: string, rememberMe = false): Promise<boolean> => {
    try {
      setLoading(true)
      const response = await authAPI.login({ email, password, rememberMe })
      
      if (response.data) {
        const { accessToken, refreshToken, user: userData } = response.data
        
        localStorage.setItem('accessToken', accessToken)
        if (refreshToken) {
          localStorage.setItem('refreshToken', refreshToken)
        }
        
        setUser(userData)
        toast.success('Welcome back!')
        return true
      } else {
        toast.error('Login failed')
        return false
      }
    } catch (error: any) {
      console.error('Login error:', error)
      const message = error.response?.data?.message || 'Login failed. Please try again.'
      toast.error(message)
      return false
    } finally {
      setLoading(false)
    }
  }

  const register = async (userData: any): Promise<boolean> => {
    try {
      setLoading(true)
      const response = await authAPI.register(userData)
      
      if (response.data) {
        const { accessToken, refreshToken, user: newUser } = response.data
        
        localStorage.setItem('accessToken', accessToken)
        if (refreshToken) {
          localStorage.setItem('refreshToken', refreshToken)
        }
        
        setUser(newUser)
        toast.success('Account created successfully!')
        return true
      } else {
        toast.error('Registration failed')
        return false
      }
    } catch (error: any) {
      console.error('Registration error:', error)
      const message = error.response?.data?.message || 'Registration failed. Please try again.'
      toast.error(message)
      return false
    } finally {
      setLoading(false)
    }
  }

  const logout = async (): Promise<void> => {
    try {
      const refreshToken = localStorage.getItem('refreshToken')
      if (refreshToken) {
        await authAPI.logout(refreshToken)
      }
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      setUser(null)
      toast.success('Logged out successfully')
    }
  }

  const updateProfile = async (userData: Partial<User>): Promise<boolean> => {
    try {
      const response = await userAPI.updateProfile(userData)
      
      if (response.data) {
        setUser(prev => prev ? { ...prev, ...response.data } : null)
        toast.success('Profile updated successfully!')
        return true
      } else {
        toast.error('Profile update failed')
        return false
      }
    } catch (error: any) {
      console.error('Profile update error:', error)
      const message = error.response?.data?.message || 'Profile update failed. Please try again.'
      toast.error(message)
      return false
    }
  }

  const changePassword = async (currentPassword: string, newPassword: string): Promise<boolean> => {
    try {
      const response = await userAPI.changePassword(currentPassword, newPassword)
      
      if (response.data) {
        toast.success('Password changed successfully!')
        return true
      } else {
        toast.error('Password change failed')
        return false
      }
    } catch (error: any) {
      console.error('Password change error:', error)
      const message = error.response?.data?.message || 'Password change failed. Please try again.'
      toast.error(message)
      return false
    }
  }

  const value: AuthContextType = {
    user,
    loading,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

