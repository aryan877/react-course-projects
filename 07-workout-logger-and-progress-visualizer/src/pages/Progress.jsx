import ProgressChart from "@/components/ProgressChart";
import useWorkoutStore from "@/store/workoutStore";
import { BarChart3, Dumbbell, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router";

const Progress = () => {
  const { workouts } = useWorkoutStore();
  const navigate = useNavigate();

  if (workouts.length === 0) {
    return (
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Your Progress
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Visualize your fitness journey and track your improvements over time
          </p>
        </div>

        {/* Empty State */}
        <div className="card">
          <div className="card-body text-center py-16">
            <div className="mx-auto w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-6">
              <BarChart3 className="h-12 w-12 text-gray-400" />
            </div>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              No workout data yet
            </h3>
            <p className="text-gray-600 max-w-md mx-auto mb-6">
              Start logging your workouts to see beautiful progress charts and
              track your fitness journey over time.
            </p>

            <button
              onClick={() => navigate("/log")}
              className="btn-primary text-base px-6 py-3 flex items-center space-x-2 mx-auto"
            >
              <Dumbbell className="h-5 w-5" />
              <span>Log Your First Workout</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center space-x-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
            <TrendingUp className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Your Progress
          </h1>
        </div>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Track your fitness journey with detailed charts and analytics
        </p>
      </div>

      {/* Progress Chart */}
      <ProgressChart />
    </div>
  );
};

export default Progress;
