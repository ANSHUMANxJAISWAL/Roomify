import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export interface AppSettings {
  general: {
    language: string
    timezone: string
    dateFormat: string
    timeFormat: string
  }
  data: {
    autoBackup: boolean
    backupFrequency: 'daily' | 'weekly' | 'monthly'
    retentionPeriod: number
    exportFormat: 'json' | 'csv' | 'pdf'
  }
}

interface SettingsContextType {
  settings: AppSettings
  updateSettings: (newSettings: AppSettings) => void
  resetToDefaults: () => void
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined)

const defaultSettings: AppSettings = {
  general: {
    language: 'en',
    timezone: 'UTC',
    dateFormat: 'MM/DD/YYYY',
    timeFormat: '12h'
  },
  data: {
    autoBackup: true,
    backupFrequency: 'weekly',
    retentionPeriod: 90,
    exportFormat: 'json'
  }
}

export const SettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<AppSettings>(defaultSettings)

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('roomify-settings')
    if (savedSettings) {
      try {
        const parsedSettings = JSON.parse(savedSettings)
        setSettings({ ...defaultSettings, ...parsedSettings })
      } catch (error) {
        console.error('Failed to parse saved settings:', error)
      }
    }
  }, [])

  const updateSettings = (newSettings: AppSettings) => {
    setSettings(newSettings)
    localStorage.setItem('roomify-settings', JSON.stringify(newSettings))
  }

  const resetToDefaults = () => {
    setSettings(defaultSettings)
    localStorage.setItem('roomify-settings', JSON.stringify(defaultSettings))
  }

  return (
    <SettingsContext.Provider value={{ settings, updateSettings, resetToDefaults }}>
      {children}
    </SettingsContext.Provider>
  )
}

export const useSettings = (): SettingsContextType => {
  const context = useContext(SettingsContext)
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider')
  }
  return context
}
