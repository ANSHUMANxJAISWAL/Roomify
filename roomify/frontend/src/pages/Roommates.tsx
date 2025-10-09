import React, { useState, useEffect } from 'react';
import { 
  Plus, Edit, Trash2, User as UserIcon, Mail, Phone, 
  MapPin, Users, Home, Calendar, MessageCircle, Settings 
} from 'lucide-react';
import { Address } from '../types';
import { useDashboard } from '../contexts/DashboardContext';
import { formatDate } from '../utils/formatters';
import { 
  formatAddress, 
  formatHouseholdMemberName, 
  getMemberEmail, 
  getMemberPhone, 
  getMemberJoinDate 
} from '../utils/format';
import { Household, HouseholdMember, User, HouseholdMemberRole, HouseholdMemberStatus } from '../types';

// Helper functions will be defined inside the component to avoid redeclaration

interface RoommateFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: HouseholdMemberRole;
  bio: string;
}

interface HouseholdFormData {
  name: string;
  address: Address | string; // Allow both Address and string for form input
  description: string;
  rules: string[];
}

const Roommates: React.FC = () => {
  const { households, loading } = useDashboard();
  
  // State for UI
  const [activeTab, setActiveTab] = useState<'members' | 'household' | 'rules'>('members');
  const [showAddRoommateModal, setShowAddRoommateModal] = useState(false);
  const [showEditHouseholdModal, setShowEditHouseholdModal] = useState(false);
  const [showCreateHouseholdModal, setShowCreateHouseholdModal] = useState(false);
  const [editingRoommate, setEditingRoommate] = useState<HouseholdMember | null>(null);
  const [editingHousehold, setEditingHousehold] = useState<Household | null>(null);
  
  // Form states
  const [roommateFormData, setRoommateFormData] = useState<RoommateFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    role: HouseholdMemberRole.MEMBER,
    bio: ''
  });
  
  const [householdFormData, setHouseholdFormData] = useState<HouseholdFormData>({
    name: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: ''
    },
    description: '',
    rules: []
  });
  
  // Get current household (assuming first household for now)
  const currentHousehold = households?.[0]
  const isAdmin = true // Demo admin status since auth is removed
  
  // Get current user's membership (demo data)
  const currentUserMembership = currentHousehold?.members?.[0];

  // Helper function to safely access member properties
  const getMemberProperty = (member: HouseholdMember, prop: keyof HouseholdMember | keyof User): any => {
    if (!member) return '';
    if (prop in member) {
      return member[prop as keyof HouseholdMember];
    }
    if (member.user && prop in member.user) {
      return member.user[prop as keyof User];
    }
    return '';
  };

  // Helper function to get role color
  const getRoleColor = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return 'bg-purple-100 text-purple-800';
      case 'MEMBER':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Helper function to get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-800';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'INVITED':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  useEffect(() => {
    if (households && households.length > 0) {
      // setCurrentHousehold(households[0]);
    }
  }, [households]);

  // Initialize form data when editing
  useEffect(() => {
    if (editingHousehold) {
      setHouseholdFormData({
        name: editingHousehold.name || '',
        address: typeof editingHousehold.address === 'string' 
          ? { street: '', city: '', state: '', zipCode: '', country: '' }
          : editingHousehold.address,
        description: editingHousehold.description || '',
        rules: Array.isArray(editingHousehold.rules) ? [...editingHousehold.rules] : []
      });
    }
  }, [editingHousehold]);

  // Initialize form data when editing a roommate
  useEffect(() => {
    if (editingRoommate) {
      setRoommateFormData({
        firstName: editingRoommate.user?.firstName || '',
        lastName: editingRoommate.user?.lastName || '',
        email: editingRoommate.user?.email || '',
        phone: editingRoommate.user?.phone || '',
        role: editingRoommate.role || HouseholdMemberRole.MEMBER,
        bio: editingRoommate.user?.bio || ''
      });
    }
  }, [editingRoommate]);

  // Handle adding a new roommate
  const handleAddRoommate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // TODO: Implement API call to add roommate
      console.log('Adding roommate:', roommateFormData);
      setShowAddRoommateModal(false);
      setRoommateFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        role: HouseholdMemberRole.MEMBER,
        bio: ''
      });
    } catch (error) {
      console.error('Error adding roommate:', error);
    }
  };

  // Handle editing a roommate
  const handleEditRoommate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRoommate) return;
    
    try {
      // TODO: Implement roommate update API call
      console.log('Updating roommate:', editingRoommate)
      setEditingRoommate(null)
    } catch (error) {
      console.error('Error updating roommate:', error)
    }
  }

  const handleEditHousehold = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingHousehold?.id) return
    
    try {
      // TODO: Implement household update API call
      console.log('Updating household:', editingHousehold)
      setShowEditHouseholdModal(false)
      setEditingHousehold(null)
    } catch (error) {
      console.error('Error updating household:', error)
    }
  }

  // Handle removing a roommate
  const handleRemoveRoommate = (roommateId: string) => {
    if (window.confirm('Are you sure you want to remove this roommate?')) {
      console.log(`Removing roommate with ID: ${roommateId}`);
      // TODO: Implement actual removal logic with API call
    }
  };

  // Handle deleting the household
  const handleDeleteHousehold = () => {
    if (window.confirm('Are you sure you want to delete this household? This action cannot be undone.')) {
      console.log('Deleting household');
      // TODO: Implement actual deletion logic with API call
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!currentHousehold) {
    return (
      <div className="text-center py-12">
        <Home className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-lg font-medium text-gray-900">No household found</h3>
        <p className="mt-1 text-sm text-gray-500">Create or join a household to get started.</p>
        <button 
          className="btn-primary mt-4"
          onClick={() => setShowCreateHouseholdModal(true)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Household
        </button>
        
        {showCreateHouseholdModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h2 className="text-xl font-semibold mb-4">Create New Household</h2>
              <form onSubmit={(e) => {
                e.preventDefault();
                // TODO: Implement create household logic
                setShowCreateHouseholdModal(false);
              }} className="space-y-4">
                <div>
                  <label htmlFor="householdName" className="form-label">Household Name</label>
                  <input
                    id="householdName"
                    type="text"
                    className="input-field"
                    placeholder="Enter household name"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="householdAddress" className="form-label">Address</label>
                  <input
                    id="householdAddress"
                    type="text"
                    className="input-field"
                    placeholder="Enter full address"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="householdDescription" className="form-label">Description (Optional)</label>
                  <textarea
                    id="householdDescription"
                    className="input-field"
                    rows={3}
                    placeholder="Tell us about your household"
                  />
                </div>
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowCreateHouseholdModal(false)}
                    className="btn-outline"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-primary"
                  >
                    Create Household
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Roommates</h1>
          <p className="mt-1 text-sm text-gray-500">
            {currentHousehold.members?.length || 0} members in your household
          </p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setShowAddRoommateModal(true)}
            className="btn-primary flex items-center"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Roommate
          </button>
          
          {isAdmin && (
            <button
              onClick={() => setShowEditHouseholdModal(true)}
              className="btn-secondary flex items-center"
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit Household
            </button>
          )}
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
          <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
          <span>{formatAddress(currentHousehold.address)}</span>
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

      {/* Member List */}
      <div className="mt-6">
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul role="list" className="divide-y divide-gray-200">
            {currentHousehold?.members?.length > 0 ? (
              currentHousehold.members.map((member) => (
                <li key={member.id} className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {formatHouseholdMemberName(member)}
                      </p>
                      <p className="text-sm text-gray-500 truncate">
                        {getMemberEmail(member)}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        member.role === 'ADMIN' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {member.role}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        member.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {member.status}
                      </span>
                    </div>
                  </div>

                  {member.user?.bio && (
                    <p className="text-gray-600 text-sm mt-4">{member.user.bio}</p>
                  )}

                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      {member.user?.phone && (
                        <div className="flex items-center">
                          <Phone className="h-4 w-4 mr-2" />
                          <span>{member.user.phone}</span>
                        </div>
                      )}
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2" />
                        <span>Joined {getMemberJoinDate(member)}</span>
                      </div>
                    </div>
                  </div>

                  {isAdmin && (
                    <div className="mt-4 flex space-x-2">
                      <button
                        type="button"
                        onClick={() => setEditingRoommate(member)}
                        className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemoveRoommate(member.id)}
                        className="inline-flex items-center px-3 py-1.5 border border-red-300 shadow-sm text-sm leading-4 font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Remove
                      </button>
                    </div>
                  )}
                </li>
              ))
            ) : (
              <li className="px-4 py-4 sm:px-6">
                <div className="text-center py-12">
                  <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No roommates yet</h3>
                  <p className="text-gray-500">Add your first roommate to get started!</p>
                </div>
              </li>
            )}
          </ul>
        </div>
      </div>

      {activeTab === 'household' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Household Details</h3>
              {isAdmin && (
                <button
                  onClick={() => {
                    setHouseholdFormData({
                      name: currentHousehold.name,
                      address: currentHousehold.address || {
                        street: '',
                        city: '',
                        state: '',
                        zipCode: '',
                        country: ''
                      },
                      description: currentHousehold.description || '',
                      rules: currentHousehold.rules || []
                    });
                    setShowEditHouseholdModal(true);
                  }}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  Edit
                </button>
              )}
            </div>
            
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-500">Name</h4>
                <p className="mt-1 text-gray-900">{currentHousehold.name}</p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-500">Address</h4>
                <p className="mt-1 text-gray-900">{formatAddress(currentHousehold.address)}</p>
              </div>
              
              {currentHousehold.description && (
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Description</h4>
                  <p className="mt-1 text-gray-900">{currentHousehold.description}</p>
                </div>
              )}
              
              <div>
                <h4 className="text-sm font-medium text-gray-500">Created</h4>
                <p className="mt-1 text-gray-900">{formatDate(currentHousehold.createdAt)}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'rules' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">House Rules</h3>
              {isAdmin && (
                <button
                  onClick={() => setActiveTab('household')}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  Edit Rules
                </button>
              )}
            </div>
            {Array.isArray((currentHousehold as any).rules) && (currentHousehold as any).rules.length > 0 ? (
              <ul className="space-y-2">
                {(currentHousehold as any).rules.map((rule: string, index: number) => (
                  <li key={index} className="flex items-start">
                    <span className="text-primary-600 mr-2">•</span>
                    <span>{rule}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No rules have been set for this household yet.</p>
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
            <form onSubmit={(e) => {
              e.preventDefault();
              // Handle add roommate logic here
              setShowAddRoommateModal(false);
            }} className="space-y-4">
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
            <form onSubmit={(e) => {
              e.preventDefault();
              // Handle edit household logic here
              setShowEditHouseholdModal(false);
            }} className="space-y-4">
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
                <div className="space-y-2">
                  <input
                    id="street"
                    type="text"
                    value={typeof householdFormData.address === 'string' ? '' : householdFormData.address?.street || ''}
                    onChange={(e) => {
                      const currentAddress = typeof householdFormData.address === 'string' 
                        ? { street: '', city: '', state: '', zipCode: '', country: '' }
                        : householdFormData.address;
                      setHouseholdFormData({
                        ...householdFormData,
                        address: {
                          ...currentAddress,
                          street: e.target.value
                        }
                      });
                    }}
                    className="input-field"
                    required
                    placeholder="Street address"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={typeof householdFormData.address === 'string' ? '' : householdFormData.address?.city || ''}
                      onChange={(e) => {
                        const currentAddress = typeof householdFormData.address === 'string' 
                          ? { street: '', city: '', state: '', zipCode: '', country: '' }
                          : householdFormData.address;
                        setHouseholdFormData({
                          ...householdFormData,
                          address: {
                            ...currentAddress,
                            city: e.target.value
                          }
                        });
                      }}
                      className="input-field"
                      required
                      placeholder="City"
                    />
                    <input
                      type="text"
                      value={typeof householdFormData.address === 'string' ? '' : householdFormData.address?.state || ''}
                      onChange={(e) => {
                        const currentAddress = typeof householdFormData.address === 'string' 
                          ? { street: '', city: '', state: '', zipCode: '', country: '' }
                          : householdFormData.address;
                        setHouseholdFormData({
                          ...householdFormData,
                          address: {
                            ...currentAddress,
                            state: e.target.value
                          }
                        });
                      }}
                      className="input-field"
                      required
                      placeholder="State/Province"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={typeof householdFormData.address === 'string' ? '' : householdFormData.address?.zipCode || ''}
                      onChange={(e) => {
                        const currentAddress = typeof householdFormData.address === 'string' 
                          ? { street: '', city: '', state: '', zipCode: '', country: '' }
                          : householdFormData.address;
                        setHouseholdFormData({
                          ...householdFormData,
                          address: {
                            ...currentAddress,
                            zipCode: e.target.value
                          }
                        });
                      }}
                      className="input-field"
                      required
                      placeholder="ZIP/Postal code"
                    />
                    <input
                      type="text"
                      value={typeof householdFormData.address === 'string' ? '' : householdFormData.address?.country || ''}
                      onChange={(e) => {
                        const currentAddress = typeof householdFormData.address === 'string' 
                          ? { street: '', city: '', state: '', zipCode: '', country: '' }
                          : householdFormData.address;
                        setHouseholdFormData({
                          ...householdFormData,
                          address: {
                            ...currentAddress,
                            country: e.target.value
                          }
                        });
                      }}
                      className="input-field"
                      required
                      placeholder="Country"
                    />
                  </div>
                </div>
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
            <form onSubmit={(e) => {
              e.preventDefault();
              // Handle edit roommate logic here
              setEditingRoommate(null);
            }} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="editFirstName" className="form-label">First Name</label>
                  <input
                    id="editFirstName"
                    type="text"
                    value={editingRoommate.user?.firstName || ''}
                    onChange={(e) => setEditingRoommate({
                      ...editingRoommate,
                      user: {
                        ...editingRoommate.user,
                        firstName: e.target.value
                      }
                    })}
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="editLastName" className="form-label">Last Name</label>
                  <input
                    id="editLastName"
                    type="text"
                    value={editingRoommate.user?.lastName || ''}
                    onChange={(e) => setEditingRoommate({
                      ...editingRoommate,
                      user: {
                        ...editingRoommate.user,
                        lastName: e.target.value
                      }
                    })}
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
                  value={editingRoommate.user?.email || ''}
                  onChange={(e) => setEditingRoommate({
                    ...editingRoommate,
                    user: {
                      ...editingRoommate.user,
                      email: e.target.value
                    }
                  })}
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label htmlFor="editPhone" className="form-label">Phone</label>
                <input
                  id="editPhone"
                  type="tel"
                  value={editingRoommate.user?.phone || ''}
                  onChange={(e) => setEditingRoommate({
                    ...editingRoommate,
                    user: {
                      ...editingRoommate.user,
                      phone: e.target.value
                    }
                  })}
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
                  value={editingRoommate.user.bio || ''}
                  onChange={(e) => setEditingRoommate({
                    ...editingRoommate,
                    user: {
                      ...editingRoommate.user,
                      bio: e.target.value
                    }
                  })}
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
  );
};

export default Roommates;
