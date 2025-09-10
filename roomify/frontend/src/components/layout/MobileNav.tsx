import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { X, Home, Users, CreditCard, CheckSquare, Bell, Settings, LogOut } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'

interface MobileNavProps {
  open: boolean
  setOpen: (open: boolean) => void
}

const MobileNav: React.FC<MobileNavProps> = ({ open, setOpen }) => {
  const location = useLocation()
  const { logout } = useAuth()

  const navigation = [
    { name: 'Dashboard', href: '/', icon: Home },
    { name: 'Household', href: '/household', icon: Users },
    { name: 'Expenses', href: '/expenses', icon: CreditCard },
    { name: 'Chores', href: '/chores', icon: CheckSquare },
    { name: 'Notifications', href: '/notifications', icon: Bell },
    { name: 'Settings', href: '/settings', icon: Settings },
  ]

  const isActive = (href: string) => {
    if (href === '/') {
      return location.pathname === '/'
    }
    return location.pathname.startsWith(href)
  }

  if (!open) return null

  return (
    <div className="lg:hidden">
      <div className="fixed inset-0 z-40">
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setOpen(false)} />
        
        <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white">
          <div className="absolute top-0 right-0 -mr-12 pt-2">
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
                        ? 'bg-gray-100 text-gray-900'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                    onClick={() => setOpen(false)}
                  >
                    <Icon
                      className={`mr-4 h-6 w-6 ${
                        isActive(item.href)
                          ? 'text-gray-500'
                          : 'text-gray-400 group-hover:text-gray-500'
                      }`}
                    />
                    {item.name}
                  </Link>
                )
              })}
            </nav>
          </div>
          
          {/* Logout */}
          <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
            <button
              onClick={() => {
                logout()
                setOpen(false)
              }}
              className="flex items-center w-full px-2 py-2 text-base font-medium text-gray-600 rounded-md hover:bg-gray-50 hover:text-gray-900 transition-colors"
            >
              <LogOut className="mr-4 h-6 w-6 text-gray-400" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MobileNav
