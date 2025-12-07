import React, { useState, useEffect } from 'react';
import { Users as UsersIcon, Mail, Shield, UserPlus, Edit2, Trash2, RefreshCw } from 'lucide-react';

// Define User type matching backend response
interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string | null;
  role: 'ADMIN' | 'USER' | 'MODERATOR' | 'HOUSEHOLD_ADMIN';
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'LOCKED' | 'EXPIRED' | 'PENDING_VERIFICATION';
  createdAt: string;
  updatedAt: string;
}

const Users: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  // Format date helper function
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Fetch users from real API
  const fetchUsers = async (query: string = '') => {
    try {
      setLoading(true);
      setError(null);
      
      let url = 'http://localhost:8080/api/users';
      if (query) {
        url += `/search?name=${encodeURIComponent(query)}&email=${encodeURIComponent(query)}`;
      }
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('Failed to fetch users. Please make sure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchUsers(searchQuery);
    setRefreshing(false);
  };

  const handleDelete = async (userId: string, userName: string) => {
    if (window.confirm(`Are you sure you want to delete ${userName}?`)) {
      try {
        const response = await fetch(`http://localhost:8080/api/users/${userId}`, {
          method: 'DELETE',
        });
        
        if (response.ok) {
          alert('User deleted successfully!');
          await fetchUsers(searchQuery);
        } else {
          alert('Failed to delete user');
        }
      } catch (error) {
        console.error('Error deleting user:', error);
        alert('Error deleting user. Please try again.');
      }
    }
  };

  const handleEdit = (user: User) => {
    alert(`Edit functionality coming soon for ${user.firstName} ${user.lastName || ''}`);
    // TODO: Open edit modal with user data
  };

  const handleAddUser = () => {
    alert('Add User functionality coming soon!');
    // TODO: Open create user modal
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchUsers(searchQuery);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  if (loading && users.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <p className="text-red-500">{error}</p>
        <button
          onClick={() => fetchUsers(searchQuery)}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="card glow-purple">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold text-gradient-heading mb-2">Users Management</h1>
            <p className="text-gray-400">Manage and search users in the Roomify system</p>
          </div>
          <div className="flex items-center space-x-3">
            <button onClick={handleRefresh} className="btn-outline" disabled={refreshing}>
              <RefreshCw className={`h-5 w-5 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            <button onClick={handleAddUser} className="btn-primary">
              <UserPlus className="h-5 w-5 mr-2" />
              Add User
            </button>
          </div>
        </div>
      </div>
      
      {/* Search and Stats */}
      <div className="card">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search users by name or email..."
              className="input-field pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex items-center space-x-2 bg-purple-500/20 px-4 py-2 rounded-xl border border-purple-500/30">
            <UsersIcon className="h-5 w-5 text-purple-400" />
            <span className="text-sm font-medium text-white">{users.length} {users.length === 1 ? 'user' : 'users'}</span>
          </div>
        </div>
      </div>

      {/* Users Grid */}
      {users.length === 0 ? (
        <div className="text-center py-12">
          <div className="mx-auto h-24 w-24 text-gray-400">
            <UsersIcon className="h-full w-full opacity-50" />
          </div>
          <h3 className="mt-2 text-lg font-medium text-gray-200">No users found</h3>
          <p className="mt-1 text-gray-400">
            {searchQuery ? 'Try a different search term' : 'No users available'}
          </p>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="mt-4 text-sm text-primary-400 hover:text-primary-300"
            >
              Clear search
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {users.map((user) => (
          <div key={user.id} className="card glow-purple transform hover:scale-105 transition-all duration-300">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center">
                <div className="h-14 w-14 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-xl flex items-center justify-center">
                  <UsersIcon className="h-7 w-7 text-purple-400" />
                </div>
                <div className="ml-4">
                  <p className="text-xl font-bold text-white">
                    {user.firstName} {user.lastName || ''}
                  </p>
                  <p className="text-sm text-gray-400">{user.email}</p>
                </div>
              </div>
              <div className="flex space-x-2">
                <button 
                  onClick={() => handleEdit(user)} 
                  className="btn-outline p-2 hover:bg-blue-500/10 hover:border-blue-500/30" 
                  title="Edit user"
                  aria-label="Edit user"
                >
                  <Edit2 className="h-4 w-4 text-blue-400" />
                </button>
                <button 
                  onClick={() => handleDelete(user.id, `${user.firstName} ${user.lastName || ''}`)} 
                  className="btn-outline p-2 hover:bg-red-500/10 hover:border-red-500/30" 
                  title="Delete user"
                  aria-label="Delete user"
                >
                  <Trash2 className="h-4 w-4 text-red-400" />
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Role</span>
                <span className={`badge badge-${user.role === 'ADMIN' ? 'danger' : 'info'}`}>
                  {user.role}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Status</span>
                <span className={`badge badge-${user.status === 'ACTIVE' ? 'success' : 'warning'}`}>
                  {user.status}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Created</span>
                <span className="text-sm text-gray-300">
                  {formatDate(user.createdAt)}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Updated</span>
                <span className="text-sm text-gray-300">
                  {formatDate(user.updatedAt)}
                </span>
              </div>
            </div>
          </div>
          ))}
        </div>
      )}

      {/* Sample Credentials Card */}
      <div className="card glow-blue">
        <div className="flex items-center mb-4">
          <Shield className="h-6 w-6 text-blue-400 mr-3" />
          <h2 className="text-xl font-bold text-gradient-heading">Sample User Credentials</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Mail className="h-4 w-4 text-purple-400" />
              <span className="text-sm font-medium text-gray-200">admin@roomify.com</span>
            </div>
            <p className="text-xs text-gray-400 ml-6">Password: admin123</p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Mail className="h-4 w-4 text-blue-400" />
              <span className="text-sm font-medium text-gray-200">john@roomify.com</span>
            </div>
            <p className="text-xs text-gray-400 ml-6">Password: john123</p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Mail className="h-4 w-4 text-pink-400" />
              <span className="text-sm font-medium text-gray-200">jane@roomify.com</span>
            </div>
            <p className="text-xs text-gray-400 ml-6">Password: jane123</p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Mail className="h-4 w-4 text-yellow-400" />
              <span className="text-sm font-medium text-gray-200">guest@roomify.com</span>
            </div>
            <p className="text-xs text-gray-400 ml-6">Password: guest123</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Users
