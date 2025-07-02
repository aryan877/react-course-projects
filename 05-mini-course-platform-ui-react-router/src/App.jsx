import CourseDetails from "@/components/CourseDetails";
import CourseLayout from "@/components/CourseLayout";
import HomePage from "@/components/HomePage";
import LessonContent from "@/components/LessonContent";
import NotFound from "@/components/NotFound";
import { Route, BrowserRouter as Router, Routes } from "react-router";

/**
 * Main App component that sets up the routing structure
 *
 * Routing Structure:
 * - / : Homepage with course listings
 * - /courses/:courseId : Course details page
 * - /courses/:courseId/lessons/:lessonId : Individual lesson page
 * - * : 404 Not Found page
 *
 * The CourseLayout component acts as a wrapper for course-related pages,
 * providing consistent navigation and layout.
 */
function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          {/* Homepage Route */}
          <Route path="/" element={<HomePage />} />

          {/* Course Routes - using nested routing */}
          <Route path="/courses/:courseId" element={<CourseLayout />}>
            {/* Index route - shows course details when no lesson is selected */}
            <Route index element={<CourseDetails />} />

            {/* Lesson route - shows specific lesson content */}
            <Route path="lessons/:lessonId" element={<LessonContent />} />
          </Route>

          {/* Catch-all route for 404 errors */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
