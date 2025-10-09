import { useSettings } from '../contexts/SettingsContext'

export const formatCurrency = (amount: number, currency = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount)
}

export const formatDate = (date: string | Date, settings?: { dateFormat: string; timezone: string }): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date

  // If settings are provided, use them; otherwise use context
  const formatSettings = settings || getCurrentSettings()

  // Convert date format to Intl options
  const dateOptions: Intl.DateTimeFormatOptions = {}

  switch (formatSettings.dateFormat) {
    case 'MM/DD/YYYY':
      dateOptions.month = '2-digit'
      dateOptions.day = '2-digit'
      dateOptions.year = 'numeric'
      break
    case 'DD/MM/YYYY':
      dateOptions.day = '2-digit'
      dateOptions.month = '2-digit'
      dateOptions.year = 'numeric'
      break
    case 'YYYY-MM-DD':
      dateOptions.year = 'numeric'
      dateOptions.month = '2-digit'
      dateOptions.day = '2-digit'
      break
    default:
      dateOptions.year = 'numeric'
      dateOptions.month = 'short'
      dateOptions.day = 'numeric'
  }

  return dateObj.toLocaleDateString('en-US', dateOptions)
}

export const formatTime = (time: string | Date, settings?: { timeFormat: string; timezone: string }): string => {
  const timeObj = typeof time === 'string' ? new Date(`2000-01-01T${time}`) : time

  // If settings are provided, use them; otherwise use context
  const formatSettings = settings || getCurrentSettings()

  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: '2-digit',
    minute: '2-digit',
    hour12: formatSettings.timeFormat === '12h',
    timeZone: formatSettings.timezone
  }

  return timeObj.toLocaleTimeString('en-US', timeOptions)
}

export const formatDateTime = (date: string | Date, settings?: { dateFormat: string; timeFormat: string; timezone: string }): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date

  // If settings are provided, use them; otherwise use context
  const formatSettings = settings || getCurrentSettings()

  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: formatSettings.timeFormat === '12h',
    timeZone: formatSettings.timezone
  }

  return dateObj.toLocaleDateString('en-US', options)
}

// Helper function to get current settings (for when context is not available)
const getCurrentSettings = () => {
  try {
    const savedSettings = localStorage.getItem('roomify-settings')
    if (savedSettings) {
      const parsed = JSON.parse(savedSettings)
      return parsed.general || {
        language: 'en',
        timezone: 'UTC',
        dateFormat: 'MM/DD/YYYY',
        timeFormat: '12h'
      }
    }
  } catch (error) {
    console.error('Failed to get settings from localStorage:', error)
  }

  return {
    language: 'en',
    timezone: 'UTC',
    dateFormat: 'MM/DD/YYYY',
    timeFormat: '12h'
  }
}

export const formatRelativeTime = (date: string | Date, settings?: { dateFormat: string; timezone: string }): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000)

  if (diffInSeconds < 60) {
    return 'Just now'
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60)
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600)
    return `${hours} hour${hours > 1 ? 's' : ''} ago`
  } else if (diffInSeconds < 2592000) {
    const days = Math.floor(diffInSeconds / 86400)
    return `${days} day${days > 1 ? 's' : ''} ago`
  } else {
    // Use the formatDate function with settings for older dates
    return formatDate(dateObj, settings)
  }
}

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

export const capitalizeFirst = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + '...'
}

export const formatPhoneNumber = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, '')
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/)
  if (match) {
    return '(' + match[1] + ') ' + match[2] + '-' + match[3]
  }
  return phone
}

export const formatPercentage = (value: number, decimals = 1): string => {
  return `${value.toFixed(decimals)}%`
}


