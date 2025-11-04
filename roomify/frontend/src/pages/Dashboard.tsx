import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Home, Users, DollarSign, CheckSquare, TrendingUp, 
  Calendar, Bell, Activity, ArrowUpRight, ArrowDownRight 
} from 'lucide-react';

interface Stats {
  totalUsers: number;
  activeHouseholds: number;
  totalExpenses: number;
  pendingChores: number;
  userGrowth: number;
  expenseGrowth: number;
}

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    activeHouseholds: 0,
    totalExpenses: 0,
    pendingChores: 0,
    userGrowth: 0,
    expenseGrowth: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch users count from real API
    const fetchStats = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/users');
        const users = await response.json();
        
        setStats({
          totalUsers: users.length,
          activeHouseholds: Math.floor(users.length / 2),
          totalExpenses: users.length * 250,
          pendingChores: users.length * 3,
          userGrowth: 12.5,
          expenseGrowth: -8.3,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: Users,
      change: stats.userGrowth,
      color: 'purple',
      bgGradient: 'from-purple-500/20 to-pink-500/20',
      iconColor: 'text-purple-400',
      glowClass: 'glow-purple',
    },
    {
      title: 'Active Households',
      value: stats.activeHouseholds,
      icon: Home,
      change: 8.1,
      color: 'blue',
      bgGradient: 'from-blue-500/20 to-cyan-500/20',
      iconColor: 'text-blue-400',
      glowClass: 'glow-blue',
    },
    {
      title: 'Total Expenses',
      value: `$${stats.totalExpenses}`,
      icon: DollarSign,
      change: stats.expenseGrowth,
      color: 'green',
      bgGradient: 'from-emerald-500/20 to-teal-500/20',
      iconColor: 'text-emerald-400',
      glowClass: 'hover:shadow-emerald-500/20',
    },
    {
      title: 'Pending Chores',
      value: stats.pendingChores,
      icon: CheckSquare,
      change: -5.4,
      color: 'yellow',
      bgGradient: 'from-yellow-500/20 to-orange-500/20',
      iconColor: 'text-yellow-400',
      glowClass: 'hover:shadow-yellow-500/20',
    },
  ];

  const recentActivity = [
    { id: 1, user: 'John Doe', action: 'Created a new expense', time: '2 mins ago', icon: DollarSign, color: 'text-emerald-400' },
    { id: 2, user: 'Jane Smith', action: 'Completed a chore', time: '15 mins ago', icon: CheckSquare, color: 'text-blue-400' },
    { id: 3, user: 'Admin User', action: 'Added new household', time: '1 hour ago', icon: Home, color: 'text-purple-400' },
    { id: 4, user: 'Guest User', action: 'Joined household', time: '2 hours ago', icon: Users, color: 'text-pink-400' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Header */}
      <div className="card glow-purple">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gradient-heading mb-2">
              Welcome to Roomify Dashboard
            </h1>
            <p className="text-gray-400">Here's what's happening with your roommates today</p>
          </div>
          <div className="hidden md:block">
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <Calendar className="h-5 w-5" />
              <span>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          const isPositive = stat.change > 0;
          
          return (
            <div
              key={index}
              className={`card ${stat.glowClass} transform hover:scale-105 transition-all duration-300 cursor-pointer`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 bg-gradient-to-br ${stat.bgGradient} rounded-xl`}>
                  <Icon className={`h-6 w-6 ${stat.iconColor}`} />
                </div>
                <div className={`flex items-center text-sm ${isPositive ? 'text-emerald-400' : 'text-red-400'}`}>
                  {isPositive ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
                  <span className="ml-1 font-medium">{Math.abs(stat.change)}%</span>
                </div>
              </div>
              <h3 className="text-gray-400 text-sm font-medium mb-1">{stat.title}</h3>
              <p className="text-3xl font-bold text-white">{stat.value}</p>
            </div>
          );
        })}
      </div>

      {/* Charts and Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activity Chart */}
        <div className="lg:col-span-2 card glow-blue">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <TrendingUp className="h-6 w-6 text-blue-400" />
              <h2 className="text-2xl font-bold text-gradient-heading">Activity Overview</h2>
            </div>
            <select className="select-field text-sm" aria-label="Time period filter">
              <option>Last 7 days</option>
              <option>Last 30 days</option>
              <option>Last 90 days</option>
            </select>
          </div>
          
          <div className="h-64 flex items-end justify-between space-x-2">
            {[65, 45, 85, 55, 75, 95, 70].map((height, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div
                  className="w-full bg-gradient-to-t from-purple-500 to-blue-500 rounded-t-lg transition-all duration-500 hover:from-purple-400 hover:to-blue-400"
                  style={{ height: `${height}%` }}
                />
                <span className="text-xs text-gray-400 mt-2">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][index]}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="card glow-pink">
          <div className="flex items-center space-x-3 mb-6">
            <Activity className="h-6 w-6 text-pink-400" />
            <h2 className="text-2xl font-bold text-gradient-heading">Recent Activity</h2>
          </div>
          
          <div className="space-y-4">
            {recentActivity.map((activity) => {
              const Icon = activity.icon;
              return (
                <div
                  key={activity.id}
                  className="flex items-start space-x-3 p-3 rounded-xl bg-slate-800/30 hover:bg-slate-800/50 transition-all duration-200"
                >
                  <div className="flex-shrink-0">
                    <Icon className={`h-5 w-5 ${activity.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">{activity.user}</p>
                    <p className="text-xs text-gray-400">{activity.action}</p>
                    <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card">
        <h2 className="text-2xl font-bold text-gradient-heading mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button onClick={() => navigate('/users')} className="btn-primary">
            <Users className="h-5 w-5 mr-2" />
            Manage Users
          </button>
          <button onClick={() => navigate('/households')} className="btn-secondary">
            <Home className="h-5 w-5 mr-2" />
            View Households
          </button>
          <button onClick={() => navigate('/expenses')} className="btn-outline">
            <DollarSign className="h-5 w-5 mr-2" />
            Track Expenses
          </button>
          <button onClick={() => navigate('/chores')} className="btn-outline">
            <CheckSquare className="h-5 w-5 mr-2" />
            Manage Chores
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
