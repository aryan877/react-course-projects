import {
  differenceInCalendarDays,
  isToday,
  isYesterday,
  parseISO,
} from "date-fns";
import {
  Award,
  BarChart3,
  Calendar,
  Target,
  TrendingUp,
  Zap,
} from "lucide-react";
import useWorkoutStore from "../store/workoutStore";
import { getDisplayVolume } from "../utils/weightUtils";

const WorkoutStats = () => {
  const { getWorkoutStats, workouts, weightUnit } = useWorkoutStore();
  const stats = getWorkoutStats();

  const getRecentStreak = () => {
    if (workouts.length === 0) return 0;

    const sessionDates = [...new Set(workouts.map((s) => s.date))].sort(
      (a, b) => new Date(b).getTime() - new Date(a).getTime()
    );

    if (sessionDates.length === 0) return 0;

    const mostRecentDate = parseISO(sessionDates[0]);

    if (!isToday(mostRecentDate) && !isYesterday(mostRecentDate)) {
      return 0;
    }

    let streak = 1;
    let lastDate = mostRecentDate;

    for (let i = 1; i < sessionDates.length; i++) {
      const currentDate = parseISO(sessionDates[i]);
      if (differenceInCalendarDays(lastDate, currentDate) === 1) {
        streak++;
        lastDate = currentDate;
      } else {
        break;
      }
    }

    return streak;
  };

  const getMostRecentWorkout = () => {
    if (workouts.length === 0) return null;
    return [...workouts].sort((a, b) => new Date(b.date) - new Date(a.date))[0];
  };

  const getTotalVolumeInCurrentUnit = () => {
    return workouts
      .flatMap((s) => s.exercises)
      .reduce((sum, exercise) => {
        return sum + getDisplayVolume(exercise, weightUnit);
      }, 0);
  };

  const streak = getRecentStreak();
  const recentWorkout = getMostRecentWorkout();
  const totalVolumeInCurrentUnit = getTotalVolumeInCurrentUnit();

  const statCards = [
    {
      title: "Total Workouts",
      value: stats.totalWorkouts,
      icon: Target,
      color: "text-primary-600",
      bgColor: "bg-primary-100",
      description: "Sessions completed",
    },
    {
      title: "Unique Exercises",
      value: stats.uniqueExercises,
      icon: Zap,
      color: "text-secondary-600",
      bgColor: "bg-secondary-100",
      description: "Different movements",
    },
    {
      title: "Total Volume",
      value: `${totalVolumeInCurrentUnit.toLocaleString()} ${weightUnit}`,
      icon: TrendingUp,
      color: "text-accent-600",
      bgColor: "bg-accent-100",
      description: "Weight lifted",
    },
    {
      title: "Current Streak",
      value: `${streak} ${streak === 1 ? "day" : "days"}`,
      icon: Award,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
      description: "Consecutive workout days",
    },
  ];

  if (workouts.length === 0) {
    return (
      <div className="card">
        <div className="card-header">
          <div className="flex items-center space-x-2">
            <BarChart3 className="h-5 w-5 text-gray-400" />
            <h3 className="text-lg font-semibold text-gray-900">Your Stats</h3>
          </div>
        </div>
        <div className="card-body text-center py-8">
          <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <BarChart3 className="h-8 w-8 text-gray-400" />
          </div>
          <p className="text-gray-600">
            Log your first workout to see your progress statistics here.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Main Stats Card */}
      <div className="card">
        <div className="card-header">
          <div className="flex items-center space-x-2">
            <BarChart3 className="h-5 w-5 text-primary-600" />
            <h3 className="text-lg font-semibold text-gray-900">Your Stats</h3>
          </div>
        </div>

        <div className="card-body">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {statCards.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div
                  key={index}
                  className="relative bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all duration-200"
                >
                  <div className="flex items-start space-x-4">
                    <div
                      className={`flex-shrink-0 p-3 rounded-lg ${stat.bgColor}`}
                    >
                      <Icon className={`h-6 w-6 ${stat.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-600 mb-1">
                        {stat.title}
                      </p>
                      <p className="text-2xl font-bold text-gray-900 mb-1">
                        {stat.value}
                      </p>
                      <p className="text-xs text-gray-500">
                        {stat.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recent Workout Card */}
      {recentWorkout && (
        <div className="card">
          <div className="card-header">
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-secondary-600" />
              <h3 className="text-lg font-semibold text-gray-900">
                Latest Workout
              </h3>
            </div>
          </div>

          <div className="card-body">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-12 h-12 bg-secondary-100 rounded-lg flex items-center justify-center">
                <Target className="h-6 w-6 text-secondary-600" />
              </div>

              <div className="flex-1">
                <h4 className="text-lg font-semibold text-gray-900 mb-1">
                  {recentWorkout.name}
                </h4>

                <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                  <span className="flex items-center space-x-1">
                    <span className="font-medium">
                      {recentWorkout.exercises.length}
                    </span>
                    <span>
                      {recentWorkout.exercises.length === 1
                        ? "exercise"
                        : "exercises"}
                    </span>
                  </span>
                  <span>•</span>
                  <span className="flex items-center space-x-1">
                    <span className="font-medium">
                      {recentWorkout.exercises.reduce(
                        (total, ex) => total + ex.sets * ex.reps,
                        0
                      )}
                    </span>
                    <span>total reps</span>
                  </span>
                </div>

                <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                  {new Date(recentWorkout.date).toLocaleDateString(undefined, {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    timeZone: "UTC",
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkoutStats;
