import { calculateStreak, getTodayString } from "@/utils/dateUtils.js";
import { Check, Flame, Trash2 } from "lucide-react";

const HabitItem = ({ habit, currentWeek, onToggleDay, onDelete }) => {
  const today = getTodayString();
  const streak = calculateStreak(habit.completedDays);

  const getWeekDayName = (date) => {
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return dayNames[new Date(date).getDay()];
  };

  const getWeekProgress = () => {
    const completed = currentWeek.filter(
      (date) => habit.completedDays[date]
    ).length;
    return Math.round((completed / 7) * 100);
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <div
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: habit.color }}
            />
            <h3 className="text-lg font-semibold text-gray-800">
              {habit.name}
            </h3>
          </div>

          {/* Progress Bar */}
          <div className="flex items-center gap-3">
            <div className="flex-1 bg-gray-200 rounded-full h-2">
              <div
                className="h-2 rounded-full transition-all duration-500"
                style={{
                  width: `${getWeekProgress()}%`,
                  backgroundColor: habit.color,
                }}
              />
            </div>
            <span className="text-sm font-medium text-gray-600">
              {getWeekProgress()}%
            </span>
          </div>
        </div>

        <button
          onClick={() => onDelete(habit.id)}
          className="text-gray-400 hover:text-red-500 transition-colors duration-200 p-1"
        >
          <Trash2 size={18} />
        </button>
      </div>

      {/* Streak Info */}
      {streak > 0 && (
        <div className="flex items-center gap-2 mb-4 px-3 py-2 bg-orange-50 rounded-lg">
          <Flame className="text-orange-500" size={16} />
          <span className="text-sm font-medium text-orange-700">
            {streak} day streak! 🔥
          </span>
        </div>
      )}

      {/* Week Days */}
      <div className="grid grid-cols-7 gap-2">
        {currentWeek.map((date) => {
          const isCompleted = habit.completedDays[date];
          const isToday = date === today;

          return (
            <div key={date} className="flex flex-col items-center">
              <span
                className={`text-xs font-medium mb-2 ${
                  isToday ? "text-blue-600" : "text-gray-500"
                }`}
              >
                {getWeekDayName(date)}
              </span>

              <button
                onClick={() => onToggleDay(habit.id, date)}
                className={`w-10 h-10 rounded-full border-2 transition-all duration-200 flex items-center justify-center ${
                  isCompleted
                    ? "border-green-500 bg-green-500 text-white scale-110 shadow-lg"
                    : isToday
                    ? "border-blue-400 bg-blue-50 hover:bg-blue-100"
                    : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
                } ${isToday ? "ring-2 ring-blue-200" : ""}`}
              >
                {isCompleted && <Check size={16} />}
                {isToday && !isCompleted && (
                  <div className="w-2 h-2 bg-blue-400 rounded-full" />
                )}
              </button>

              <span className="text-xs text-gray-400 mt-1">
                {new Date(date).getDate()}
              </span>
            </div>
          );
        })}
      </div>

      {/* Stats */}
      <div className="mt-6 pt-4 border-t border-gray-100 flex justify-between text-sm text-gray-600">
        <span>
          This week:{" "}
          {currentWeek.filter((date) => habit.completedDays[date]).length}/7
        </span>
        <span>Started: {new Date(habit.createdAt).toLocaleDateString()}</span>
      </div>
    </div>
  );
};

export default HabitItem;
