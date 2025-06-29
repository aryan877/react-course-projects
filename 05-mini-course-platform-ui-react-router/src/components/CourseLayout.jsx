import { Outlet, useParams, Link, useLocation } from 'react-router-dom';
import { getCourseById } from '../data/coursesData';
import NotFound from './NotFound';

/**
 * CourseLayout Component
 * 
 * This component provides the layout structure for course-related pages.
 * It includes:
 * - Course navigation sidebar
 * - Main content area (rendered by Outlet)
 * 
 * Key React Router concepts demonstrated:
 * - useParams: Access URL parameters
 * - useLocation: Get current location information
 * - Outlet: Render nested route components
 * - Nested routing structure
 */
function CourseLayout() {
  const { courseId } = useParams();
  const location = useLocation();
  
  // Get course data based on URL parameter
  const course = getCourseById(courseId);
  
  // If course doesn't exist, show 404
  if (!course) {
    return <NotFound />;
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      {/* Course Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium mb-4 transition-colors duration-200"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back to Courses
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            {course.title}
          </h1>
          <div className="flex flex-wrap items-center gap-4">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-800">
              {course.level}
            </span>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
              {course.duration}
            </span>
          </div>
        </div>
      </header>
      
      <div className="flex flex-1 max-w-7xl mx-auto w-full">
        {/* Sidebar Navigation */}
        <aside className="w-80 bg-white border-r border-gray-200 overflow-y-auto">
          <CourseSidebar course={course} currentPath={location.pathname} />
        </aside>
        
        {/* Main Content Area */}
        <main className="flex-1 bg-white overflow-y-auto">
          <div className="p-6 lg:p-8">
            {/* Outlet renders the nested route components */}
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

/**
 * CourseSidebar Component
 * 
 * Displays course navigation with lessons.
 * Highlights the currently active lesson.
 * 
 * @param {Object} props - Component props
 * @param {Object} props.course - Course data object
 * @param {string} props.currentPath - Current URL path for highlighting active items
 */
function CourseSidebar({ course, currentPath }) {
  return (
    <nav className="p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Course Content</h3>
      
      {/* Course Overview Link */}
      <Link 
        to={`/courses/${course.id}`}
        className={`flex items-center gap-3 p-3 rounded-lg mb-2 transition-all duration-200 ${
          currentPath === `/courses/${course.id}` 
            ? 'bg-primary-50 text-primary-700 border border-primary-200' 
            : 'text-gray-700 hover:bg-gray-50'
        }`}
      >
        <div className="flex-shrink-0">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
            <path fillRule="evenodd" d="M4 5a2 2 0 012-2v1a1 1 0 102 0V3h4v1a1 1 0 102 0V3a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
          </svg>
        </div>
        <span className="font-medium">Course Overview</span>
      </Link>
      
      {/* Lessons List */}
      <div className="mt-6">
        <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
          Lessons
        </h4>
        <ul className="space-y-1">
          {course.lessons.map((lesson, index) => (
            <li key={lesson.id}>
              <Link
                to={`/courses/${course.id}/lessons/${lesson.id}`}
                className={`flex items-start gap-3 p-3 rounded-lg transition-all duration-200 ${
                  currentPath === `/courses/${course.id}/lessons/${lesson.id}`
                    ? 'bg-primary-50 text-primary-700 border border-primary-200'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold ${
                  currentPath === `/courses/${course.id}/lessons/${lesson.id}`
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm leading-5 mb-1">
                    {lesson.title}
                  </div>
                  <div className="text-xs text-gray-500">
                    {lesson.duration}
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}

export default CourseLayout;