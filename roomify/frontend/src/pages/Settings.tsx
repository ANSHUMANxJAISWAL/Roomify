import React, { useState, useEffect } from 'react'
import { Settings as SettingsIcon, Globe, Database, Download, Upload, Trash2 } from 'lucide-react'
import { useDashboard } from '../contexts/DashboardContext'
import { useSettings } from '../contexts/SettingsContext'

interface AppSettings {
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

const Settings: React.FC = () => {
  const { loading } = useDashboard()
  const { settings, updateSettings, resetToDefaults } = useSettings()
  const [activeTab, setActiveTab] = useState<'general' | 'data'>('general')
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

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
      updateSettings(tempSettings)
      setHasUnsavedChanges(false)
      alert('Settings saved successfully!')
    } catch (error) {
      console.error('Failed to save settings:', error)
      alert('Failed to save settings. Please try again.')
    }
  }

  const handleReset = () => {
    resetToDefaults()
    setTempSettings(settings) // This will be updated by the useEffect
    setHasUnsavedChanges(false)
  }

  const handleExportData = () => {
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
          // Only use general and data settings from imported data
          const sanitizedSettings = {
            general: importedSettings.general || {
              language: 'en',
              timezone: 'UTC',
              dateFormat: 'MM/DD/YYYY',
              timeFormat: '12h'
            },
            data: importedSettings.data || {
              autoBackup: true,
              backupFrequency: 'weekly',
              retentionPeriod: 90,
              exportFormat: 'json'
            }
          }
          setTempSettings(sanitizedSettings)
          setHasUnsavedChanges(true)
        } catch (error) {
          console.error('Failed to parse imported settings:', error)
          alert('Failed to parse imported settings file.')
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
          <h1 className="text-3xl font-bold text-gradient-heading drop-shadow-lg">Settings</h1>
          <p className="text-gray-300 mt-2">Customize your application preferences and account settings.</p>
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
      <div className="border-b border-slate-700/50">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('general')}
            className={`py-2 px-1 border-b-2 font-medium text-sm transition-all duration-200 ${
              activeTab === 'general'
                ? 'border-purple-500 text-purple-400'
                : 'border-transparent text-gray-300 hover:text-purple-400 hover:border-purple-500/30'
            }`}
          >
            <Globe className="h-4 w-4 inline mr-2" />
            General
          </button>
          <button
            onClick={() => setActiveTab('data')}
            className={`py-2 px-1 border-b-2 font-medium text-sm transition-all duration-200 ${
              activeTab === 'data'
                ? 'border-orange-500 text-orange-400'
                : 'border-transparent text-gray-300 hover:text-orange-400 hover:border-orange-500/30'
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
            <h3 className="text-lg font-semibold text-white mb-4">General Settings</h3>
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

      {activeTab === 'data' && (
        <div className="space-y-6">
          {/* Data Management */}
          <div className="card">
            <h3 className="text-lg font-semibold text-white mb-4">Data Management</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-white">Auto Backup</h4>
                  <p className="text-sm text-gray-300">Automatically backup your data</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={tempSettings.data.autoBackup}
                    onChange={(e) => handleSettingChange('data', 'autoBackup', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-500/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-600 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
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
            <h3 className="text-lg font-semibold text-white mb-4">Data Actions</h3>
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
                className="btn-outline text-red-400 border-red-500/30 hover:bg-red-500/10 flex items-center justify-center transition-colors duration-200"
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


