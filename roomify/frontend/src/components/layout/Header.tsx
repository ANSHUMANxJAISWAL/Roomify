import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Menu,
  Bell,
  Search,
  Settings,
  ChevronDown
} from 'lucide-react'
import { useDashboard } from '../../contexts/DashboardContext'

interface HeaderProps {
  onMenuClick: () => void
}

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const { notifications } = useDashboard()
  const [notificationsOpen, setNotificationsOpen] = useState(false)

  const unreadNotifications = notifications.filter(n => !n.readAt)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass backdrop-blur-xl border-b border-slate-700/30">
      <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 h-20">
        {/* Left side */}
        <div className="flex items-center">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-md text-gray-300 hover:text-purple-400 hover:bg-slate-800/50 transition-colors duration-200"
          >
            <Menu className="h-6 w-6" />
          </button>

          <div className="ml-4 lg:ml-0 flex items-center">
            <h1 className="text-3xl font-bold text-gradient-heading drop-shadow-lg">RoomiFy</h1>
          </div>
        </div>

        {/* Center - Search */}
        <div className="flex-1 max-w-lg mx-4 hidden md:block">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-300" />
            <input
              type="text"
              placeholder="Search expenses, chores, reminders..."
              className="w-full pl-10 pr-4 py-2 border border-slate-600/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 bg-slate-800/50 backdrop-blur-sm text-gray-100 placeholder-gray-400"
            />
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="relative p-2 text-gray-300 hover:text-purple-400 hover:bg-slate-800/50 rounded-xl transition-all duration-200"
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
              <div className="absolute right-0 mt-2 w-80 glass backdrop-blur-xl border border-slate-700/30 rounded-2xl shadow-2xl z-50">
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
                        className={`p-4 border-b border-slate-700/30 hover:bg-slate-800/30 transition-colors duration-200 ${
                          !notification.readAt ? 'bg-purple-500/10' : ''
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
          >
            <Settings className="h-6 w-6" />
          </Link>
        </div>
      </div>

      {/* Click outside to close dropdowns */}
      {notificationsOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setNotificationsOpen(false)}
        />
      )}
    </header>
  )
}

export default Header

