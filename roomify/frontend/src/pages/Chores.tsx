import React, { useState } from 'react'
import { Plus, Edit, Trash2, CheckCircle, Clock, AlertTriangle, User, Calendar } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { useDashboard } from '../contexts/DashboardContext'
import { formatDate } from '../utils/formatters'
import { choreAPI } from '../services/api'
import { Chore } from '../types'

const Chores: React.FC = () => {
  const { user } = useAuth()
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
        assignedToId: user?.id || '',
        householdId: user?.id || ''
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
    return <div>Loading chores...</div>
  }

  return (
    <div>
      {/* Page Header */}
      <div className="header flex justify-between items-center">
        <h1>Chores</h1>
        <button className="btn-primary" onClick={() => setShowCreateModal(true)}>
          <Plus /> Assign Chore
        </button>
      </div>

      {/* Filters */}
      <div className="filters flex gap-3">
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="select-field">
          <option value="ALL">All Statuses</option>
          <option value="PENDING">Pending</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="COMPLETED">Completed</option>
        </select>
        <select value={filterPriority} onChange={e => setFilterPriority(e.target.value)} className="select-field">
          <option value="ALL">All Priorities</option>
          <option value="HIGH">High</option>
          <option value="MEDIUM">Medium</option>
          <option value="LOW">Low</option>
        </select>
      </div>

      {/* Chores Grid */}
      <div className="grid mt-4">
        {filteredChores.map((chore) => (
          <div key={chore.id} className={`chore-card ${getPriorityColor(chore.priority)}`}>
            <span>{getStatusIcon(chore.status)}</span>
            <span className={getStatusColor(chore.status)}>{chore.status}</span>
            <h3>{chore.title}</h3>
            <p>{chore.description}</p>
            <span>
              Assigned to: {typeof chore.assignedTo === 'object' 
                ? `${chore.assignedTo.firstName} ${chore.assignedTo.lastName}`
                : chore.assignedTo || 'Unassigned'}
            </span>
            <span>Due: {formatDate(chore.dueDate)}</span>
            <button onClick={() => setEditingChore(chore)} className="text-gray-400 hover:text-gray-600"><Edit /></button>
            <button onClick={() => handleDelete(chore.id)} className="text-red-400 hover:text-red-600"><Trash2 /></button>
            {chore.status !== 'COMPLETED' && (
              <button onClick={() => handleStatusChange(chore.id, 'COMPLETED')} className="btn-secondary text-sm">
                Mark Complete
              </button>
            )}
            {chore.status === 'PENDING' && (
              <button onClick={() => handleStatusChange(chore.id, 'IN_PROGRESS')} className="btn-outline text-sm">
                Start
              </button>
            )}
          </div>
        ))}
        {filteredChores.length === 0 && (
          <div className="empty-state">
            <p>No chores found! Create your first chore to get started!</p>
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      {showCreateModal && (
        <div className="modal">
          <form onSubmit={handleSubmit} className="flex flex-col gap-2">
            <h2>{editingChore ? 'Edit Chore' : 'Assign New Chore'}</h2>
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
      )}
    </div>
  )
}

export default Chores
