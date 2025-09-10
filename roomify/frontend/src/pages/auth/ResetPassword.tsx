import React from 'react'
import { Link } from 'react-router-dom'
import { Lock } from 'lucide-react'

const ResetPassword: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h1 className="text-4xl font-bold text-center text-gradient mb-2">
            RoomiFy
          </h1>
          <h2 className="text-center text-3xl font-extrabold text-gray-900">
            Set new password
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Enter your new password below.
          </p>
        </div>

        <div className="card">
          <div className="text-center py-12">
            <Lock className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Reset Password</h3>
            <p className="text-gray-500 mb-4">This page will contain the complete password reset interface.</p>
            <Link to="/login" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
              Back to login
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ResetPassword


