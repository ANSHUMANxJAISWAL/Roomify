import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './hooks/useAuth'
import { AuthProvider } from './contexts/AuthContext'
import { DashboardProvider } from './contexts/DashboardContext'
import Layout from './components/layout/Layout'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import ForgotPassword from './pages/auth/ForgotPassword'
import ResetPassword from './pages/auth/ResetPassword'
import Dashboard from './pages/Dashboard'
import Expenses from './pages/Expenses'
import Chores from './pages/Chores'
import Reminders from './pages/Reminders'
import Roommates from './pages/Roommates'
import Profile from './pages/Profile'
import Settings from './pages/Settings'
import Onboarding from './pages/Onboarding'
import LoadingScreen from './components/ui/LoadingScreen'

interface AuthState {
  user: any; // Replace 'any' with your User type if available
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: any) => Promise<boolean>; // Replace 'any' with your UserData type
  logout: () => Promise<void>;
  // Add other methods you use from useAuth
}

function AppRoutes() {
  const { user, loading } = useAuth() as AuthState;

  if (loading) {
    return <LoadingScreen />
  }

  if (!user) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    )
  }

  return (
    <DashboardProvider>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/expenses" element={<Expenses />} />
          <Route path="/chores" element={<Chores />} />
          <Route path="/reminders" element={<Reminders />} />
          <Route path="/roommates" element={<Roommates />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Route>
      </Routes>
    </DashboardProvider>
  )
}

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  )
}

export default App

