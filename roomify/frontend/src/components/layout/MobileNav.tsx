import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { X, Home, Users, CreditCard, CheckSquare, Bell, Settings } from 'lucide-react'

interface MobileNavProps {
  open: boolean
  setOpen: (open: boolean) => void
}

const MobileNav: React.FC<MobileNavProps> = ({ open, setOpen }) => {
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

  if (!open) return null

  return (
    <div className="lg:hidden">
      <div className="fixed inset-0 z-40">
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setOpen(false)} />
        
        <div className="relative flex-1 flex flex-col max-w-xs w-full glass backdrop-blur-xl pt-20">
          <div className="absolute top-20 right-0 -mr-12 pt-2">
            <button
              type="button"
              className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              onClick={() => setOpen(false)}
            >
              <span className="sr-only">Close sidebar</span>
              <X className="h-6 w-6 text-white" />
            </button>
          </div>
          
          {/* Logo */}
          <div className="flex items-center h-16 px-4 border-b border-gray-200">
            <h1 className="text-xl font-bold text-gray-900">RoomiFy</h1>
          </div>
          
          {/* Navigation */}
          <div className="flex-1 flex flex-col overflow-y-auto">
            <nav className="flex-1 px-2 py-4 space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`group flex items-center px-2 py-2 text-base font-medium rounded-md transition-colors ${
                      isActive(item.href)
                        ? 'bg-gradient-to-r from-purple-600/20 to-blue-600/20 text-white border border-purple-500/30 shadow-lg shadow-purple-500/10'
                        : 'text-gray-300 hover:bg-slate-800/50 hover:text-white'
                    }`}
                    onClick={() => setOpen(false)}
                  >
                    <Icon
                      className={`mr-4 h-6 w-6 ${
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

export default MobileNav
