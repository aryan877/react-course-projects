import { Link } from 'react-router-dom';
import { coursesData } from '../data/coursesData';

/**
 * HomePage Component
 * 
 * Displays a grid of available courses with links to individual course pages.
 * This component demonstrates:
 * - Using Link component for navigation
 * - Mapping over data to create dynamic lists
 * - Responsive grid layout with Tailwind CSS
 */
function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Header Section */}
      <header className="bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="text-center animate-fade-in">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Mini Course Platform
            </h1>
            <p className="text-xl sm:text-2xl text-primary-100 max-w-3xl mx-auto leading-relaxed">
              Master modern web development with our comprehensive courses
            </p>
          </div>
        </div>
      </header>

      {/* Course Grid Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Available Courses
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Choose from our carefully crafted courses designed to take your skills to the next level
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {coursesData.map((course, index) => (
            <CourseCard 
              key={course.id} 
              course={course} 
              index={index}
            />
          ))}
        </div>
      </main>
    </div>
  );
}

/**
 * CourseCard Component
 * 
 * Displays individual course information in a card format.
 * Uses React Router's Link component for navigation.
 * 
 * @param {Object} props - Component props
 * @param {Object} props.course - Course data object
 * @param {number} props.index - Card index for staggered animation
 */
function CourseCard({ course, index }) {
  return (
    <div 
      className="card card-hover animate-slide-up"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div className="relative">
        <img 
          src={course.image} 
          alt={course.title}
          className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute top-4 right-4">
          <span className="bg-white/90 backdrop-blur-sm text-gray-700 px-3 py-1 rounded-full text-sm font-semibold">
            {course.level}
          </span>
        </div>
      </div>
      
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
          {course.title}
        </h3>
        <p className="text-gray-600 mb-4 line-clamp-3 leading-relaxed">
          {course.description}
        </p>
        
        <div className="flex items-center gap-4 mb-6 text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
            </svg>
            <span>{course.duration}</span>
          </div>
          <div className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{course.lessons.length} lessons</span>
          </div>
        </div>
        
        {/* Link to course details page */}
        <Link 
          to={`/courses/${course.id}`} 
          className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-semibold transition-colors duration-200 group"
        >
          Start Learning
          <svg className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </Link>
      </div>
    </div>
  );
}

export default HomePage;