import React, { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, Bell, Clock, AlertTriangle, CheckCircle, Calendar, User, Tag, Grid, List } from 'lucide-react'
import { useDashboard } from '../contexts/DashboardContext'
import { formatDate, formatTime } from '../utils/formatters'
import { Reminder as ReminderType, ReminderStatus, ReminderPriority } from '../types'

// Using imported ReminderType from types.ts

const Reminders: React.FC = () => {
  const { reminders, loading } = useDashboard()
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingReminder, setEditingReminder] = useState<ReminderType | null>(null)
  const [filterStatus, setFilterStatus] = useState<string>('ALL')
  const [filterPriority, setFilterPriority] = useState<string>('ALL')
  const [filterType, setFilterType] = useState<string>('ALL')
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'calendar'>('grid')

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: '',
    dueTime: '',
    priority: 'MEDIUM' as const,
    type: 'GENERAL' as const,
    assignedTo: ''
  })

  const reminderTypes = [
    'TASK', 'BILL', 'EVENT', 'GENERAL'
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implement reminder creation/update API call
    setShowCreateModal(false)
    setEditingReminder(null)
    setFormData({
      title: '',
      description: '',
      dueDate: '',
      dueTime: '',
      priority: 'MEDIUM',
      type: 'GENERAL',
      assignedTo: ''
    })
  }

  const handleDelete = async (reminderId: string) => {
    // TODO: Implement delete API call
  }

  const handleStatusChange = async (reminderId: string, newStatus: string) => {
    // TODO: Implement status update API call
  }

  const filteredReminders = reminders.filter(reminder => {
    const matchesStatus = filterStatus === 'ALL' || reminder.status === filterStatus
    const matchesPriority = filterPriority === 'ALL' || reminder.priority === filterPriority
    const matchesType = filterType === 'ALL' || reminder.type === filterType
    return matchesStatus && matchesPriority && matchesType
  }) as ReminderType[] || []

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'HIGH': return 'text-red-600 bg-red-100'
      case 'MEDIUM': return 'text-yellow-600 bg-yellow-100'
      case 'LOW': return 'text-green-600 bg-green-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'text-green-600 bg-green-100'
      case 'PENDING': return 'text-yellow-600 bg-yellow-100'
      case 'OVERDUE': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getTypeColor = (type: string) => {
    const colors = {
      'TASK': 'text-blue-600 bg-blue-100',
      'BILL': 'text-purple-600 bg-purple-100',
      'EVENT': 'text-green-600 bg-green-100',
      'GENERAL': 'text-gray-600 bg-gray-100'
    }
    return colors[type as keyof typeof colors] || colors['GENERAL']
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED': return <CheckCircle className="h-4 w-4" />
      case 'PENDING': return <Clock className="h-4 w-4" />
      case 'OVERDUE': return <AlertTriangle className="h-4 w-4" />
      default: return <Clock className="h-4 w-4" />
    }
  }

  const isOverdue = (dueDate: string, dueTime?: string) => {
    const now = new Date()
    const dateTimeString = dueTime ? `${dueDate}T${dueTime}` : dueDate
    const due = new Date(dateTimeString)
    return now > due
  }

  const sortedReminders = [...filteredReminders].sort((a, b) => {
    const aDate = a.dueTime ? new Date(`${a.dueDate}T${a.dueTime}`) : new Date(a.dueDate)
    const bDate = b.dueTime ? new Date(`${b.dueDate}T${b.dueTime}`) : new Date(b.dueDate)
    return aDate.getTime() - bDate.getTime()
  })

  const pendingReminders = sortedReminders.filter(r => r.status === ReminderStatus.PENDING)
  const overdueReminders = sortedReminders.filter(r => isOverdue(r.dueDate, r.dueTime || undefined))
  const completedReminders = sortedReminders.filter(r => r.status === ReminderStatus.COMPLETED)

  const renderAssignedTo = (assignedTo: { firstName: string; lastName: string }) => {
    return (
      <span className="inline-flex items-center">
        <User className="h-4 w-4 mr-1" />
        {assignedTo.firstName} {assignedTo.lastName}
      </span>
    )
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
          <h1 className="text-3xl font-bold text-gradient-heading drop-shadow-lg">Reminders</h1>
          <p className="text-gray-300 mt-2">Set and track important reminders and deadlines.</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="btn-primary"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Reminder
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-300">Pending</p>
              <p className="text-2xl font-bold text-white">
                {pendingReminders.length}
              </p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-red-100 rounded-lg">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-300">Overdue</p>
              <p className="text-2xl font-bold text-white">
                {overdueReminders.length}
              </p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-300">Completed</p>
              <p className="text-2xl font-bold text-white">
                {completedReminders.length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and View Toggle */}
      <div className="flex items-center justify-between">
        <div className="flex space-x-4">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="select-field"
            aria-label="Filter by status"
          >
            <option value="ALL">All Statuses</option>
            <option value="PENDING">Pending</option>
            <option value="COMPLETED">Completed</option>
            <option value="OVERDUE">Overdue</option>
          </select>
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="select-field"
            aria-label="Filter by priority"
          >
            <option value="ALL">All Priorities</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </select>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="select-field"
            aria-label="Filter by type"
          >
            <option value="ALL">All Types</option>
            {reminderTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-xl transition-all duration-200 ${viewMode === 'grid' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' : 'text-gray-300 hover:text-purple-400 hover:bg-slate-800/50'}`}
            aria-label="Grid view"
          >
            <Grid className="h-4 w-4" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-xl transition-all duration-200 ${viewMode === 'list' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' : 'text-gray-300 hover:text-blue-400 hover:bg-slate-800/50'}`}
            aria-label="List view"
          >
            <List className="h-4 w-4" />
          </button>
          <button
            onClick={() => setViewMode('calendar')}
            className={`p-2 rounded-xl transition-all duration-200 ${viewMode === 'calendar' ? 'bg-pink-500/20 text-pink-400 border border-pink-500/30' : 'text-gray-300 hover:text-pink-400 hover:bg-slate-800/50'}`}
            aria-label="Calendar view"
          >
            <Calendar className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Reminders Display */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedReminders.map((reminder) => (
            <div key={reminder.id} className={`card hover:shadow-lg transition-shadow ${
              isOverdue(reminder.dueDate, reminder.dueTime) && reminder.status !== 'COMPLETED' 
                ? 'border-l-4 border-l-red-500' : ''
            }`}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(reminder.priority)}`}>
                    {reminder.priority}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(reminder.type)}`}>
                    {reminder.type}
                  </span>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(reminder.status)}`}>
                  {getStatusIcon(reminder.status)}
                  <span className="ml-1">{reminder.status}</span>
                </span>
              </div>

              <h3 className="font-semibold text-white mb-2">{reminder.title}</h3>
              <p className="text-gray-300 text-sm mb-3">{reminder.description}</p>

              <div className="space-y-2 text-sm text-gray-300 mb-4">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  Due: {formatDate(reminder.dueDate)} at {formatTime(reminder.dueTime)}
                </div>
                {reminder.assignedTo && (
                  <div className="flex items-center">
                    {renderAssignedTo(reminder.assignedTo)}
                  </div>
                )}
              </div>

              <div className="flex space-x-2">
                {reminder.status !== 'COMPLETED' && (
                  <button
                    onClick={() => handleStatusChange(reminder.id, 'COMPLETED')}
                    className="btn-secondary text-sm flex-1"
                  >
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Mark Complete
                  </button>
                )}
                <button
                  onClick={() => setEditingReminder(reminder)}
                  className="btn-outline text-sm flex-1"
                  aria-label="Edit reminder"
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(reminder.id)}
                  className="btn-outline text-sm flex-1 text-red-600 hover:text-red-700"
                  aria-label="Delete reminder"
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {viewMode === 'list' && (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-700/50">
              <thead className="bg-slate-800/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Reminder
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Priority
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Due Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-slate-900/20 divide-y divide-slate-700/30">
                {sortedReminders.map((reminder) => (
                  <tr key={reminder.id} className="hover:bg-slate-800/30 transition-colors duration-200">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-white">{reminder.title}</div>
                        <div className="text-sm text-gray-300">{reminder.description}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(reminder.type)}`}>
                        {reminder.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(reminder.priority)}`}>
                        {reminder.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {formatDate(reminder.dueDate)} at {formatTime(reminder.dueTime)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(reminder.status)}`}>
                        {getStatusIcon(reminder.status)}
                        <span className="ml-1">{reminder.status}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      {reminder.status !== 'COMPLETED' && (
                        <button
                          onClick={() => handleStatusChange(reminder.id, 'COMPLETED')}
                          className="text-emerald-400 hover:text-emerald-300 transition-colors duration-200"
                          aria-label="Mark complete"
                        >
                          <CheckCircle className="h-4 w-4" />
                        </button>
                      )}
                      <button
                        onClick={() => setEditingReminder(reminder)}
                        className="text-purple-400 hover:text-purple-300 transition-colors duration-200"
                        aria-label="Edit reminder"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(reminder.id)}
                        className="text-red-400 hover:text-red-300 transition-colors duration-200"
                        aria-label="Delete reminder"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {viewMode === 'calendar' && (
        <div className="card">
          <div className="text-center py-12">
            <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">Calendar View</h3>
            <p className="text-gray-300">Calendar view will be implemented with a proper calendar component.</p>
          </div>
        </div>
      )}

      {sortedReminders.length === 0 && (
        <div className="text-center py-12">
          <Bell className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-white mb-2">No reminders found</h3>
          <p className="text-gray-300">Create your first reminder to get started!</p>
        </div>
      )}

      {/* Create/Edit Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="glass backdrop-blur-xl border border-slate-700/30 rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <h2 className="text-xl font-semibold mb-4 text-white">
              {editingReminder ? 'Edit Reminder' : 'Add New Reminder'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="title" className="form-label">Title</label>
                <input
                  id="title"
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="input-field"
                  required
                  placeholder="Enter reminder title"
                />
              </div>
              <div>
                <label htmlFor="description" className="form-label">Description</label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="input-field"
                  rows={3}
                  placeholder="Enter reminder description"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="dueDate" className="form-label">Due Date</label>
                  <input
                    id="dueDate"
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="dueTime" className="form-label">Due Time</label>
                  <input
                    id="dueTime"
                    type="time"
                    value={formData.dueTime}
                    onChange={(e) => setFormData({...formData, dueTime: e.target.value})}
                    className="input-field"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="priority" className="form-label">Priority</label>
                  <select
                    id="priority"
                    value={formData.priority}
                    onChange={(e) => setFormData({...formData, priority: e.target.value as any})}
                    className="select-field"
                    aria-label="Select priority"
                  >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="type" className="form-label">Type</label>
                  <select
                    id="type"
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value as any})}
                    className="select-field"
                    aria-label="Select reminder type"
                  >
                    {reminderTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label htmlFor="assignedTo" className="form-label">Assigned To (Optional)</label>
                <input
                  id="assignedTo"
                  type="text"
                  value={formData.assignedTo}
                  onChange={(e) => setFormData({...formData, assignedTo: e.target.value})}
                  className="input-field"
                  placeholder="Enter assignee name"
                />
              </div>
              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  className="btn-primary flex-1"
                >
                  {editingReminder ? 'Update' : 'Create'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false)
                    setEditingReminder(null)
                  }}
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

export default Reminders


