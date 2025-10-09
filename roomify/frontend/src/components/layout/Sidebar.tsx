import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Home, Users, CreditCard, CheckSquare, Bell, Settings } from 'lucide-react'

const Sidebar: React.FC = () => {
  const location = useLocation()

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Expenses', href: '/expenses', icon: CreditCard },
    { name: 'Chores', href: '/chores', icon: CheckSquare },
    { name: 'Reminders', href: '/reminders', icon: Bell },
    { name: 'Roommates', href: '/roommates', icon: Users },
    { name: 'Settings', href: '/settings', icon: Settings },
  ]

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return location.pathname === '/dashboard' || location.pathname === '/'
    }
    return location.pathname.startsWith(href)
  }

  return (
    <div className="hidden lg:flex lg:flex-shrink-0">
      <div className="flex flex-col w-64">
        <div className="flex flex-col h-0 flex-1 glass backdrop-blur-xl border-r border-slate-700/30 pt-20">
          {/* Navigation */}
          <div className="flex-1 flex flex-col overflow-y-auto">
            <nav className="flex-1 px-2 py-4 space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors ${
                      isActive(item.href)
                        ? 'bg-gradient-to-r from-purple-600/20 to-blue-600/20 text-white border border-purple-500/30 shadow-lg shadow-purple-500/10'
                        : 'text-gray-300 hover:bg-slate-800/50 hover:text-white'
                    }`}
                  >
                    <Icon
                      className={`mr-3 h-5 w-5 ${
                        isActive(item.href)
                          ? 'text-purple-400 drop-shadow-[0_0_8px_rgba(168,85,247,0.5)]'
                          : 'text-gray-400 group-hover:text-purple-400 transition-colors duration-200'
                      }`}
                    />
                    {item.name}
                  </Link>
                )
              })}
            </nav>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Sidebar
