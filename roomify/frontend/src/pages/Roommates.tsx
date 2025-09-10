import React, { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, User, Mail, Phone, MapPin, Users, Home, Calendar, MessageCircle, Settings } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { useDashboard } from '../contexts/DashboardContext'
import { formatDate } from '../utils/formatters'

interface Roommate {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  avatar: string
  role: 'ADMIN' | 'MEMBER' | 'GUEST'
  status: 'ACTIVE' | 'INACTIVE' | 'PENDING'
  joinDate: string
  bio: string
  preferences: {
    quietHours: string
    cleaningSchedule: string
    guestPolicy: string
  }
}

interface Household {
  id: string
  name: string
  address: string
  description: string
  rules: string[]
  createdAt: string
  members: Roommate[]
}

const Roommates: React.FC = () => {
  const { user } = useAuth()
  const { households, loading } = useDashboard()
  const [showAddRoommateModal, setShowAddRoommateModal] = useState(false)
  const [showEditHouseholdModal, setShowEditHouseholdModal] = useState(false)
  const [editingRoommate, setEditingRoommate] = useState<Roommate | null>(null)
  const [editingHousehold, setEditingHousehold] = useState<Household | null>(null)
  const [activeTab, setActiveTab] = useState<'members' | 'household' | 'rules'>('members')

  const [roommateFormData, setRoommateFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    role: 'MEMBER' as const,
    bio: ''
  })

  const [householdFormData, setHouseholdFormData] = useState({
    name: '',
    address: '',
    description: '',
    rules: [] as string[]
  })

  const currentHousehold = households?.[0] || null

  const handleAddRoommate = async (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implement roommate invitation API call
    setShowAddRoommateModal(false)
    setRoommateFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      role: 'MEMBER',
      bio: ''
    })
  }

  const handleEditRoommate = async (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implement roommate update API call
    setEditingRoommate(null)
  }

  const handleEditHousehold = async (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implement household update API call
    setShowEditHouseholdModal(false)
    setEditingHousehold(null)
  }

  const handleRemoveRoommate = async (roommateId: string) => {
    // TODO: Implement roommate removal API call
  }

  const handleDeleteHousehold = async () => {
    // TODO: Implement household deletion API call
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'ADMIN': return 'text-purple-600 bg-purple-100'
      case 'MEMBER': return 'text-blue-600 bg-blue-100'
      case 'GUEST': return 'text-gray-600 bg-gray-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'text-green-600 bg-green-100'
      case 'INACTIVE': return 'text-red-600 bg-red-100'
      case 'PENDING': return 'text-yellow-600 bg-yellow-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!currentHousehold) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <Home className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No household found</h3>
          <p className="text-gray-500">Create or join a household to get started!</p>
          <button className="btn-primary mt-4">
            <Plus className="h-4 w-4 mr-2" />
            Create Household
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Roommates</h1>
          <p className="text-gray-600">Manage your household and roommates.</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => setShowAddRoommateModal(true)}
            className="btn-primary"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Roommate
          </button>
          <button
            onClick={() => setShowEditHouseholdModal(true)}
            className="btn-outline"
          >
            <Settings className="h-4 w-4 mr-2" />
            Edit Household
          </button>
        </div>
      </div>

      {/* Household Info Card */}
      <div className="card">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{currentHousehold.name}</h2>
            <p className="text-gray-600">{currentHousehold.description}</p>
          </div>
          <div className="flex items-center space-x-2">
            <Users className="h-5 w-5 text-gray-400" />
            <span className="text-sm text-gray-500">{currentHousehold.members?.length || 0} members</span>
          </div>
        </div>
        <div className="flex items-center text-sm text-gray-500">
          <MapPin className="h-4 w-4 mr-2" />
          {currentHousehold.address}
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('members')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'members'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Members
          </button>
          <button
            onClick={() => setActiveTab('household')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'household'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Household
          </button>
          <button
            onClick={() => setActiveTab('rules')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'rules'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Rules & Policies
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'members' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentHousehold.members?.map((roommate) => (
              <div key={roommate.id} className="card hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                      <User className="h-6 w-6 text-primary-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {roommate.firstName} {roommate.lastName}
                      </h3>
                      <p className="text-sm text-gray-500">{roommate.email}</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(roommate.role)}`}>
                      {roommate.role}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(roommate.status)}`}>
                      {roommate.status}
                    </span>
                  </div>
                </div>

                {roommate.bio && (
                  <p className="text-gray-600 text-sm mb-4">{roommate.bio}</p>
                )}

                <div className="space-y-2 text-sm text-gray-500 mb-4">
                  {roommate.phone && (
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 mr-2" />
                      {roommate.phone}
                    </div>
                  )}
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    Joined {formatDate(roommate.joinDate)}
                  </div>
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={() => setEditingRoommate(roommate)}
                    className="btn-outline text-sm flex-1"
                    aria-label="Edit roommate"
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleRemoveRoommate(roommate.id)}
                    className="btn-outline text-sm flex-1 text-red-600 hover:text-red-700"
                    aria-label="Remove roommate"
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          {(!currentHousehold.members || currentHousehold.members.length === 0) && (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No roommates yet</h3>
              <p className="text-gray-500">Add your first roommate to get started!</p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'household' && (
        <div className="space-y-6">
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Household Information</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <p className="text-gray-900">{currentHousehold.name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <p className="text-gray-900">{currentHousehold.address}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <p className="text-gray-900">{currentHousehold.description}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Created</label>
                <p className="text-gray-900">{formatDate(currentHousehold.createdAt)}</p>
              </div>
            </div>
          </div>

          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Danger Zone</h3>
            <div className="border border-red-200 rounded-lg p-4 bg-red-50">
              <h4 className="text-sm font-medium text-red-800 mb-2">Delete Household</h4>
              <p className="text-sm text-red-700 mb-4">
                This action cannot be undone. This will permanently delete the household and remove all members.
              </p>
              <button
                onClick={handleDeleteHousehold}
                className="btn-outline text-red-600 border-red-300 hover:bg-red-50"
              >
                Delete Household
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'rules' && (
        <div className="space-y-6">
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">House Rules</h3>
            {currentHousehold.rules && currentHousehold.rules.length > 0 ? (
              <div className="space-y-3">
                {currentHousehold.rules.map((rule, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-primary-500 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-gray-700">{rule}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No house rules have been set yet.</p>
            )}
          </div>

          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Common Policies</h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Quiet Hours</h4>
                <p className="text-gray-600">10:00 PM - 8:00 AM</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Cleaning Schedule</h4>
                <p className="text-gray-600">Weekly rotation for common areas</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Guest Policy</h4>
                <p className="text-gray-600">Notify roommates 24 hours in advance</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Roommate Modal */}
      {showAddRoommateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Add New Roommate</h2>
            <form onSubmit={handleAddRoommate} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="form-label">First Name</label>
                  <input
                    id="firstName"
                    type="text"
                    value={roommateFormData.firstName}
                    onChange={(e) => setRoommateFormData({...roommateFormData, firstName: e.target.value})}
                    className="input-field"
                    required
                    placeholder="Enter first name"
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="form-label">Last Name</label>
                  <input
                    id="lastName"
                    type="text"
                    value={roommateFormData.lastName}
                    onChange={(e) => setRoommateFormData({...roommateFormData, lastName: e.target.value})}
                    className="input-field"
                    required
                    placeholder="Enter last name"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="email" className="form-label">Email</label>
                <input
                  id="email"
                  type="email"
                  value={roommateFormData.email}
                  onChange={(e) => setRoommateFormData({...roommateFormData, email: e.target.value})}
                  className="input-field"
                  required
                  placeholder="Enter email address"
                />
              </div>
              <div>
                <label htmlFor="phone" className="form-label">Phone (Optional)</label>
                <input
                  id="phone"
                  type="tel"
                  value={roommateFormData.phone}
                  onChange={(e) => setRoommateFormData({...roommateFormData, phone: e.target.value})}
                  className="input-field"
                  placeholder="Enter phone number"
                />
              </div>
              <div>
                <label htmlFor="role" className="form-label">Role</label>
                <select
                  id="role"
                  value={roommateFormData.role}
                  onChange={(e) => setRoommateFormData({...roommateFormData, role: e.target.value as any})}
                  className="select-field"
                  aria-label="Select roommate role"
                >
                  <option value="MEMBER">Member</option>
                  <option value="ADMIN">Admin</option>
                  <option value="GUEST">Guest</option>
                </select>
              </div>
              <div>
                <label htmlFor="bio" className="form-label">Bio (Optional)</label>
                <textarea
                  id="bio"
                  value={roommateFormData.bio}
                  onChange={(e) => setRoommateFormData({...roommateFormData, bio: e.target.value})}
                  className="input-field"
                  rows={3}
                  placeholder="Tell us about yourself"
                />
              </div>
              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  className="btn-primary flex-1"
                >
                  Send Invitation
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddRoommateModal(false)}
                  className="btn-outline flex-1"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Household Modal */}
      {showEditHouseholdModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Edit Household</h2>
            <form onSubmit={handleEditHousehold} className="space-y-4">
              <div>
                <label htmlFor="householdName" className="form-label">Household Name</label>
                <input
                  id="householdName"
                  type="text"
                  value={householdFormData.name}
                  onChange={(e) => setHouseholdFormData({...householdFormData, name: e.target.value})}
                  className="input-field"
                  required
                  placeholder="Enter household name"
                />
              </div>
              <div>
                <label htmlFor="address" className="form-label">Address</label>
                <input
                  id="address"
                  type="text"
                  value={householdFormData.address}
                  onChange={(e) => setHouseholdFormData({...householdFormData, address: e.target.value})}
                  className="input-field"
                  required
                  placeholder="Enter address"
                />
              </div>
              <div>
                <label htmlFor="description" className="form-label">Description</label>
                <textarea
                  id="description"
                  value={householdFormData.description}
                  onChange={(e) => setHouseholdFormData({...householdFormData, description: e.target.value})}
                  className="input-field"
                  rows={3}
                  placeholder="Describe your household"
                />
              </div>
              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  className="btn-primary flex-1"
                >
                  Update
                </button>
                <button
                  type="button"
                  onClick={() => setShowEditHouseholdModal(false)}
                  className="btn-outline flex-1"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Roommate Modal */}
      {editingRoommate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Edit Roommate</h2>
            <form onSubmit={handleEditRoommate} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="editFirstName" className="form-label">First Name</label>
                  <input
                    id="editFirstName"
                    type="text"
                    value={editingRoommate.firstName}
                    onChange={(e) => setEditingRoommate({...editingRoommate, firstName: e.target.value})}
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="editLastName" className="form-label">Last Name</label>
                  <input
                    id="editLastName"
                    type="text"
                    value={editingRoommate.lastName}
                    onChange={(e) => setEditingRoommate({...editingRoommate, lastName: e.target.value})}
                    className="input-field"
                    required
                  />
                </div>
              </div>
              <div>
                <label htmlFor="editEmail" className="form-label">Email</label>
                <input
                  id="editEmail"
                  type="email"
                  value={editingRoommate.email}
                  onChange={(e) => setEditingRoommate({...editingRoommate, email: e.target.value})}
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label htmlFor="editPhone" className="form-label">Phone</label>
                <input
                  id="editPhone"
                  type="tel"
                  value={editingRoommate.phone}
                  onChange={(e) => setEditingRoommate({...editingRoommate, phone: e.target.value})}
                  className="input-field"
                />
              </div>
              <div>
                <label htmlFor="editRole" className="form-label">Role</label>
                <select
                  id="editRole"
                  value={editingRoommate.role}
                  onChange={(e) => setEditingRoommate({...editingRoommate, role: e.target.value as any})}
                  className="select-field"
                  aria-label="Select roommate role"
                >
                  <option value="MEMBER">Member</option>
                  <option value="ADMIN">Admin</option>
                  <option value="GUEST">Guest</option>
                </select>
              </div>
              <div>
                <label htmlFor="editBio" className="form-label">Bio</label>
                <textarea
                  id="editBio"
                  value={editingRoommate.bio}
                  onChange={(e) => setEditingRoommate({...editingRoommate, bio: e.target.value})}
                  className="input-field"
                  rows={3}
                />
              </div>
              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  className="btn-primary flex-1"
                >
                  Update
                </button>
                <button
                  type="button"
                  onClick={() => setEditingRoommate(null)}
                  className="btn-outline flex-1"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Roommates


