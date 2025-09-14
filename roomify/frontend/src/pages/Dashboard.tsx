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
import { formatCurrency } from '../utils/formatters'

const Dashboard: React.FC = () => {
  const { stats, expenses, chores, reminders, households, loading } = useDashboard() as DashboardContextType

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
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Welcome back! Here's what's happening in your household.</p>
        </div>
        <div className="flex space-x-3">
          <Link to="/expenses/new" className="btn-primary">
            <Plus className="h-4 w-4 mr-2" />
            Add Expense
          </Link>
          <Link to="/chores/new" className="btn-secondary">
            <Plus className="h-4 w-4 mr-2" />
            Assign Chore
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Expenses</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats ? formatCurrency(stats.totalExpenses) : '$0'}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <CheckSquare className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Chores</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats ? stats.totalChores : 0}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending Reminders</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats ? stats.totalReminders : 0}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Users className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Household Members</p>
              <p className="text-2xl font-bold text-gray-900">
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
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Recent Expenses</h2>
              <Link to="/expenses" className="text-sm text-primary-600 hover:text-primary-700 font-medium">
                View all
              </Link>
            </div>
            
            {expenses.length === 0 ? (
              <div className="text-center py-8">
                <DollarSign className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No expenses yet</p>
                <Link to="/expenses/new" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                  Add your first expense
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {expenses.slice(0, 5).map((expense) => (
                  <div key={expense.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <div className="h-8 w-8 bg-primary-100 rounded-full flex items-center justify-center">
                        <DollarSign className="h-4 w-4 text-primary-600" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">{expense.title}</p>
                        <p className="text-xs text-gray-500">
                          {expense.paidBy.firstName} • {new Date(expense.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-gray-900">
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
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Link
                to="/expenses/new"
                className="flex items-center p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              >
                <Plus className="h-5 w-5 text-primary-600 mr-3" />
                <span className="text-sm font-medium text-gray-700">Add Expense</span>
                <ArrowRight className="h-4 w-4 text-gray-400 ml-auto" />
              </Link>
              
              <Link
                to="/chores/new"
                className="flex items-center p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              >
                <Plus className="h-5 w-5 text-primary-600 mr-3" />
                <span className="text-sm font-medium text-gray-700">Assign Chore</span>
                <ArrowRight className="h-4 w-4 text-gray-400 ml-auto" />
              </Link>
              
              <Link
                to="/reminders/new"
                className="flex items-center p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              >
                <Plus className="h-5 w-5 text-primary-600 mr-3" />
                <span className="text-sm font-medium text-gray-700">Set Reminder</span>
                <ArrowRight className="h-4 w-4 text-gray-400 ml-auto" />
              </Link>
            </div>
          </div>

          {/* Upcoming Deadlines */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Deadlines</h3>
            <div className="space-y-3">
              {chores.filter(chore => chore.status === 'PENDING' && new Date(chore.dueDate) > new Date()).slice(0, 3).map((chore) => (
                <div key={chore.id} className="flex items-center p-3 bg-yellow-50 rounded-lg">
                  <Calendar className="h-5 w-5 text-yellow-600 mr-3" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{chore.title}</p>
                    <p className="text-xs text-gray-500">
                      Due {new Date(chore.dueDate).toLocaleDateString()}
                    </p>
                  </div>
                  <span className={`badge badge-${chore.priority === 'URGENT' ? 'danger' : 'warning'}`}>
                    {chore.priority}
                  </span>
                </div>
              ))}
              
              {chores.filter(chore => chore.status === 'PENDING' && new Date(chore.dueDate) > new Date()).length === 0 && (
                <div className="text-center py-4">
                  <Calendar className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                  <p className="text-gray-500 text-sm">No upcoming deadlines</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
          <Link to="/activity" className="text-sm text-primary-600 hover:text-primary-700 font-medium">
            View all activity
          </Link>
        </div>
        
        <div className="space-y-4">
          {expenses.slice(0, 3).map((expense) => (
            <div key={expense.id} className="flex items-center space-x-4">
              <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                <DollarSign className="h-4 w-4 text-green-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-900">
                  <span className="font-medium">{expense.paidBy.firstName}</span> added expense "{expense.title}"
                </p>
                <p className="text-xs text-gray-500">
                  {new Date(expense.createdAt).toLocaleDateString()} at {new Date(expense.createdAt).toLocaleTimeString()}
                </p>
              </div>
              <span className="text-sm font-medium text-gray-900">
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


