import React, { useState } from 'react';
import { CheckSquare, Plus, Calendar, User, AlertCircle, CheckCircle, Clock, Filter } from 'lucide-react';

interface Chore {
  id: string;
  title: string;
  description: string;
  assignedTo: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'OVERDUE';
  dueDate: string;
  frequency: 'ONCE' | 'DAILY' | 'WEEKLY' | 'MONTHLY';
  household: string;
}

const Chores: React.FC = () => {
  const [filter, setFilter] = useState<string>('ALL');
  const [chores, setChores] = useState<Chore[]>([
    {
      id: '1',
      title: 'Clean Kitchen',
      description: 'Wash dishes, wipe counters, and mop floor',
      assignedTo: 'John Doe',
      priority: 'HIGH',
      status: 'IN_PROGRESS',
      dueDate: '2024-10-30',
      frequency: 'DAILY',
      household: 'Downtown Apartment',
    },
    {
      id: '2',
      title: 'Take Out Trash',
      description: 'Empty all trash bins and take to curb',
      assignedTo: 'Jane Smith',
      priority: 'MEDIUM',
      status: 'PENDING',
      dueDate: '2024-10-29',
      frequency: 'WEEKLY',
      household: 'Downtown Apartment',
    },
    {
      id: '3',
      title: 'Vacuum Living Room',
      description: 'Vacuum carpets and clean under furniture',
      assignedTo: 'Admin User',
      priority: 'MEDIUM',
      status: 'COMPLETED',
      dueDate: '2024-10-28',
      frequency: 'WEEKLY',
      household: 'Downtown Apartment',
    },
    {
      id: '4',
      title: 'Buy Groceries',
      description: 'Get essentials for the week',
      assignedTo: 'Guest User',
      priority: 'HIGH',
      status: 'OVERDUE',
      dueDate: '2024-10-27',
      frequency: 'WEEKLY',
      household: 'Downtown Apartment',
    },
  ]);

  const handleMarkComplete = (choreId: string) => {
    setChores(prevChores =>
      prevChores.map(chore =>
        chore.id === choreId ? { ...chore, status: 'COMPLETED' as const } : chore
      )
    );
    alert('Chore marked as completed! 🎉');
  };

  const getPriorityColor = (priority: string) => {
    const colors: { [key: string]: string } = {
      LOW: 'from-blue-500/20 to-cyan-500/20',
      MEDIUM: 'from-yellow-500/20 to-orange-500/20',
      HIGH: 'from-red-500/20 to-pink-500/20',
    };
    return colors[priority] || 'from-gray-500/20 to-slate-500/20';
  };

  const getPriorityBadge = (priority: string) => {
    const badges: { [key: string]: string } = {
      LOW: 'badge-info',
      MEDIUM: 'badge-warning',
      HIGH: 'badge-danger',
    };
    return badges[priority] || 'badge-info';
  };

  const getStatusBadge = (status: string) => {
    const badges: { [key: string]: string } = {
      PENDING: 'badge-warning',
      IN_PROGRESS: 'badge-info',
      COMPLETED: 'badge-success',
      OVERDUE: 'badge-danger',
    };
    return badges[status] || 'badge-info';
  };

  const getStatusIcon = (status: string) => {
    const icons: { [key: string]: any } = {
      PENDING: Clock,
      IN_PROGRESS: AlertCircle,
      COMPLETED: CheckCircle,
      OVERDUE: AlertCircle,
    };
    return icons[status] || Clock;
  };

  const statusCounts = {
    all: chores.length,
    pending: chores.filter(c => c.status === 'PENDING').length,
    in_progress: chores.filter(c => c.status === 'IN_PROGRESS').length,
    completed: chores.filter(c => c.status === 'COMPLETED').length,
    overdue: chores.filter(c => c.status === 'OVERDUE').length,
  };

  const filteredChores = filter === 'ALL' 
    ? chores 
    : chores.filter(chore => chore.status === filter);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="card glow-blue">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold text-gradient-heading mb-2">Chores Management</h1>
            <p className="text-gray-400">Track and assign household chores</p>
          </div>
          <button className="btn-primary">
            <Plus className="h-5 w-5 mr-2" />
            Create Chore
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="card text-center cursor-pointer hover:scale-105 transition-all" onClick={() => setFilter('ALL')}>
          <CheckSquare className="h-8 w-8 text-purple-400 mx-auto mb-2" />
          <p className="text-2xl font-bold text-white">{statusCounts.all}</p>
          <p className="text-sm text-gray-400">Total</p>
        </div>
        <div className="card text-center cursor-pointer hover:scale-105 transition-all" onClick={() => setFilter('PENDING')}>
          <Clock className="h-8 w-8 text-yellow-400 mx-auto mb-2" />
          <p className="text-2xl font-bold text-white">{statusCounts.pending}</p>
          <p className="text-sm text-gray-400">Pending</p>
        </div>
        <div className="card text-center cursor-pointer hover:scale-105 transition-all" onClick={() => setFilter('IN_PROGRESS')}>
          <AlertCircle className="h-8 w-8 text-blue-400 mx-auto mb-2" />
          <p className="text-2xl font-bold text-white">{statusCounts.in_progress}</p>
          <p className="text-sm text-gray-400">In Progress</p>
        </div>
        <div className="card text-center cursor-pointer hover:scale-105 transition-all" onClick={() => setFilter('COMPLETED')}>
          <CheckCircle className="h-8 w-8 text-emerald-400 mx-auto mb-2" />
          <p className="text-2xl font-bold text-white">{statusCounts.completed}</p>
          <p className="text-sm text-gray-400">Completed</p>
        </div>
        <div className="card text-center cursor-pointer hover:scale-105 transition-all" onClick={() => setFilter('OVERDUE')}>
          <AlertCircle className="h-8 w-8 text-red-400 mx-auto mb-2" />
          <p className="text-2xl font-bold text-white">{statusCounts.overdue}</p>
          <p className="text-sm text-gray-400">Overdue</p>
        </div>
      </div>

      {/* Filter Indicator */}
      {filter !== 'ALL' && (
        <div className="card">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Filter className="h-5 w-5 text-purple-400" />
              <span className="text-gray-300">Showing: <span className="text-white font-bold">{filter}</span> chores</span>
            </div>
            <button onClick={() => setFilter('ALL')} className="btn-outline text-sm py-2">
              Clear Filter
            </button>
          </div>
        </div>
      )}

      {/* Chores Grid */}
      {filteredChores.length === 0 ? (
        <div className="card text-center py-12">
          <CheckSquare className="h-24 w-24 text-gray-400 mx-auto mb-4 opacity-50" />
          <h3 className="text-xl font-medium text-gray-200 mb-2">No chores found</h3>
          <p className="text-gray-400 mb-6">
            {filter !== 'ALL' ? `No ${filter.toLowerCase()} chores` : 'Create your first chore to get started'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredChores.map((chore) => {
            const StatusIcon = getStatusIcon(chore.status);
            const isOverdue = chore.status === 'OVERDUE';
            const isCompleted = chore.status === 'COMPLETED';
            
            return (
              <div 
                key={chore.id} 
                className={`card ${isOverdue ? 'glow-pink' : isCompleted ? 'hover:shadow-emerald-500/20' : 'glow-purple'} transform hover:scale-105 transition-all duration-300`}
              >
                {/* Card Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`p-3 bg-gradient-to-br ${getPriorityColor(chore.priority)} rounded-xl`}>
                      <CheckSquare className="h-6 w-6 text-purple-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">{chore.title}</h3>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className={`badge ${getPriorityBadge(chore.priority)}`}>
                          {chore.priority}
                        </span>
                        <span className={`badge ${getStatusBadge(chore.status)}`}>
                          {chore.status}
                        </span>
                      </div>
                    </div>
                  </div>
                  <StatusIcon className={`h-6 w-6 ${isOverdue ? 'text-red-400' : isCompleted ? 'text-emerald-400' : 'text-blue-400'}`} />
                </div>

                {/* Description */}
                <p className="text-sm text-gray-400 mb-4">{chore.description}</p>

                {/* Details */}
                <div className="space-y-3 bg-slate-800/30 rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-sm text-gray-400">
                      <User className="h-4 w-4" />
                      <span>Assigned to</span>
                    </div>
                    <span className="text-sm text-white font-medium">{chore.assignedTo}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-sm text-gray-400">
                      <Calendar className="h-4 w-4" />
                      <span>Due Date</span>
                    </div>
                    <span className={`text-sm font-medium ${isOverdue ? 'text-red-400' : 'text-white'}`}>
                      {new Date(chore.dueDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">Frequency</span>
                    <span className="text-xs px-3 py-1 bg-slate-700/50 rounded-full text-gray-300">
                      {chore.frequency}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-2 mt-4 pt-4 border-t border-slate-700/50">
                  {!isCompleted && (
                    <button 
                      onClick={() => handleMarkComplete(chore.id)} 
                      className="flex-1 btn-primary text-sm py-2"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Mark Complete
                    </button>
                  )}
                  {isCompleted && (
                    <button className="flex-1 btn-secondary text-sm py-2 cursor-default">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Completed ✓
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Chores;
