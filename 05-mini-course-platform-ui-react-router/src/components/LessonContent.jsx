import NotFound from "@/components/NotFound";
import { getCourseById, getLessonById } from "@/data/coursesData";
import { ArrowLeft, ArrowRight, CheckCircle, Clock } from "lucide-react";
import { Link, useParams } from "react-router";

/**
 * LessonContent Component
 *
 * Displays the content of a specific lesson within a course.
 * This component is rendered when users navigate to /courses/:courseId/lessons/:lessonId
 *
 * React Router concepts demonstrated:
 * - useParams hook to access multiple URL parameters
 * - Nested routing with multiple parameters
 * - Conditional rendering based on route parameters
 */
function LessonContent() {
  const { courseId, lessonId } = useParams();

  // Get course and lesson data
  const course = getCourseById(courseId);
  const lesson = getLessonById(courseId, lessonId);

  // If lesson doesn't exist, show 404
  if (!course || !lesson) {
    return <NotFound />;
  }

  // Find current lesson index for navigation
  const currentLessonIndex = course.lessons.findIndex((l) => l.id === lessonId);
  const previousLesson =
    currentLessonIndex > 0 ? course.lessons[currentLessonIndex - 1] : null;
  const nextLesson =
    currentLessonIndex < course.lessons.length - 1
      ? course.lessons[currentLessonIndex + 1]
      : null;

  return (
    <div className="max-w-4xl animate-fade-in">
      {/* Lesson Header */}
      <header className="mb-8 pb-6 border-b border-gray-200">
        <div className="flex flex-wrap items-center gap-4 mb-4 text-sm text-gray-500">
          <span className="inline-flex items-center gap-1">
            <CheckCircle className="w-4 h-4" />
            Lesson {currentLessonIndex + 1} of {course.lessons.length}
          </span>
          <span className="inline-flex items-center gap-1">
            <Clock className="w-4 h-4" />
            {lesson.duration}
          </span>
        </div>
        <h1 className="text-3xl font-bold text-gray-900">{lesson.title}</h1>
      </header>

      {/* Lesson Body */}
      <article className="mb-12">
        {/* Render HTML content safely */}
        <div
          className="prose prose-lg max-w-none
            prose-headings:text-gray-900 prose-headings:font-bold
            prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4
            prose-h3:text-xl prose-h3:mt-6 prose-h3:mb-3
            prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-4
            prose-ul:my-4 prose-li:my-1
            prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-pre:rounded-lg prose-pre:p-4
            prose-code:bg-gray-100 prose-code:text-gray-800 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-sm
            prose-pre:code:bg-transparent prose-pre:code:text-gray-100 prose-pre:code:p-0"
          dangerouslySetInnerHTML={{ __html: lesson.content }}
        />
      </article>

      {/* Progress Indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">
            Course Progress
          </span>
          <span className="text-sm text-gray-500">
            {Math.round(
              ((currentLessonIndex + 1) / course.lessons.length) * 100
            )}
            % Complete
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-primary-600 to-secondary-600 h-2 rounded-full transition-all duration-500"
            style={{
              width: `${
                ((currentLessonIndex + 1) / course.lessons.length) * 100
              }%`,
            }}
          />
        </div>
      </div>

      {/* Lesson Navigation */}
      <nav className="border-t border-gray-200 pt-8">
        <div className="flex flex-col sm:flex-row gap-4">
          {previousLesson ? (
            <Link
              to={`/courses/${courseId}/lessons/${previousLesson.id}`}
              className="flex-1 group"
            >
              <div className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-all duration-200">
                <div className="flex-shrink-0">
                  <ArrowLeft className="w-5 h-5 text-gray-400 group-hover:text-primary-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-gray-500 mb-1">Previous</div>
                  <div className="font-medium text-gray-900 group-hover:text-primary-700 truncate">
                    {previousLesson.title}
                  </div>
                </div>
              </div>
            </Link>
          ) : (
            <Link to={`/courses/${courseId}`} className="flex-1 group">
              <div className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-all duration-200">
                <div className="flex-shrink-0">
                  <ArrowLeft className="w-5 h-5 text-gray-400 group-hover:text-primary-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-gray-500 mb-1">Back to</div>
                  <div className="font-medium text-gray-900 group-hover:text-primary-700">
                    Course Overview
                  </div>
                </div>
              </div>
            </Link>
          )}

          {nextLesson ? (
            <Link
              to={`/courses/${courseId}/lessons/${nextLesson.id}`}
              className="flex-1 group"
            >
              <div className="flex items-center gap-3 p-4 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors duration-200">
                <div className="flex-1 min-w-0 text-right">
                  <div className="text-sm text-primary-100 mb-1">Next</div>
                  <div className="font-medium truncate">{nextLesson.title}</div>
                </div>
                <div className="flex-shrink-0">
                  <ArrowRight className="w-5 h-5 transition-transform duration-200 group-hover:translate-x-1" />
                </div>
              </div>
            </Link>
          ) : (
            <div className="flex-1">
              <div className="text-center p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                <div className="text-2xl mb-2">🎉</div>
                <div className="font-semibold text-green-800 mb-2">
                  Course Complete!
                </div>
                <div className="text-sm text-green-600 mb-4">
                  Congratulations on finishing this course
                </div>
                <Link
                  to="/"
                  className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-medium px-4 py-2 rounded-lg transition-colors duration-200"
                >
                  Explore More Courses
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          )}
        </div>
      </nav>
    </div>
  );
}

export default LessonContent;
