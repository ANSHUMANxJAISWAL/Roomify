import React, { useState } from 'react';
import { Home, Users, MapPin, Calendar, Plus, Search, Edit2, Trash2, UserPlus } from 'lucide-react';

interface Household {
  id: string;
  name: string;
  description: string;
  address: string;
  memberCount: number;
  maxMembers: number;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
  inviteCode: string;
}

const Households: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);

  const mockHouseholds: Household[] = [
    {
      id: '1',
      name: 'Downtown Apartment',
      description: 'Cozy apartment in the heart of the city',
      address: '123 Main St, New York, NY 10001',
      memberCount: 4,
      maxMembers: 6,
      status: 'ACTIVE',
      createdAt: '2024-01-15',
      inviteCode: 'DTN-2024',
    },
    {
      id: '2',
      name: 'Sunset Villa',
      description: 'Beautiful villa with amazing sunset views',
      address: '456 Beach Blvd, Los Angeles, CA 90001',
      memberCount: 3,
      maxMembers: 5,
      status: 'ACTIVE',
      createdAt: '2024-02-20',
      inviteCode: 'SNT-2024',
    },
    {
      id: '3',
      name: 'Campus Housing',
      description: 'Student housing near university campus',
      address: '789 College Ave, Boston, MA 02101',
      memberCount: 5,
      maxMembers: 8,
      status: 'ACTIVE',
      createdAt: '2024-01-10',
      inviteCode: 'CMP-2024',
    },
  ];

  const filteredHouseholds = mockHouseholds.filter(
    (household) =>
      household.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      household.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="card glow-blue">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold text-gradient-heading mb-2">Households</h1>
            <p className="text-gray-400">Manage your shared living spaces</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="btn-primary"
          >
            <Plus className="h-5 w-5 mr-2" />
            Create Household
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="card">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search households by name or address..."
              className="input-field pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center space-x-2">
            <Home className="h-5 w-5 text-blue-400" />
            <span className="text-sm text-gray-400">
              {filteredHouseholds.length} {filteredHouseholds.length === 1 ? 'household' : 'households'}
            </span>
          </div>
        </div>
      </div>

      {/* Households Grid */}
      {filteredHouseholds.length === 0 ? (
        <div className="card text-center py-12">
          <div className="mx-auto h-24 w-24 text-gray-400 mb-4">
            <Home className="h-full w-full opacity-50" />
          </div>
          <h3 className="text-xl font-medium text-gray-200 mb-2">No households found</h3>
          <p className="text-gray-400 mb-6">
            {searchQuery ? 'Try a different search term' : 'Create your first household to get started'}
          </p>
          {!searchQuery && (
            <button onClick={() => setShowCreateModal(true)} className="btn-primary mx-auto">
              <Plus className="h-5 w-5 mr-2" />
              Create Household
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredHouseholds.map((household) => (
            <div key={household.id} className="card glow-purple transform hover:scale-105 transition-all duration-300">
              {/* Card Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-xl">
                    <Home className="h-6 w-6 text-purple-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">{household.name}</h3>
                    <span className="badge badge-success mt-1">{household.status}</span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <p className="text-sm text-gray-400 mb-4">{household.description}</p>

              {/* Details */}
              <div className="space-y-3 mb-4">
                <div className="flex items-start space-x-2">
                  <MapPin className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-300">{household.address}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-300">
                      {household.memberCount} / {household.maxMembers} members
                    </span>
                  </div>
                  <div className="flex-1 mx-3">
                    <div className="w-full bg-slate-700 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(household.memberCount / household.maxMembers) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-300">
                    Created {new Date(household.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {/* Invite Code */}
              <div className="bg-slate-800/50 rounded-xl p-3 mb-4">
                <p className="text-xs text-gray-400 mb-1">Invite Code</p>
                <p className="text-sm font-mono font-bold text-purple-400">{household.inviteCode}</p>
              </div>

              {/* Actions */}
              <div className="flex items-center space-x-2 pt-4 border-t border-slate-700/50">
                <button className="flex-1 btn-secondary text-sm py-2">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Invite
                </button>
                <button className="btn-outline text-sm py-2 px-3" aria-label="Edit household">
                  <Edit2 className="h-4 w-4" />
                </button>
                <button className="btn-outline text-sm py-2 px-3 hover:bg-red-500/10 hover:border-red-500/30" aria-label="Delete household">
                  <Trash2 className="h-4 w-4 text-red-400" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Households;
