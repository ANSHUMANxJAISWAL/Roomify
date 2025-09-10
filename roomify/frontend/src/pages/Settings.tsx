import React, { useState, useEffect } from 'react'
import { Settings as SettingsIcon, Bell, Shield, Palette, Globe, Database, Download, Upload, Trash2, User, Lock, Smartphone, Mail } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { useDashboard } from '../contexts/DashboardContext'

interface AppSettings {
  general: {
    language: string
    timezone: string
    dateFormat: string
    timeFormat: string
  }
  appearance: {
    theme: 'light' | 'dark' | 'system'
    primaryColor: string
    fontSize: 'small' | 'medium' | 'large'
    compactMode: boolean
  }
  notifications: {
    email: {
      enabled: boolean
      frequency: 'immediate' | 'daily' | 'weekly'
      types: string[]
    }
    push: {
      enabled: boolean
      sound: boolean
      vibration: boolean
    }
    sms: {
      enabled: boolean
      emergencyOnly: boolean
    }
  }
  privacy: {
    dataCollection: boolean
    analytics: boolean
    marketing: boolean
    thirdParty: boolean
  }
  data: {
    autoBackup: boolean
    backupFrequency: 'daily' | 'weekly' | 'monthly'
    retentionPeriod: number
    exportFormat: 'json' | 'csv' | 'pdf'
  }
}

const Settings: React.FC = () => {
  const { user } = useAuth()
  const { loading } = useDashboard()
  const [activeTab, setActiveTab] = useState<'general' | 'appearance' | 'notifications' | 'privacy' | 'data'>('general')
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

  const [settings, setSettings] = useState<AppSettings>({
    general: {
      language: 'en',
      timezone: 'UTC',
      dateFormat: 'MM/DD/YYYY',
      timeFormat: '12h'
    },
    appearance: {
      theme: 'system',
      primaryColor: '#3B82F6',
      fontSize: 'medium',
      compactMode: false
    },
    notifications: {
      email: {
        enabled: true,
        frequency: 'immediate',
        types: ['chores', 'expenses', 'reminders', 'household']
      },
      push: {
        enabled: true,
        sound: true,
        vibration: true
      },
      sms: {
        enabled: false,
        emergencyOnly: true
      }
    },
    privacy: {
      dataCollection: true,
      analytics: true,
      marketing: false,
      thirdParty: false
    },
    data: {
      autoBackup: true,
      backupFrequency: 'weekly',
      retentionPeriod: 90,
      exportFormat: 'json'
    }
  })

  const [tempSettings, setTempSettings] = useState<AppSettings>(settings)

  useEffect(() => {
    setTempSettings(settings)
  }, [settings])

  const handleSettingChange = (category: keyof AppSettings, field: string, value: any) => {
    setTempSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: value
      }
    }))
    setHasUnsavedChanges(true)
  }

  const handleNestedSettingChange = (category: keyof AppSettings, subcategory: string, field: string, value: any) => {
    setTempSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [subcategory]: {
          ...(prev[category] as any)[subcategory],
          [field]: value
        }
      }
    }))
    setHasUnsavedChanges(true)
  }

  const handleSave = async () => {
    try {
      // TODO: Implement settings save API call
      setSettings(tempSettings)
      setHasUnsavedChanges(false)
    } catch (error) {
      console.error('Failed to save settings:', error)
    }
  }

  const handleReset = () => {
    setTempSettings(settings)
    setHasUnsavedChanges(false)
  }

  const handleExportData = () => {
    // TODO: Implement data export
    const dataStr = JSON.stringify(settings, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'roomify-settings.json'
    link.click()
    URL.revokeObjectURL(url)
  }

  const handleImportData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const importedSettings = JSON.parse(e.target?.result as string)
          setTempSettings(importedSettings)
          setHasUnsavedChanges(true)
        } catch (error) {
          console.error('Failed to parse imported settings:', error)
        }
      }
      reader.readAsText(file)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600">Customize your application preferences and account settings.</p>
        </div>
        <div className="flex space-x-3">
          {hasUnsavedChanges && (
            <>
              <button
                onClick={handleReset}
                className="btn-outline"
              >
                Reset
              </button>
              <button
                onClick={handleSave}
                className="btn-primary"
              >
                Save Changes
              </button>
            </>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('general')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'general'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Globe className="h-4 w-4 inline mr-2" />
            General
          </button>
          <button
            onClick={() => setActiveTab('appearance')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'appearance'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Palette className="h-4 w-4 inline mr-2" />
            Appearance
          </button>
          <button
            onClick={() => setActiveTab('notifications')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'notifications'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Bell className="h-4 w-4 inline mr-2" />
            Notifications
          </button>
          <button
            onClick={() => setActiveTab('privacy')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'privacy'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Shield className="h-4 w-4 inline mr-2" />
            Privacy
          </button>
          <button
            onClick={() => setActiveTab('data')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'data'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Database className="h-4 w-4 inline mr-2" />
            Data
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'general' && (
        <div className="space-y-6">
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">General Settings</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="language" className="form-label">Language</label>
                <select
                  id="language"
                  value={tempSettings.general.language}
                  onChange={(e) => handleSettingChange('general', 'language', e.target.value)}
                  className="select-field"
                >
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                  <option value="de">German</option>
                  <option value="it">Italian</option>
                  <option value="pt">Portuguese</option>
                </select>
              </div>
              <div>
                <label htmlFor="timezone" className="form-label">Timezone</label>
                <select
                  id="timezone"
                  value={tempSettings.general.timezone}
                  onChange={(e) => handleSettingChange('general', 'timezone', e.target.value)}
                  className="select-field"
                >
                  <option value="UTC">UTC</option>
                  <option value="America/New_York">Eastern Time</option>
                  <option value="America/Chicago">Central Time</option>
                  <option value="America/Denver">Mountain Time</option>
                  <option value="America/Los_Angeles">Pacific Time</option>
                  <option value="Europe/London">London</option>
                  <option value="Europe/Paris">Paris</option>
                  <option value="Asia/Tokyo">Tokyo</option>
                </select>
              </div>
              <div>
                <label htmlFor="dateFormat" className="form-label">Date Format</label>
                <select
                  id="dateFormat"
                  value={tempSettings.general.dateFormat}
                  onChange={(e) => handleSettingChange('general', 'dateFormat', e.target.value)}
                  className="select-field"
                >
                  <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                  <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                  <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                </select>
              </div>
              <div>
                <label htmlFor="timeFormat" className="form-label">Time Format</label>
                <select
                  id="timeFormat"
                  value={tempSettings.general.timeFormat}
                  onChange={(e) => handleSettingChange('general', 'timeFormat', e.target.value)}
                  className="select-field"
                >
                  <option value="12h">12-hour</option>
                  <option value="24h">24-hour</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'appearance' && (
        <div className="space-y-6">
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Appearance Settings</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="theme" className="form-label">Theme</label>
                <select
                  id="theme"
                  value={tempSettings.appearance.theme}
                  onChange={(e) => handleSettingChange('appearance', 'theme', e.target.value)}
                  className="select-field"
                >
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                  <option value="system">System</option>
                </select>
              </div>
              <div>
                <label htmlFor="fontSize" className="form-label">Font Size</label>
                <select
                  id="fontSize"
                  value={tempSettings.appearance.fontSize}
                  onChange={(e) => handleSettingChange('appearance', 'fontSize', e.target.value)}
                  className="select-field"
                >
                  <option value="small">Small</option>
                  <option value="medium">Medium</option>
                  <option value="large">Large</option>
                </select>
              </div>
              <div>
                <label htmlFor="primaryColor" className="form-label">Primary Color</label>
                <div className="flex items-center space-x-3">
                  <input
                    type="color"
                    id="primaryColor"
                    value={tempSettings.appearance.primaryColor}
                    onChange={(e) => handleSettingChange('appearance', 'primaryColor', e.target.value)}
                    className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                  />
                  <span className="text-sm text-gray-500">{tempSettings.appearance.primaryColor}</span>
                </div>
              </div>
              <div className="flex items-center">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={tempSettings.appearance.compactMode}
                    onChange={(e) => handleSettingChange('appearance', 'compactMode', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                </label>
                <span className="ml-3 text-sm font-medium text-gray-700">Compact Mode</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'notifications' && (
        <div className="space-y-6">
          {/* Email Notifications */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Email Notifications</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Mail className="h-5 w-5 text-gray-400 mr-3" />
                  <span className="text-gray-700">Enable Email Notifications</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={tempSettings.notifications.email.enabled}
                    onChange={(e) => handleNestedSettingChange('notifications', 'email', 'enabled', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                </label>
              </div>
              {tempSettings.notifications.email.enabled && (
                <div>
                  <label htmlFor="emailFrequency" className="form-label">Frequency</label>
                  <select
                    id="emailFrequency"
                    value={tempSettings.notifications.email.frequency}
                    onChange={(e) => handleNestedSettingChange('notifications', 'email', 'frequency', e.target.value)}
                    className="select-field"
                  >
                    <option value="immediate">Immediate</option>
                    <option value="daily">Daily Digest</option>
                    <option value="weekly">Weekly Summary</option>
                  </select>
                </div>
              )}
            </div>
          </div>

          {/* Push Notifications */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Push Notifications</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Smartphone className="h-5 w-5 text-gray-400 mr-3" />
                  <span className="text-gray-700">Enable Push Notifications</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={tempSettings.notifications.push.enabled}
                    onChange={(e) => handleNestedSettingChange('notifications', 'push', 'enabled', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                </label>
              </div>
              {tempSettings.notifications.push.enabled && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">Sound</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={tempSettings.notifications.push.sound}
                        onChange={(e) => handleNestedSettingChange('notifications', 'push', 'sound', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                    </label>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">Vibration</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={tempSettings.notifications.push.vibration}
                        onChange={(e) => handleNestedSettingChange('notifications', 'push', 'vibration', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                    </label>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* SMS Notifications */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">SMS Notifications</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Smartphone className="h-5 w-5 text-gray-400 mr-3" />
                  <span className="text-gray-700">Enable SMS Notifications</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={tempSettings.notifications.sms.enabled}
                    onChange={(e) => handleNestedSettingChange('notifications', 'sms', 'enabled', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                </label>
              </div>
              {tempSettings.notifications.sms.enabled && (
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Emergency Only</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={tempSettings.notifications.sms.emergencyOnly}
                      onChange={(e) => handleNestedSettingChange('notifications', 'sms', 'emergencyOnly', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                  </label>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'privacy' && (
        <div className="space-y-6">
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Privacy Settings</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900">Data Collection</h4>
                  <p className="text-sm text-gray-500">Allow us to collect usage data to improve the service</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={tempSettings.privacy.dataCollection}
                    onChange={(e) => handleSettingChange('privacy', 'dataCollection', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                </label>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900">Analytics</h4>
                  <p className="text-sm text-gray-500">Help us understand how you use the application</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={tempSettings.privacy.analytics}
                    onChange={(e) => handleSettingChange('privacy', 'analytics', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                </label>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900">Marketing Communications</h4>
                  <p className="text-sm text-gray-500">Receive updates about new features and promotions</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={tempSettings.privacy.marketing}
                    onChange={(e) => handleSettingChange('privacy', 'marketing', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                </label>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900">Third-Party Services</h4>
                  <p className="text-sm text-gray-500">Allow integration with external services</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={tempSettings.privacy.thirdParty}
                    onChange={(e) => handleSettingChange('privacy', 'thirdParty', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                </label>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'data' && (
        <div className="space-y-6">
          {/* Data Management */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Data Management</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900">Auto Backup</h4>
                  <p className="text-sm text-gray-500">Automatically backup your data</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={tempSettings.data.autoBackup}
                    onChange={(e) => handleSettingChange('data', 'autoBackup', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                </label>
              </div>
              {tempSettings.data.autoBackup && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="backupFrequency" className="form-label">Backup Frequency</label>
                    <select
                      id="backupFrequency"
                      value={tempSettings.data.backupFrequency}
                      onChange={(e) => handleSettingChange('data', 'backupFrequency', e.target.value)}
                      className="select-field"
                    >
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="retentionPeriod" className="form-label">Retention Period (days)</label>
                    <input
                      type="number"
                      id="retentionPeriod"
                      value={tempSettings.data.retentionPeriod}
                      onChange={(e) => handleSettingChange('data', 'retentionPeriod', parseInt(e.target.value))}
                      className="input-field"
                      min="1"
                      max="365"
                    />
                  </div>
                </div>
              )}
              <div>
                <label htmlFor="exportFormat" className="form-label">Export Format</label>
                <select
                  id="exportFormat"
                  value={tempSettings.data.exportFormat}
                  onChange={(e) => handleSettingChange('data', 'exportFormat', e.target.value)}
                  className="select-field"
                >
                  <option value="json">JSON</option>
                  <option value="csv">CSV</option>
                  <option value="pdf">PDF</option>
                </select>
              </div>
            </div>
          </div>

          {/* Data Actions */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Data Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                onClick={handleExportData}
                className="btn-outline flex items-center justify-center"
              >
                <Download className="h-4 w-4 mr-2" />
                Export Data
              </button>
              <label className="btn-outline flex items-center justify-center cursor-pointer">
                <Upload className="h-4 w-4 mr-2" />
                Import Data
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImportData}
                  className="hidden"
                />
              </label>
              <button
                onClick={() => {
                  if (confirm('Are you sure you want to delete all your data? This action cannot be undone.')) {
                    // TODO: Implement data deletion
                  }
                }}
                className="btn-outline text-red-600 border-red-300 hover:bg-red-50 flex items-center justify-center"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete All Data
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Settings


