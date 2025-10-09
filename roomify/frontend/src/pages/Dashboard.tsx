import React from 'react'
import { Link } from 'react-router-dom'
import { 
  DollarSign, 
  CheckSquare, 
  Clock, 
  TrendingUp, 
  Users, 
  Plus,
  ArrowRight,
  Calendar,
  AlertTriangle
} from 'lucide-react'
import { useDashboard, DashboardContextType } from '../contexts/DashboardContext'
import { formatCurrency, formatDate, formatDateTime } from '../utils/formatters'
import { useSettings } from '../contexts/SettingsContext'

const Dashboard: React.FC = () => {
  const { stats, expenses, chores, reminders, households, loading } = useDashboard() as DashboardContextType
  const { settings } = useSettings()

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
          <h1 className="text-4xl font-bold text-gradient-heading drop-shadow-lg">Dashboard</h1>
          <p className="text-gray-400 mt-2">Welcome back! Here's what's happening in your household.</p>
        </div>
        <div className="flex space-x-3">
          <Link to="/expenses" className="btn-primary">
            <Plus className="h-4 w-4 mr-2" />
            Add Expense
          </Link>
          <Link to="/chores" className="btn-secondary">
            <Plus className="h-4 w-4 mr-2" />
            Assign Chore
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card glow-purple">
          <div className="flex items-center">
            <div className="p-3 bg-emerald-500/20 rounded-lg glow-purple">
              <DollarSign className="h-6 w-6 text-emerald-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-400">Total Expenses</p>
              <p className="text-2xl font-bold text-white">
                {stats ? formatCurrency(stats.totalExpenses) : '$0'}
              </p>
            </div>
          </div>
        </div>

        <div className="card glow-blue">
          <div className="flex items-center">
            <div className="p-3 bg-blue-500/20 rounded-lg glow-blue">
              <CheckSquare className="h-6 w-6 text-blue-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-400">Active Chores</p>
              <p className="text-2xl font-bold text-white">
                {stats ? stats.totalChores : 0}
              </p>
            </div>
          </div>
        </div>

        <div className="card glow-pink">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-500/20 rounded-lg glow-pink">
              <Clock className="h-6 w-6 text-yellow-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-400">Pending Reminders</p>
              <p className="text-2xl font-bold text-white">
                {stats ? stats.totalReminders : 0}
              </p>
            </div>
          </div>
        </div>

        <div className="card glow-purple">
          <div className="flex items-center">
            <div className="p-3 bg-purple-500/20 rounded-lg glow-purple">
              <Users className="h-6 w-6 text-purple-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-400">Household Members</p>
              <p className="text-2xl font-bold text-white">
                {households.length > 0 ? households[0]?.members?.length || 0 : 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Expenses */}
        <div className="lg:col-span-2">
          <div className="card glow-blue">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gradient-heading">Recent Expenses</h2>
              <Link to="/expenses" className="text-sm text-purple-400 hover:text-purple-300 font-medium transition-colors duration-200">
                View all
              </Link>
            </div>
            
            {expenses.length === 0 ? (
              <div className="text-center py-8">
                <DollarSign className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-400 mb-4">No expenses yet</p>
                <Link to="/expenses" className="text-purple-400 hover:text-purple-300 text-sm font-medium transition-colors duration-200">
                  Add your first expense
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {expenses.slice(0, 5).map((expense) => (
                  <div key={expense.id} className="flex items-center justify-between p-4 bg-slate-800/30 rounded-xl border border-slate-700/50 hover:bg-slate-800/50 transition-all duration-200">
                    <div className="flex items-center">
                      <div className="h-8 w-8 bg-purple-500/20 rounded-full flex items-center justify-center glow-purple">
                        <DollarSign className="h-4 w-4 text-purple-400" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-white">{expense.title}</p>
                        <p className="text-xs text-gray-400">
                          {expense.paidBy.firstName} • {formatDate(expense.date, settings.general)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-white">
                        {formatCurrency(expense.amount)}
                      </p>
                      <span className={`badge badge-${expense.status === 'SETTLED' ? 'success' : 'warning'}`}>
                        {expense.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions & Upcoming */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="card glow-purple">
            <h3 className="text-xl font-bold text-gradient-heading mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Link
                to="/expenses"
                className="flex items-center p-4 bg-slate-800/30 hover:bg-slate-800/50 rounded-xl transition-all duration-200 border border-slate-700/30 hover:border-purple-500/30 glow-purple group"
              >
                <Plus className="h-5 w-5 text-purple-400 mr-3" />
                <span className="text-sm font-medium text-gray-200">Add Expense</span>
                <ArrowRight className="h-4 w-4 text-gray-400 ml-auto group-hover:text-purple-400 transition-colors duration-200" />
              </Link>
              
              <Link
                to="/chores"
                className="flex items-center p-4 bg-slate-800/30 hover:bg-slate-800/50 rounded-xl transition-all duration-200 border border-slate-700/30 hover:border-blue-500/30 glow-blue group"
              >
                <Plus className="h-5 w-5 text-blue-400 mr-3" />
                <span className="text-sm font-medium text-gray-200">Assign Chore</span>
                <ArrowRight className="h-4 w-4 text-gray-400 ml-auto group-hover:text-blue-400 transition-colors duration-200" />
              </Link>
              
              <Link
                to="/reminders"
                className="flex items-center p-4 bg-slate-800/30 hover:bg-slate-800/50 rounded-xl transition-all duration-200 border border-slate-700/30 hover:border-pink-500/30 glow-pink group"
              >
                <Plus className="h-5 w-5 text-pink-400 mr-3" />
                <span className="text-sm font-medium text-gray-200">Set Reminder</span>
                <ArrowRight className="h-4 w-4 text-gray-400 ml-auto group-hover:text-pink-400 transition-colors duration-200" />
              </Link>
            </div>
          </div>

          {/* Upcoming Deadlines */}
          <div className="card glow-pink">
            <h3 className="text-xl font-bold text-gradient-heading mb-4">Upcoming Deadlines</h3>
            <div className="space-y-3">
              {chores.filter(chore => chore.status === 'PENDING' && new Date(chore.dueDate) > new Date()).slice(0, 3).map((chore) => (
                <div key={chore.id} className="flex items-center p-4 bg-slate-800/30 rounded-xl border border-slate-700/50 hover:bg-slate-800/50 transition-all duration-200">
                  <Calendar className="h-5 w-5 text-yellow-400 mr-3" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-white">{chore.title}</p>
                    <p className="text-xs text-gray-400">
                      Due {formatDate(chore.dueDate, settings.general)}
                    </p>
                  </div>
                  <span className={`badge badge-${chore.priority === 'URGENT' ? 'danger' : 'warning'}`}>
                    {chore.priority}
                  </span>
                </div>
              ))}
              
              {chores.filter(chore => chore.status === 'PENDING' && new Date(chore.dueDate) > new Date()).length === 0 && (
                <div className="text-center py-4">
                  <Calendar className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-400 text-sm">No upcoming deadlines</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card glow-blue">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gradient-heading">Recent Activity</h2>
          <Link to="/activity" className="text-sm text-purple-400 hover:text-purple-300 font-medium transition-colors duration-200">
            View all activity
          </Link>
        </div>
        
        <div className="space-y-4">
          {expenses.slice(0, 3).map((expense) => (
            <div key={expense.id} className="flex items-center space-x-4 p-4 bg-slate-800/30 rounded-xl border border-slate-700/50 hover:bg-slate-800/50 transition-all duration-200">
              <div className="h-8 w-8 bg-emerald-500/20 rounded-full flex items-center justify-center glow-purple">
                <DollarSign className="h-4 w-4 text-emerald-400" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-200">
                  <span className="font-medium text-white">{expense.paidBy.firstName}</span> added expense "{expense.title}"
                </p>
                <p className="text-xs text-gray-400">
                  {formatDateTime(expense.createdAt, settings.general)}
                </p>
              </div>
              <span className="text-sm font-medium text-white">
                {formatCurrency(expense.amount)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Dashboard


