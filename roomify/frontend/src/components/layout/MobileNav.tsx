import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { X, Users, Home as HomeIcon, LayoutDashboard, DollarSign, CheckSquare, Bell } from 'lucide-react';

interface MobileNavProps {
  open: boolean;
  onClose: () => void;
}

const MobileNav: React.FC<MobileNavProps> = ({ open, onClose }) => {
  const location = useLocation();

  const navigation = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Users', path: '/users', icon: Users },
    { name: 'Households', path: '/households', icon: HomeIcon },
    { name: 'Expenses', path: '/expenses', icon: DollarSign },
    { name: 'Chores', path: '/chores', icon: CheckSquare },
    { name: 'Notifications', path: '/notifications', icon: Bell },
  ];

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  if (!open) return null;

  return (
    <div className="lg:hidden">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-gray-900/80 z-40"
        onClick={onClose}
        aria-hidden="true"
      />
      
      {/* Mobile menu */}
      <div className="fixed inset-y-0 left-0 w-64 bg-gray-800 z-50 overflow-y-auto">
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-700">
          <Link to="/" className="flex items-center space-x-2" onClick={onClose}>
            <div className="h-8 w-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
              <HomeIcon className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gradient-heading">Roomify</h2>
            </div>
          </Link>
          <button
            type="button"
            className="text-gray-400 hover:text-white p-2"
            onClick={onClose}
            aria-label="Close menu"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <nav className="px-2 py-4 space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.name}
                to={item.path}
                onClick={onClose}
                className={`group flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors ${
                  active
                    ? 'bg-gradient-to-r from-purple-600/20 to-blue-600/20 text-white border border-purple-500/30 shadow-lg shadow-purple-500/10'
                    : 'text-gray-300 hover:bg-slate-800/50 hover:text-white'
                }`}
              >
                <Icon
                  className={`mr-3 h-5 w-5 flex-shrink-0 ${
                    active ? 'text-purple-400' : 'text-gray-400 group-hover:text-gray-300'
                  }`}
                  aria-hidden="true"
                />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default MobileNav;
