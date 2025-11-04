import React, { useState } from 'react';
import { DollarSign, ShoppingCart, Utensils, Home, Car, Film, Plus, TrendingUp, TrendingDown, Calendar } from 'lucide-react';

interface Expense {
  id: string;
  title: string;
  amount: number;
  category: 'GROCERIES' | 'UTILITIES' | 'RENT' | 'ENTERTAINMENT' | 'TRANSPORTATION' | 'OTHER';
  paidBy: string;
  splitAmong: number;
  date: string;
  status: 'PAID' | 'PENDING' | 'OVERDUE';
}

const Expenses: React.FC = () => {
  const [filter, setFilter] = useState<string>('ALL');

  const mockExpenses: Expense[] = [
    {
      id: '1',
      title: 'Grocery Shopping',
      amount: 156.50,
      category: 'GROCERIES',
      paidBy: 'John Doe',
      splitAmong: 4,
      date: '2024-10-28',
      status: 'PAID',
    },
    {
      id: '2',
      title: 'Monthly Rent',
      amount: 2400.00,
      category: 'RENT',
      paidBy: 'Jane Smith',
      splitAmong: 4,
      date: '2024-10-01',
      status: 'PAID',
    },
    {
      id: '3',
      title: 'Electricity Bill',
      amount: 89.30,
      category: 'UTILITIES',
      paidBy: 'Admin User',
      splitAmong: 4,
      date: '2024-10-25',
      status: 'PENDING',
    },
    {
      id: '4',
      title: 'Movie Night',
      amount: 52.00,
      category: 'ENTERTAINMENT',
      paidBy: 'Guest User',
      splitAmong: 3,
      date: '2024-10-26',
      status: 'PAID',
    },
  ];

  const getCategoryIcon = (category: string) => {
    const icons: { [key: string]: any } = {
      GROCERIES: ShoppingCart,
      UTILITIES: Home,
      RENT: Home,
      ENTERTAINMENT: Film,
      TRANSPORTATION: Car,
      OTHER: DollarSign,
    };
    return icons[category] || DollarSign;
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      GROCERIES: 'from-emerald-500/20 to-teal-500/20',
      UTILITIES: 'from-yellow-500/20 to-orange-500/20',
      RENT: 'from-blue-500/20 to-cyan-500/20',
      ENTERTAINMENT: 'from-pink-500/20 to-purple-500/20',
      TRANSPORTATION: 'from-indigo-500/20 to-purple-500/20',
      OTHER: 'from-gray-500/20 to-slate-500/20',
    };
    return colors[category] || 'from-gray-500/20 to-slate-500/20';
  };

  const getCategoryIconColor = (category: string) => {
    const colors: { [key: string]: string } = {
      GROCERIES: 'text-emerald-400',
      UTILITIES: 'text-yellow-400',
      RENT: 'text-blue-400',
      ENTERTAINMENT: 'text-pink-400',
      TRANSPORTATION: 'text-indigo-400',
      OTHER: 'text-gray-400',
    };
    return colors[category] || 'text-gray-400';
  };

  const totalExpenses = mockExpenses.reduce((sum, exp) => sum + exp.amount, 0);
  const yourShare = mockExpenses.reduce((sum, exp) => sum + (exp.amount / exp.splitAmong), 0);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header with Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card glow-blue md:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gradient-heading mb-2">Expenses</h1>
              <p className="text-gray-400">Track and manage shared expenses</p>
            </div>
            <button className="btn-primary">
              <Plus className="h-5 w-5 mr-2" />
              Add Expense
            </button>
          </div>
        </div>

        <div className="card glow-purple">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">Your Share</span>
            <TrendingUp className="h-5 w-5 text-purple-400" />
          </div>
          <p className="text-3xl font-bold text-white">${yourShare.toFixed(2)}</p>
          <p className="text-sm text-gray-400 mt-1">of ${totalExpenses.toFixed(2)} total</p>
        </div>
      </div>

      {/* Category Filter */}
      <div className="card">
        <div className="flex items-center space-x-3 overflow-x-auto pb-2">
          {['ALL', 'GROCERIES', 'UTILITIES', 'RENT', 'ENTERTAINMENT', 'TRANSPORTATION', 'OTHER'].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                filter === cat
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg'
                  : 'bg-slate-800/50 text-gray-400 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Expenses List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {mockExpenses
          .filter((exp) => filter === 'ALL' || exp.category === filter)
          .map((expense) => {
            const Icon = getCategoryIcon(expense.category);
            const shareAmount = expense.amount / expense.splitAmong;
            
            return (
              <div key={expense.id} className="card hover:shadow-2xl transition-all duration-300">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`p-3 bg-gradient-to-br ${getCategoryColor(expense.category)} rounded-xl`}>
                      <Icon className={`h-6 w-6 ${getCategoryIconColor(expense.category)}`} />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">{expense.title}</h3>
                      <span className={`badge badge-${expense.status === 'PAID' ? 'success' : expense.status === 'PENDING' ? 'warning' : 'danger'} mt-1`}>
                        {expense.status}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-white">${expense.amount.toFixed(2)}</p>
                    <p className="text-xs text-gray-400">Total</p>
                  </div>
                </div>

                <div className="space-y-2 bg-slate-800/30 rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">Paid by</span>
                    <span className="text-sm text-white font-medium">{expense.paidBy}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">Split among</span>
                    <span className="text-sm text-white font-medium">{expense.splitAmong} people</span>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-slate-700/50">
                    <span className="text-sm text-gray-400">Your share</span>
                    <span className="text-lg text-purple-400 font-bold">${shareAmount.toFixed(2)}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-700/50">
                  <div className="flex items-center space-x-2 text-sm text-gray-400">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(expense.date).toLocaleDateString()}</span>
                  </div>
                  <span className="text-xs px-3 py-1 bg-slate-800/50 rounded-full text-gray-400">
                    {expense.category}
                  </span>
                </div>
              </div>
            );
          })}
      </div>

      {/* Summary Card */}
      <div className="card glow-blue">
        <h2 className="text-2xl font-bold text-gradient-heading mb-6">Monthly Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center p-4 bg-slate-800/30 rounded-xl">
            <DollarSign className="h-8 w-8 text-emerald-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">${totalExpenses.toFixed(2)}</p>
            <p className="text-sm text-gray-400 mt-1">Total Expenses</p>
          </div>
          <div className="text-center p-4 bg-slate-800/30 rounded-xl">
            <TrendingDown className="h-8 w-8 text-blue-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">${yourShare.toFixed(2)}</p>
            <p className="text-sm text-gray-400 mt-1">Your Share</p>
          </div>
          <div className="text-center p-4 bg-slate-800/30 rounded-xl">
            <ShoppingCart className="h-8 w-8 text-purple-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">{mockExpenses.length}</p>
            <p className="text-sm text-gray-400 mt-1">Transactions</p>
          </div>
          <div className="text-center p-4 bg-slate-800/30 rounded-xl">
            <Calendar className="h-8 w-8 text-pink-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">October</p>
            <p className="text-sm text-gray-400 mt-1">Current Period</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Expenses;
