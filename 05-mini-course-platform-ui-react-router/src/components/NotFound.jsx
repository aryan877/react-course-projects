import { Link, useLocation } from 'react-router-dom';

/**
 * NotFound Component
 * 
 * 404 error page displayed when users navigate to invalid routes.
 * This component demonstrates:
 * - Catch-all routing with wildcard (*)
 * - useLocation hook to display the invalid path
 * - User-friendly error handling
 */
function NotFound() {
  const location = useLocation();
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full text-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 sm:p-12 animate-scale-in">
          {/* Error Icon */}
          <div className="text-6xl mb-6">🔍</div>
          
          {/* Error Message */}
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Page Not Found
          </h1>
          <p className="text-lg text-gray-600 mb-2">
            Sorry, we couldn't find the page you're looking for.
          </p>
          <p className="text-sm text-gray-500 mb-8">
            Requested path: <code className="bg-gray-100 px-2 py-1 rounded font-mono text-xs">{location.pathname}</code>
          </p>
          
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link 
              to="/" 
              className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors duration-200"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
              </svg>
              Go to Homepage
            </Link>
            
            <button 
              onClick={() => window.history.back()} 
              className="inline-flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold px-6 py-3 rounded-lg transition-colors duration-200"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
              Go Back
            </button>
          </div>
          
          {/* Helpful Links */}
          <div className="border-t border-gray-200 pt-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Looking for something specific?
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Link 
                to="/" 
                className="p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors duration-200 group"
              >
                <div className="font-medium text-gray-900 group-hover:text-primary-600 mb-1">
                  All Courses
                </div>
                <div className="text-sm text-gray-500">
                  Browse our course catalog
                </div>
              </Link>
              <Link 
                to="/courses/react-fundamentals" 
                className="p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors duration-200 group"
              >
                <div className="font-medium text-gray-900 group-hover:text-primary-600 mb-1">
                  React Fundamentals
                </div>
                <div className="text-sm text-gray-500">
                  Learn React basics
                </div>
              </Link>
              <Link 
                to="/courses/javascript-advanced" 
                className="p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors duration-200 group"
              >
                <div className="font-medium text-gray-900 group-hover:text-primary-600 mb-1">
                  Advanced JavaScript
                </div>
                <div className="text-sm text-gray-500">
                  Master JS concepts
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NotFound;