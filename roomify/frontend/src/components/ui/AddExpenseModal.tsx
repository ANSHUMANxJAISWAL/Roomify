import React, { useState, useEffect } from 'react';
import { X, DollarSign, Calendar, Users, Tag } from 'lucide-react';

interface User {
  id: string;
  firstName: string;
  lastName: string | null;
  email: string;
}

interface Household {
  id: string;
  name: string;
}

interface ExpenseSplit {
  userId: string;
  amount: number;
  percentage: number;
}

interface AddExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExpenseAdded: () => void;
}

const AddExpenseModal: React.FC<AddExpenseModalProps> = ({ isOpen, onClose, onExpenseAdded }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [households, setHouseholds] = useState<Household[]>([]);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    amount: '',
    currency: 'USD',
    date: new Date().toISOString().split('T')[0],
    category: 'GROCERIES',
    status: 'PENDING',
    paidById: '',
    householdId: '',
    receiptUrl: '',
    tags: [] as string[],
  });

  const [splits, setSplits] = useState<ExpenseSplit[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  useEffect(() => {
    if (isOpen) {
      fetchUsers();
      fetchHouseholds();
    }
  }, [isOpen]);

  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/users');
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchHouseholds = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/households');
      const data = await response.json();
      setHouseholds(data);
      
      // Set default household to the first one (Downtown Apartment)
      if (data.length > 0 && !formData.householdId) {
        setFormData(prev => ({ ...prev, householdId: data[0].id }));
      }
    } catch (error) {
      console.error('Error fetching households:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleUserSelection = (userId: string) => {
    setSelectedUsers(prev => {
      if (prev.includes(userId)) {
        return prev.filter(id => id !== userId);
      } else {
        return [...prev, userId];
      }
    });
  };

  const calculateSplits = () => {
    if (!formData.amount || selectedUsers.length === 0) return;

    const totalAmount = parseFloat(formData.amount);
    const splitAmount = totalAmount / selectedUsers.length;
    const percentage = 100 / selectedUsers.length;

    const newSplits: ExpenseSplit[] = selectedUsers.map(userId => ({
      userId,
      amount: parseFloat(splitAmount.toFixed(2)),
      percentage: parseFloat(percentage.toFixed(2)),
    }));

    setSplits(newSplits);
  };

  useEffect(() => {
    calculateSplits();
  }, [formData.amount, selectedUsers]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.paidById) {
      alert('Please select who paid for this expense');
      return;
    }

    if (!formData.householdId) {
      alert('Please select a household');
      return;
    }

    if (selectedUsers.length === 0) {
      alert('Please select at least one person to split with');
      return;
    }

    if (!formData.title.trim()) {
      alert('Please enter an expense title');
      return;
    }

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    setLoading(true);

    try {
      // Convert amounts to ensure proper decimal format for BigDecimal
      const totalAmount = parseFloat(formData.amount);
      const formattedSplits = splits.map(split => ({
        userId: split.userId,
        amount: parseFloat(split.amount.toFixed(2)),
        percentage: parseFloat(split.percentage.toFixed(2)),
      }));

      const expenseData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        amount: totalAmount,
        currency: formData.currency,
        date: formData.date,
        category: formData.category,
        status: formData.status,
        paidById: formData.paidById,
        householdId: formData.householdId,
        receiptUrl: formData.receiptUrl?.trim() || null,
        tags: formData.tags.length > 0 ? formData.tags : [],
        splits: formattedSplits,
      };

      console.log('Submitting expense data:', expenseData);

      const response = await fetch('http://localhost:8080/api/expenses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(expenseData),
      });

      if (response.ok) {
        alert('Expense added successfully!');
        onExpenseAdded();
        resetForm();
        onClose();
      } else {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        try {
          const error = JSON.parse(errorText);
          alert(`Failed to add expense: ${error.message || error.detail || 'Unknown error'}`);
        } catch {
          alert(`Failed to add expense: ${errorText || 'Unknown error'}`);
        }
      }
    } catch (error) {
      console.error('Error adding expense:', error);
      alert('Error adding expense. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      amount: '',
      currency: 'USD',
      date: new Date().toISOString().split('T')[0],
      category: 'GROCERIES',
      status: 'PENDING',
      paidById: '',
      householdId: households.length > 0 ? households[0].id : '', // Reset to default household
      receiptUrl: '',
      tags: [],
    });
    setSelectedUsers([]);
    setSplits([]);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-slate-900 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-slate-700">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <h2 className="text-2xl font-bold text-gradient-heading">Add New Expense</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-800 rounded-xl transition-colors"
            aria-label="Close modal"
          >
            <X className="h-6 w-6 text-gray-400" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Title <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
              className="input-field"
              placeholder="e.g., Grocery Shopping"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="input-field"
              rows={3}
              placeholder="Add details about this expense..."
            />
          </div>

          {/* Amount and Currency */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Amount <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleInputChange}
                  required
                  step="0.01"
                  min="0.01"
                  className="input-field pl-10"
                  placeholder="0.00"
                  aria-label="Expense amount"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Currency
              </label>
              <input
                type="text"
                name="currency"
                value={formData.currency}
                onChange={handleInputChange}
                className="input-field"
                placeholder="USD"
                aria-label="Currency"
              />
            </div>
          </div>

          {/* Date and Category */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Date <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  required
                  className="input-field pl-10"
                  aria-label="Expense date"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Category <span className="text-red-400">*</span>
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                required
                className="input-field"
                aria-label="Expense category"
              >
                <option value="GROCERIES">Groceries</option>
                <option value="UTILITIES">Utilities</option>
                <option value="RENT">Rent</option>
                <option value="INTERNET">Internet</option>
                <option value="ELECTRICITY">Electricity</option>
                <option value="WATER">Water</option>
                <option value="GAS">Gas</option>
                <option value="CLEANING">Cleaning</option>
                <option value="MAINTENANCE">Maintenance</option>
                <option value="ENTERTAINMENT">Entertainment</option>
                <option value="TRANSPORTATION">Transportation</option>
                <option value="OTHER">Other</option>
              </select>
            </div>
          </div>

          {/* Paid By and Household */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Paid By <span className="text-red-400">*</span>
              </label>
              <select
                name="paidById"
                value={formData.paidById}
                onChange={handleInputChange}
                required
                className="input-field"
                aria-label="Paid by user"
              >
                <option value="">Select user...</option>
                {users.map(user => (
                  <option key={user.id} value={user.id}>
                    {user.firstName} {user.lastName || ''}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Household <span className="text-red-400">*</span>
              </label>
              <select
                name="householdId"
                value={formData.householdId}
                onChange={handleInputChange}
                required
                className="input-field"
                aria-label="Household"
              >
                <option value="">Select household...</option>
                {households.map(household => (
                  <option key={household.id} value={household.id}>
                    {household.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Split Among */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              <Users className="inline h-4 w-4 mr-2" />
              Split Among <span className="text-red-400">*</span>
            </label>
            <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto bg-slate-800/30 rounded-xl p-3">
              {users.map(user => (
                <label key={user.id} className="flex items-center space-x-2 cursor-pointer hover:bg-slate-700/30 p-2 rounded-lg">
                  <input
                    type="checkbox"
                    checked={selectedUsers.includes(user.id)}
                    onChange={() => handleUserSelection(user.id)}
                    className="form-checkbox h-4 w-4 text-purple-500 rounded border-gray-600 bg-slate-800"
                  />
                  <span className="text-sm text-gray-300">
                    {user.firstName} {user.lastName || ''}
                  </span>
                </label>
              ))}
            </div>
            {selectedUsers.length > 0 && (
              <p className="text-sm text-gray-400 mt-2">
                Split among {selectedUsers.length} {selectedUsers.length === 1 ? 'person' : 'people'} 
                {formData.amount && ` - $${(parseFloat(formData.amount) / selectedUsers.length).toFixed(2)} each`}
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-700">
            <button
              type="button"
              onClick={onClose}
              className="btn-outline"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={loading}
            >
              {loading ? 'Adding...' : 'Add Expense'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddExpenseModal;
