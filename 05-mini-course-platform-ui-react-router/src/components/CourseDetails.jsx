import { getCourseById } from "@/data/coursesData";
import { ArrowRight } from "lucide-react";
import { Link, useParams } from "react-router";

/**
 * CourseDetails Component
 *
 * Displays detailed information about a specific course.
 * This component is rendered when users navigate to /courses/:courseId
 * (the index route of the CourseLayout).
 *
 * React Router concepts demonstrated:
 * - useParams hook to access URL parameters
 * - Index routes (rendered when parent route matches exactly)
 */
function CourseDetails() {
  const { courseId } = useParams();
  const course = getCourseById(courseId);

  // This shouldn't happen since CourseLayout already checks for course existence
  if (!course) {
    return <div>Course not found</div>;
  }

  return (
    <div className="max-w-4xl animate-fade-in">
      {/* Course Hero Section */}
      <div className="flex flex-col lg:flex-row gap-8 mb-12">
        <div className="lg:w-1/3">
          <img
            src={course.image}
            alt={course.title}
            className="w-full h-64 lg:h-48 object-cover rounded-xl shadow-sm"
          />
        </div>
        <div className="lg:w-2/3">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Course Overview
          </h2>
          <p className="text-lg text-gray-600 mb-6 leading-relaxed">
            {course.description}
          </p>

          <div className="grid grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-600 mb-1">
                {course.duration}
              </div>
              <div className="text-sm text-gray-500 font-medium">Duration</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-600 mb-1">
                {course.level}
              </div>
              <div className="text-sm text-gray-500 font-medium">Level</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-600 mb-1">
                {course.lessons.length}
              </div>
              <div className="text-sm text-gray-500 font-medium">Lessons</div>
            </div>
          </div>
        </div>
      </div>

      {/* What You'll Learn Section */}
      <div className="mb-12">
        <h3 className="text-xl font-bold text-gray-900 mb-6">
          What You&apos;ll Learn
        </h3>
        <div className="space-y-4">
          {course.lessons.map((lesson, index) => (
            <div
              key={lesson.id}
              className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
            >
              <div className="flex-shrink-0 w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                {index + 1}
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 mb-1">
                  {lesson.title}
                </h4>
                <span className="text-sm text-gray-500">{lesson.duration}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Getting Started Section */}
      <div className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-xl p-8">
        <h3 className="text-xl font-bold text-gray-900 mb-4">
          Ready to Get Started?
        </h3>
        <p className="text-gray-600 mb-6 leading-relaxed">
          Begin your learning journey with the first lesson, or jump to any
          specific topic using the sidebar navigation.
        </p>
        <Link
          to={`/courses/${course.id}/lessons/${course.lessons[0].id}`}
          className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors duration-200 group"
        >
          Start with &quot;{course.lessons[0].title}&quot;
          <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
        </Link>
      </div>
    </div>
  );
}

export default CourseDetails;
