import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, Bell, Settings, Home } from 'lucide-react';

interface HeaderProps {
  onMenuClick: () => void;
}

interface Notification {
  id: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  
  // Mock notifications data - replace with actual data from your API
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      title: 'Welcome to RoomiFy',
      message: 'Get started by exploring the dashboard',
      read: false,
      createdAt: new Date().toISOString()
    }
  ]);

  const unreadNotifications = notifications.filter(n => !n.read);

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-gray-900/80 backdrop-blur-md border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <button
              type="button"
              className="lg:hidden text-gray-400 hover:text-white focus:outline-none"
              onClick={onMenuClick}
              aria-label="Open menu"
            >
              <Menu className="h-6 w-6" />
            </button>
            <div className="flex-shrink-0 ml-4 lg:ml-0">
              <Link to="/" className="flex items-center space-x-2">
                <div className="h-10 w-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/25">
                  <Home className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gradient-heading">Roomify</h1>
                  <p className="text-xs text-gray-400 -mt-1">Smart Living</p>
                </div>
              </Link>
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="relative p-2 text-gray-300 hover:text-purple-400 hover:bg-slate-800/50 rounded-xl transition-all duration-200"
                aria-label="Notifications"
              >
                <Bell className="h-6 w-6" />
                {unreadNotifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {unreadNotifications.length > 9 ? '9+' : unreadNotifications.length}
                  </span>
                )}
              </button>

              {/* Notifications dropdown */}
              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-gray-800 backdrop-blur-xl border border-slate-700/30 rounded-2xl shadow-2xl z-50">
                  <div className="p-4 border-b border-slate-700/30">
                    <h3 className="text-lg font-semibold text-gray-100">Notifications</h3>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="p-4 text-center text-gray-300">
                        No notifications
                      </div>
                    ) : (
                      notifications.slice(0, 5).map((notification) => (
                        <div
                          key={notification.id}
                          className={`p-4 border-b border-slate-700/30 hover:bg-slate-700/30 transition-colors duration-200 ${
                            !notification.read ? 'bg-purple-500/10' : ''
                          }`}
                        >
                          <div className="flex items-start">
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-100">
                                {notification.title}
                              </p>
                              <p className="text-sm text-gray-300 mt-1">
                                {notification.message}
                              </p>
                              <p className="text-xs text-gray-400 mt-2">
                                {new Date(notification.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                  {notifications.length > 5 && (
                    <div className="p-4 border-t border-slate-700/30">
                      <Link
                        to="/notifications"
                        className="text-sm text-purple-400 hover:text-purple-300 font-medium transition-colors duration-200"
                      >
                        View all notifications
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Settings */}
            <Link
              to="/settings"
              className="p-2 text-gray-300 hover:text-purple-400 hover:bg-slate-800/50 rounded-xl transition-all duration-200"
              aria-label="Settings"
            >
              <Settings className="h-6 w-6" />
            </Link>
          </div>
        </div>

      </div>

      {/* Click outside to close dropdowns */}
      {notificationsOpen && (
        <div
          className="fixed inset-0 z-30"
          onClick={() => setNotificationsOpen(false)}
        />
      )}
    </header>
  )
}

export default Header

