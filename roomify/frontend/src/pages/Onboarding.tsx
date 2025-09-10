import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Check, ArrowRight, Home, Users, Bell, Shield, Star } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'

interface OnboardingStep {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  completed: boolean
}

const Onboarding: React.FC = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [currentStep, setCurrentStep] = useState(0)
  const [householdData, setHouseholdData] = useState({
    name: '',
    address: '',
    description: '',
    roommates: []
  })
  const [preferences, setPreferences] = useState({
    notifications: true,
    reminders: true,
    expenseTracking: true,
    choreManagement: true
  })

  const steps: OnboardingStep[] = [
    {
      id: 'welcome',
      title: 'Welcome to RoomiFy!',
      description: 'Let\'s get you set up with your household management system.',
      icon: <Star className="h-8 w-8 text-primary-600" />,
      completed: false
    },
    {
      id: 'household',
      title: 'Set Up Your Household',
      description: 'Create or join a household to get started.',
      icon: <Home className="h-8 w-8 text-primary-600" />,
      completed: false
    },
    {
      id: 'roommates',
      title: 'Add Roommates',
      description: 'Invite your roommates to join the household.',
      icon: <Users className="h-8 w-8 text-primary-600" />,
      completed: false
    },
    {
      id: 'preferences',
      title: 'Customize Preferences',
      description: 'Set up your notification and feature preferences.',
      icon: <Bell className="h-8 w-8 text-primary-600" />,
      completed: false
    },
    {
      id: 'security',
      title: 'Security & Privacy',
      description: 'Configure your security and privacy settings.',
      icon: <Shield className="h-8 w-8 text-primary-600" />,
      completed: false
    }
  ]

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      completeOnboarding()
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSkip = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      completeOnboarding()
    }
  }

  const completeOnboarding = async () => {
    try {
      // TODO: Implement onboarding completion API call
      navigate('/dashboard')
    } catch (error) {
      console.error('Failed to complete onboarding:', error)
    }
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="text-center space-y-6">
            <div className="mx-auto w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center">
              {steps[0].icon}
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Welcome to RoomiFy!
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                The smart way to manage your household, track expenses, assign chores, and stay connected with your roommates.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Home className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Household Management</h3>
                <p className="text-gray-600">Organize your living space and manage shared responsibilities.</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Roommate Coordination</h3>
                <p className="text-gray-600">Stay connected and coordinate with your roommates seamlessly.</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Bell className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Smart Notifications</h3>
                <p className="text-gray-600">Get timely reminders and updates about household activities.</p>
              </div>
            </div>
          </div>
        )

      case 1:
        return (
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Set Up Your Household</h2>
              <p className="text-gray-600">Create a new household or join an existing one.</p>
            </div>
            <div className="space-y-6">
              <div>
                <label htmlFor="householdName" className="form-label">Household Name</label>
                <input
                  id="householdName"
                  type="text"
                  value={householdData.name}
                  onChange={(e) => setHouseholdData({...householdData, name: e.target.value})}
                  className="input-field"
                  placeholder="e.g., Sunshine Apartments, The Cozy House"
                  required
                />
              </div>
              <div>
                <label htmlFor="address" className="form-label">Address</label>
                <input
                  id="address"
                  type="text"
                  value={householdData.address}
                  onChange={(e) => setHouseholdData({...householdData, address: e.target.value})}
                  className="input-field"
                  placeholder="Enter your full address"
                  required
                />
              </div>
              <div>
                <label htmlFor="description" className="form-label">Description (Optional)</label>
                <textarea
                  id="description"
                  value={householdData.description}
                  onChange={(e) => setHouseholdData({...householdData, description: e.target.value})}
                  className="input-field"
                  rows={3}
                  placeholder="Tell us about your household..."
                />
              </div>
              <div className="flex space-x-4">
                <button className="btn-primary flex-1">
                  <Home className="h-4 w-4 mr-2" />
                  Create Household
                </button>
                <button className="btn-outline flex-1">
                  <Users className="h-4 w-4 mr-2" />
                  Join Existing
                </button>
              </div>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Add Roommates</h2>
              <p className="text-gray-600">Invite your roommates to join your household.</p>
            </div>
            <div className="space-y-4">
              <div className="card p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Invite Roommates</h3>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="roommateEmail" className="form-label">Email Address</label>
                    <input
                      id="roommateEmail"
                      type="email"
                      className="input-field"
                      placeholder="roommate@example.com"
                    />
                  </div>
                  <div>
                    <label htmlFor="roommateRole" className="form-label">Role</label>
                    <select id="roommateRole" className="select-field">
                      <option value="MEMBER">Member</option>
                      <option value="ADMIN">Admin</option>
                      <option value="GUEST">Guest</option>
                    </select>
                  </div>
                  <button className="btn-primary w-full">
                    <Users className="h-4 w-4 mr-2" />
                    Send Invitation
                  </button>
                </div>
              </div>
              <div className="text-center">
                <p className="text-gray-500">You can add more roommates later from the Roommates page.</p>
              </div>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Customize Your Experience</h2>
              <p className="text-gray-600">Choose which features and notifications you'd like to enable.</p>
            </div>
            <div className="space-y-6">
              <div className="card p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Feature Preferences</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">Expense Tracking</h4>
                      <p className="text-sm text-gray-500">Track shared expenses and split bills</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={preferences.expenseTracking}
                        onChange={(e) => setPreferences({...preferences, expenseTracking: e.target.checked})}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                    </label>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">Chore Management</h4>
                      <p className="text-sm text-gray-500">Assign and track household chores</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={preferences.choreManagement}
                        onChange={(e) => setPreferences({...preferences, choreManagement: e.target.checked})}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                    </label>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">Reminders & Notifications</h4>
                      <p className="text-sm text-gray-500">Get notified about important events</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={preferences.reminders}
                        onChange={(e) => setPreferences({...preferences, reminders: e.target.checked})}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )

      case 4:
        return (
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Security & Privacy</h2>
              <p className="text-gray-600">Configure your security and privacy settings.</p>
            </div>
            <div className="space-y-6">
              <div className="card p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Privacy Settings</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">Profile Visibility</h4>
                      <p className="text-sm text-gray-500">Allow other users to see your profile</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        defaultChecked
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                    </label>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">Data Collection</h4>
                      <p className="text-sm text-gray-500">Help us improve by collecting usage data</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        defaultChecked
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                    </label>
                  </div>
                </div>
              </div>
              <div className="text-center">
                <p className="text-gray-500">You can change these settings anytime from your Profile page.</p>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-8 px-4">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-900">Getting Started</h1>
            <span className="text-sm text-gray-500">
              Step {currentStep + 1} of {steps.length}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-primary-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Step Indicators */}
        <div className="flex items-center justify-between mb-12">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                index <= currentStep
                  ? 'bg-primary-600 border-primary-600 text-white'
                  : 'bg-white border-gray-300 text-gray-400'
              }`}>
                {index < currentStep ? (
                  <Check className="h-5 w-5" />
                ) : (
                  step.icon
                )}
              </div>
              {index < steps.length - 1 && (
                <div className={`w-16 h-0.5 mx-4 ${
                  index < currentStep ? 'bg-primary-600' : 'bg-gray-300'
                }`}></div>
              )}
            </div>
          ))}
        </div>

        {/* Step Content */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          {renderStepContent()}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className={`btn-outline ${currentStep === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            Previous
          </button>
          <div className="flex space-x-3">
            {currentStep < steps.length - 1 && (
              <button
                onClick={handleSkip}
                className="btn-outline"
              >
                Skip
              </button>
            )}
            <button
              onClick={handleNext}
              className="btn-primary"
            >
              {currentStep === steps.length - 1 ? (
                <>
                  Complete Setup
                  <Check className="h-4 w-4 ml-2" />
                </>
              ) : (
                <>
                  Next
                  <ArrowRight className="h-4 w-4 ml-2" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Onboarding


