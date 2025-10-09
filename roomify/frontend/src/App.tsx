import { Routes, Route, Navigate } from 'react-router-dom'
import { DashboardProvider } from './contexts/DashboardContext'
import { SettingsProvider } from './contexts/SettingsContext'
import Layout from './components/layout/Layout'
import Dashboard from './pages/Dashboard'
import Expenses from './pages/Expenses'
import Chores from './pages/Chores'
import Reminders from './pages/Reminders'
import Roommates from './pages/Roommates'
import Profile from './pages/Profile'
import Settings from './pages/Settings'

function App() {
  return (
    <SettingsProvider>
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
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Route>
        </Routes>
      </DashboardProvider>
    </SettingsProvider>
  )
}

export default App

