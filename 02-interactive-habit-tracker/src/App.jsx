import { Plus } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import AddHabitForm from "./components/AddHabitForm.jsx";
import HabitItem from "./components/HabitItem.jsx";
import { getCurrentWeekDates, getTodayString } from "./utils/dateUtils.js";

function App() {
  const [habits, setHabits] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);

  // Use useMemo for static current week data since we don't update it
  const currentWeek = useMemo(() => getCurrentWeekDates(), []);

  // Load habits from localStorage
  useEffect(() => {
    const savedHabits = localStorage.getItem("habits");
    if (savedHabits) {
      try {
        setHabits(JSON.parse(savedHabits));
      } catch (error) {
        console.error("Error parsing saved habits:", error);
      }
    }
  }, []);

  // Save habits to localStorage
  useEffect(() => {
    localStorage.setItem("habits", JSON.stringify(habits));
  }, [habits]);

  const addHabit = (name, color) => {
    const newHabit = {
      id: Date.now(),
      name,
      color,
      completedDays: {},
      createdAt: getTodayString(),
    };
    setHabits((prev) => [...prev, newHabit]);
    setShowAddForm(false);
  };

  const toggleHabitDay = (habitId, date) => {
    setHabits((prev) =>
      prev.map((habit) => {
        if (habit.id === habitId) {
          const newCompletedDays = { ...habit.completedDays };
          if (newCompletedDays[date]) {
            delete newCompletedDays[date];
          } else {
            newCompletedDays[date] = true;
          }
          return { ...habit, completedDays: newCompletedDays };
        }
        return habit;
      })
    );
  };

  const deleteHabit = (habitId) => {
    setHabits((prev) => prev.filter((habit) => habit.id !== habitId));
  };

  const getTotalCompletedToday = () => {
    const today = getTodayString();
    return habits.reduce((count, habit) => {
      return count + (habit.completedDays[today] ? 1 : 0);
    }, 0);
  };

  const getWeekProgress = () => {
    const totalPossible = habits.length * 7;
    if (totalPossible === 0) return 0;

    const totalCompleted = currentWeek.reduce((weekTotal, date) => {
      return (
        weekTotal +
        habits.reduce((dayTotal, habit) => {
          return dayTotal + (habit.completedDays[date] ? 1 : 0);
        }, 0)
      );
    }, 0);

    return Math.round((totalCompleted / totalPossible) * 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Habit Tracker
          </h1>
          <p className="text-gray-600 text-lg">
            Build better habits, one day at a time
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">
                  Today's Progress
                </p>
                <p className="text-3xl font-bold text-blue-600">
                  {getTotalCompletedToday()}
                </p>
                <p className="text-gray-400 text-sm">habits completed</p>
              </div>
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">🎯</span>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">
                  Week Progress
                </p>
                <p className="text-3xl font-bold text-purple-600">
                  {getWeekProgress()}%
                </p>
                <p className="text-gray-400 text-sm">completion rate</p>
              </div>
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">📊</span>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">
                  Active Habits
                </p>
                <p className="text-3xl font-bold text-green-600">
                  {habits.length}
                </p>
                <p className="text-gray-400 text-sm">habits tracked</p>
              </div>
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">✨</span>
              </div>
            </div>
          </div>
        </div>

        {/* Add Habit Button */}
        <div className="flex justify-center mb-8">
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-2xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 flex items-center gap-3"
          >
            <Plus size={24} />
            Add New Habit
          </button>
        </div>

        {/* Add Habit Form Modal */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
              <AddHabitForm
                onAddHabit={addHabit}
                onCancel={() => setShowAddForm(false)}
              />
            </div>
          </div>
        )}

        {/* Habits List */}
        {habits.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl">🌱</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              No habits yet
            </h3>
            <p className="text-gray-400">
              Start building better habits by adding your first one!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {habits.map((habit) => (
              <HabitItem
                key={habit.id}
                habit={habit}
                currentWeek={currentWeek}
                onToggleDay={toggleHabitDay}
                onDelete={deleteHabit}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
