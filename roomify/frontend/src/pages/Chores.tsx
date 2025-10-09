import React, { useState } from 'react'
import { Plus, Edit, Trash2, CheckSquare, CheckCircle, Clock, AlertTriangle, User, Calendar } from 'lucide-react'
import { useDashboard } from '../contexts/DashboardContext'
import { formatDate } from '../utils/formatters'
import { choreAPI } from '../services/api'
import { Chore } from '../types'

const Chores: React.FC = () => {
  const { chores, loading } = useDashboard()
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingChore, setEditingChore] = useState<Chore | null>(null)
  const [filterStatus, setFilterStatus] = useState('ALL')
  const [filterPriority, setFilterPriority] = useState('ALL')
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    assignedTo: '',
    dueDate: '',
    priority: 'MEDIUM' as 'LOW' | 'MEDIUM' | 'HIGH',
    frequency: 'WEEKLY' as 'ONE_TIME' | 'DAILY' | 'WEEKLY' | 'MONTHLY'
  })

  // Submit handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const choreData = {
        ...formData,
        assignedToId: 'demo-user-id', // Demo user ID since auth is removed
        householdId: 'demo-household-id' // Demo household ID since auth is removed
      }

      if (editingChore) {
        await choreAPI.updateChore(editingChore.id, choreData)
      } else {
        await choreAPI.createChore(choreData)
      }
      setShowCreateModal(false)
      setEditingChore(null)
      setFormData({ ...formData, title: '', description: '', assignedTo: '', dueDate: '', priority: 'MEDIUM', frequency: 'WEEKLY' })
    } catch (error) {
      console.error('Error saving chore:', error)
    }
  }

  // Status change handler (stub)
  const handleStatusChange = async (choreId: string, newStatus: string) => {
    // Implement status update via API
    await choreAPI.updateChore(choreId, { status: newStatus })
  }

  // Delete handler
  const handleDelete = async (choreId: string) => {
    await choreAPI.deleteChore(choreId)
  }

  // Filtering chores
  const filteredChores = (chores || []).filter(chore => {
    if (filterStatus !== 'ALL' && chore.status !== filterStatus) return false
    if (filterPriority !== 'ALL' && chore.priority !== filterPriority) return false
    return true
  })

  // Priority color helper
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'HIGH': return 'text-red-600 bg-red-100'
      case 'MEDIUM': return 'text-yellow-600 bg-yellow-100'
      case 'LOW': return 'text-green-600 bg-green-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  // Status color helper
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'text-green-600 bg-green-100'
      case 'IN_PROGRESS': return 'text-blue-600 bg-blue-100'
      case 'PENDING': return 'text-yellow-600 bg-yellow-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  // Status icon helper
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED': return <CheckCircle className="inline" size={16} />
      case 'IN_PROGRESS': return <Clock className="inline" size={16} />
      case 'PENDING': return <AlertTriangle className="inline" size={16} />
      default: return null
    }
  }

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400"></div>
      </div>
    );
  }

  return (
    <div>
      {/* Page Header */}
      <div className="header flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold text-gradient-heading drop-shadow-lg">Chores</h1>
        <button className="btn-primary" onClick={() => setShowCreateModal(true)}>
          <Plus className="h-4 w-4 mr-2" /> Assign Chore
        </button>
      </div>

      {/* Filters */}
      <div className="filters flex gap-3 mb-6">
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="input-field">
          <option value="ALL">All Statuses</option>
          <option value="PENDING">Pending</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="COMPLETED">Completed</option>
        </select>
        <select value={filterPriority} onChange={e => setFilterPriority(e.target.value)} className="input-field">
          <option value="ALL">All Priorities</option>
          <option value="HIGH">High</option>
          <option value="MEDIUM">Medium</option>
          <option value="LOW">Low</option>
        </select>
      </div>

      {/* Chores Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredChores.map((chore) => (
          <div key={chore.id} className="card hover:bg-slate-900/60 transition-all duration-300 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <span className="text-gray-300">{getStatusIcon(chore.status)}</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(chore.status)}`}>
                  {chore.status}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <button onClick={() => setEditingChore(chore)} className="text-gray-300 hover:text-purple-400 transition-colors duration-200">
                  <Edit className="h-4 w-4" />
                </button>
                <button onClick={() => handleDelete(chore.id)} className="text-gray-300 hover:text-red-400 transition-colors duration-200">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            <h3 className="font-semibold text-white mb-2 text-lg">{chore.title}</h3>
            <p className="text-gray-300 text-sm mb-4">{chore.description}</p>

            <div className="space-y-2 text-sm text-gray-300 mb-4">
              <div className="flex items-center">
                <User className="h-4 w-4 mr-2" />
                Assigned to: {typeof chore.assignedTo === 'object'
                  ? `${chore.assignedTo.firstName} ${chore.assignedTo.lastName}`
                  : chore.assignedTo || 'Unassigned'}
              </div>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                Due: {formatDate(chore.dueDate)}
              </div>
            </div>

            <div className="flex space-x-2">
              {chore.status !== 'COMPLETED' && (
                <button
                  onClick={() => handleStatusChange(chore.id, 'COMPLETED')}
                  className="btn-secondary text-sm flex-1"
                >
                  Mark Complete
                </button>
              )}
              {chore.status === 'PENDING' && (
                <button
                  onClick={() => handleStatusChange(chore.id, 'IN_PROGRESS')}
                  className="btn-outline text-sm flex-1"
                >
                  Start
                </button>
              )}
            </div>
          </div>
        ))}
        {filteredChores.length === 0 && (
          <div className="col-span-full text-center py-12">
            <CheckSquare className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-300">No chores found! Create your first chore to get started!</p>
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="glass backdrop-blur-xl border border-slate-700/30 rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <h2 className="text-xl font-semibold mb-4 text-white">
              {editingChore ? 'Edit Chore' : 'Assign New Chore'}
            </h2>
            <form onSubmit={handleSubmit}>
              <input
                value={formData.title}
                onChange={e => setFormData({...formData, title: e.target.value})}
                className="input-field"
                required
                placeholder="Title"
              />
              <textarea
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
                className="input-field"
                rows={3}
                placeholder="Description"
              />
              <input
                value={formData.assignedTo}
                onChange={e => setFormData({...formData, assignedTo: e.target.value})}
                className="input-field"
                required
                placeholder="Assigned To"
              />
              <input
                type="date"
                value={formData.dueDate}
                onChange={e => setFormData({...formData, dueDate: e.target.value})}
                className="input-field"
                required
                placeholder="Due Date"
              />
              <select
                value={formData.priority}
                onChange={e => setFormData({...formData, priority: e.target.value as any})}
                className="select-field"
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
              </select>
              <select
                value={formData.frequency}
                onChange={e => setFormData({...formData, frequency: e.target.value as any})}
                className="select-field"
              >
                <option value="ONE_TIME">One Time</option>
                <option value="DAILY">Daily</option>
                <option value="WEEKLY">Weekly</option>
                <option value="MONTHLY">Monthly</option>
              </select>
              <div className="flex gap-2 mt-3">
                <button type="submit" className="btn-primary flex-1">{editingChore ? 'Update' : 'Create'}</button>
                <button type="button" onClick={() => { setShowCreateModal(false); setEditingChore(null); }} className="btn-outline flex-1">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Chores
