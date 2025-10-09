import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import {
  DashboardStats,
  Expense,
  Chore,
  Reminder,
  Notification,
  Household
} from '../types'
import { dashboardAPI } from '../services/api'

export interface DashboardContextType {
  stats: DashboardStats | null
  expenses: Expense[]
  chores: Chore[]
  reminders: Reminder[]
  notifications: Notification[]
  households: Household[]
  loading: boolean
  refreshStats: () => Promise<void>
  refreshExpenses: () => Promise<void>
  refreshChores: () => Promise<void>
  refreshReminders: () => Promise<void>
  refreshNotifications: () => Promise<void>
  refreshHouseholds: () => Promise<void>
  addExpense: (expense: Expense) => void
  updateExpense: (id: string, expense: Partial<Expense>) => void
  removeExpense: (id: string) => void
  addChore: (chore: Chore) => void
  updateChore: (id: string, chore: Partial<Chore>) => void
  removeChore: (id: string) => void
  addReminder: (reminder: Reminder) => void
  updateReminder: (id: string, reminder: Partial<Reminder>) => void
  removeReminder: (id: string) => void
  markNotificationAsRead: (id: string) => Promise<void>
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined)

export const useDashboard = () => {
  const context = useContext(DashboardContext)
  if (context === undefined) {
    throw new Error('useDashboard must be used within a DashboardProvider')
  }
  return context
}

interface DashboardProviderProps {
  children: ReactNode
}

export const DashboardProvider: React.FC<DashboardProviderProps> = ({ children }) => {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [chores, setChores] = useState<Chore[]>([])
  const [reminders, setReminders] = useState<Reminder[]>([])
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [households, setHouseholds] = useState<Household[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    initializeDashboard()
  }, [])

  const initializeDashboard = async () => {
    setLoading(true)
    try {
      await Promise.all([
        refreshStats(),
        refreshExpenses(),
        refreshChores(),
        refreshReminders(),
        refreshNotifications(),
        refreshHouseholds(),
      ])
    } catch (error) {
      console.error('Failed to initialize dashboard:', error)
    } finally {
      setLoading(false)
    }
  }

  const refreshStats = async () => {
    try {
      const response = await dashboardAPI.getDashboardStats()
      if (response.data) {
        setStats(response.data)
      }
    } catch (error) {
      console.error('Failed to refresh stats:', error)
    }
  }

  const refreshExpenses = async () => {
    try {
      const response = await dashboardAPI.getExpenses({ size: 10 })
      if (response.data) {
        setExpenses(response.data)
      }
    } catch (error) {
      console.error('Failed to refresh expenses:', error)
    }
  }

  const refreshChores = async () => {
    try {
      const response = await dashboardAPI.getChores({ size: 10 })
      if (response.data) {
        setChores(response.data)
      }
    } catch (error) {
      console.error('Failed to refresh chores:', error)
    }
  }

  const refreshReminders = async () => {
    try {
      const response = await dashboardAPI.getReminders({ size: 10 })
      if (response.data) {
        setReminders(response.data)
      }
    } catch (error) {
      console.error('Failed to refresh reminders:', error)
    }
  }

  const refreshNotifications = async () => {
    try {
      const response = await dashboardAPI.getNotifications()
      if (response.data) {
        setNotifications(response.data)
      }
    } catch (error) {
      console.error('Failed to refresh notifications:', error)
    }
  }

  const refreshHouseholds = async () => {
    try {
      const response = await dashboardAPI.getHouseholds()
      if (response.data) {
        setHouseholds(response.data)
      }
    } catch (error) {
      console.error('Failed to refresh households:', error)
    }
  }

  const addExpense = (expense: Expense) => {
    setExpenses(prev => [expense, ...prev])
  }

  const updateExpense = (id: string, expense: Partial<Expense>) => {
    setExpenses(prev => prev.map(e => e.id === id ? { ...e, ...expense } : e))
  }

  const removeExpense = (id: string) => {
    setExpenses(prev => prev.filter(e => e.id !== id))
  }

  const addChore = (chore: Chore) => {
    setChores(prev => [chore, ...prev])
  }

  const updateChore = (id: string, chore: Partial<Chore>) => {
    setChores(prev => prev.map(c => c.id === id ? { ...c, ...chore } : c))
  }

  const removeChore = (id: string) => {
    setChores(prev => prev.filter(c => c.id !== id))
  }

  const addReminder = (reminder: Reminder) => {
    setReminders(prev => [reminder, ...prev])
  }

  const updateReminder = (id: string, reminder: Partial<Reminder>) => {
    setReminders(prev => prev.map(r => r.id === id ? { ...r, ...reminder } : r))
  }

  const removeReminder = (id: string) => {
    setReminders(prev => prev.filter(r => r.id !== id))
  }

  const markNotificationAsRead = async (id: string) => {
    try {
      // TODO: Implement mark as read API call
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
    } catch (error) {
      console.error('Failed to mark notification as read:', error)
    }
  }

  const value: DashboardContextType = {
    stats,
    expenses,
    chores,
    reminders,
    notifications,
    households,
    loading,
    refreshStats,
    refreshExpenses,
    refreshChores,
    refreshReminders,
    refreshNotifications,
    refreshHouseholds,
    addExpense,
    updateExpense,
    removeExpense,
    addChore,
    updateChore,
    removeChore,
    addReminder,
    updateReminder,
    removeReminder,
    markNotificationAsRead,
  }

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  )
}

