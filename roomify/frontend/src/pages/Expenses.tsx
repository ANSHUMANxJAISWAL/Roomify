import React, { useState, useMemo } from 'react';
import { 
  Edit, 
  Trash2, 
  Users, 
  Calendar, 
  User, 
  Plus, 
  DollarSign,
  Receipt,
  Clock,
  AlertTriangle
} from 'lucide-react';
import { useDashboard } from '../contexts/DashboardContext';
import { formatCurrency, formatDate } from '../utils/formatters';
import {
  Expense,
  ExpenseStatus, 
  ExpenseCategory, 
  ExpenseSplit, 
  User as UserType
} from '../types';

// Define our own category enum to avoid modifying the original
const AppExpenseCategory = {
  ...ExpenseCategory,
  SHOPPING: 'SHOPPING',
  HEALTH: 'HEALTH',
  EDUCATION: 'EDUCATION'
} as const;

type AppExpenseCategory = keyof typeof AppExpenseCategory;

// Type for the expense form data
interface ExpenseFormData {
  title: string;
  description: string;
  amount: number;
  category: AppExpenseCategory;
  paidBy: string;
  householdId: string;
  tags: string[];
  splits: ExpenseSplit[];
  date: string;
  status: ExpenseStatus;
  currency: string;
}

// Initial form state
const initialFormState: ExpenseFormData = {
  title: '',
  description: '',
  amount: 0,
  category: 'UTILITIES',
  paidBy: '',
  householdId: '',
  tags: [],
  splits: [],
  date: new Date().toISOString().split('T')[0],
  status: ExpenseStatus.PENDING,
  currency: 'USD'
};

const Expenses: React.FC = () => {
  const { expenses = [] } = useDashboard();
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  // State for filters
  const [filterStatus] = useState<ExpenseStatus | 'ALL'>('ALL');
  const [filterCategory] = useState<AppExpenseCategory | 'ALL'>('ALL');
  const [formData, setFormData] = useState<ExpenseFormData>(initialFormState);

  // Get all available categories
  const categories = Object.values(AppExpenseCategory) as AppExpenseCategory[];

  // Filter and sort expenses
  const filteredExpenses = useMemo(() => {
    return expenses
      .filter(expense => {
        const matchesStatus = filterStatus === 'ALL' || expense.status === filterStatus;
        const expenseCategory = expense.category as AppExpenseCategory;
        const matchesCategory = filterCategory === 'ALL' || expenseCategory === filterCategory;
        return matchesStatus && matchesCategory;
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [expenses, filterStatus, filterCategory]);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editingExpense) {
        console.log('Updating expense:', formData);
      } else {
        console.log('Creating expense:', formData);
      }
      setShowCreateModal(false);
      setEditingExpense(null);
      setFormData(initialFormState);
    } catch (error) {
      console.error('Error submitting expense:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle delete
  const handleDelete = async (expenseId: string) => {
    if (!window.confirm('Are you sure you want to delete this expense?')) return;
    setLoading(true);
    try {
      console.log('Deleting expense:', expenseId);
    } catch (error) {
      console.error('Error deleting expense:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle edit
  const handleEdit = (expense: Expense) => {
    setEditingExpense(expense);
    setFormData({
      title: expense.title,
      description: expense.description || '',
      amount: expense.amount,
      category: expense.category,
      paidBy: typeof expense.paidBy === 'string' ? expense.paidBy : expense.paidBy.id,
      householdId: typeof expense.household === 'string' ? expense.household : expense.household.id,
      tags: expense.tags || [],
      splits: expense.splits || [],
      date: expense.date,
      status: expense.status,
      currency: expense.currency || 'USD'
    });
    setShowCreateModal(true);
  };

  // Helpers
  const getStatusColor = (status: ExpenseStatus): string => {
    switch (status) {
      case ExpenseStatus.SETTLED:
        return 'bg-green-100 text-green-800';
      case ExpenseStatus.PENDING:
        return 'bg-yellow-100 text-yellow-800';
      case ExpenseStatus.CANCELLED:
        return 'bg-red-100 text-red-800';
      case ExpenseStatus.DISPUTED:
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryColor = (category: AppExpenseCategory): string => {
    const colors: Record<string, string> = {
      FOOD: 'bg-blue-100 text-blue-800',
      UTILITIES: 'bg-purple-100 text-purple-800',
      RENT: 'bg-indigo-100 text-indigo-800',
      TRANSPORTATION: 'bg-yellow-100 text-yellow-800',
      ENTERTAINMENT: 'bg-pink-100 text-pink-800',
      SHOPPING: 'bg-green-100 text-green-800',
      HEALTH: 'bg-red-100 text-red-800',
      EDUCATION: 'bg-teal-100 text-teal-800',
      OTHER: 'bg-gray-100 text-gray-800'
    };
    return colors[category] || colors.OTHER;
  };

  // Stats
  const totalExpenses = filteredExpenses.reduce((sum, e) => sum + e.amount, 0);
  const pendingExpenses = filteredExpenses.filter(e => e.status === ExpenseStatus.PENDING);
  const overdueExpenses = filteredExpenses.filter(() => false); // placeholder

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gradient-heading drop-shadow-lg">Expenses</h1>
          <p className="text-gray-300 mt-2">Manage and track shared household expenses.</p>
        </div>
        <button onClick={() => setShowCreateModal(true)} className="btn-primary">
          <Plus className="h-4 w-4 mr-2" />
          Add Expense
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <DollarSign className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-300">Total Expenses</p>
              <p className="text-2xl font-bold text-white">{formatCurrency(totalExpenses)}</p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-300">Pending</p>
              <p className="text-2xl font-bold text-white">{pendingExpenses.length}</p>
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
              <p className="text-2xl font-bold text-white">{overdueExpenses.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Expenses List/Grid + Filters (you can plug your grid/list rendering here) */}

      {filteredExpenses.length === 0 && (
        <div className="text-center py-12">
          <Receipt className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-white mb-2">No expenses found</h3>
          <p className="text-gray-300">Create your first expense to get started!</p>
        </div>
      )}

      {/* Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="glass backdrop-blur-xl border border-slate-700/30 rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <h2 className="text-xl font-semibold mb-4 text-white">
              {editingExpense ? 'Edit Expense' : 'Add New Expense'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="title" className="form-label">
                  Title
                </label>
                <input
                  id="title"
                  type="text"
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  className="input-field"
                  required
                  placeholder="Enter expense title"
                />
              </div>
              <div>
                <label htmlFor="description" className="form-label">
                  Description
                </label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  className="input-field"
                  rows={3}
                  placeholder="Enter expense description"
                />
              </div>
              <div>
                <label htmlFor="amount" className="form-label">
                  Amount
                </label>
                <input
                  id="amount"
                  type="number"
                  step="0.01"
                  value={formData.amount}
                  onChange={e =>
                    setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })
                  }
                  className="input-field"
                  required
                  placeholder="0.00"
                />
              </div>
              <div>
                <label htmlFor="category" className="form-label">
                  Category
                </label>
                <select
                  id="category"
                  value={formData.category}
                  onChange={e =>
                    setFormData({ ...formData, category: e.target.value as AppExpenseCategory })
                  }
                  className="select-field"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="paidBy" className="form-label">
                  Paid By
                </label>
                <input
                  id="paidBy"
                  type="text"
                  value={formData.paidBy}
                  onChange={e => setFormData({ ...formData, paidBy: e.target.value })}
                  className="input-field"
                  required
                  placeholder="Enter payer name"
                />
              </div>
              <div>
                <label htmlFor="dueDate" className="form-label">
                  Due Date
                </label>
                <input
                  id="dueDate"
                  type="date"
                  value={formData.date}
                  onChange={e => setFormData({ ...formData, date: e.target.value })}
                  className="input-field"
                  required
                />
              </div>
              <div className="flex space-x-3 pt-4">
                <button type="submit" className="btn-primary flex-1">
                  {editingExpense ? 'Update' : 'Create'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false);
                    setEditingExpense(null);
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
  );
};

export default Expenses;
