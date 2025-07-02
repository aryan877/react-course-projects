import WorkoutForm from "@/components/WorkoutForm";
import WorkoutList from "@/components/WorkoutList";
import WorkoutStats from "@/components/WorkoutStats";
import { Dumbbell } from "lucide-react";

const LogWorkout = () => {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center space-x-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
            <Dumbbell className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Log Your Workout
          </h1>
        </div>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Track your progress and build consistency with every session
        </p>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-5 gap-8">
        {/* Workout Form - Takes up 2 columns on lg, 3 columns on xl */}
        <div className="lg:col-span-2 xl:col-span-3">
          <WorkoutForm />
        </div>

        {/* Stats Sidebar - Takes up 1 column on lg, 2 columns on xl */}
        <div className="lg:col-span-1 xl:col-span-2">
          <WorkoutStats />
        </div>
      </div>

      {/* Workout History */}
      <div>
        <WorkoutList />
      </div>
    </div>
  );
};

export default LogWorkout;
