import React from 'react'
import { AlertCircle, RefreshCw } from 'lucide-react'

const ErrorMessage = ({ 
  title = 'Something went wrong', 
  message = 'Please try again later.',
  onRetry,
  showRetry = true 
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
        <AlertCircle className="w-8 h-8 text-red-600" />
      </div>
      
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 mb-6 max-w-md">{message}</p>
      
      {showRetry && onRetry && (
        <button
          onClick={onRetry}
          className="flex items-center space-x-2 bg-royal-600 hover:bg-royal-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Try Again</span>
        </button>
      )}
    </div>
  )
}

export default ErrorMessage