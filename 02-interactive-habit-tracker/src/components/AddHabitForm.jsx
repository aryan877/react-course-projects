import { X } from "lucide-react";
import { useState } from "react";

const AddHabitForm = ({ onAddHabit, onCancel }) => {
  const [habitName, setHabitName] = useState("");
  const [selectedColor, setSelectedColor] = useState("#3B82F6");

  const colors = [
    "#3B82F6", // Blue
    "#8B5CF6", // Purple
    "#10B981", // Green
    "#F59E0B", // Yellow
    "#EF4444", // Red
    "#06B6D4", // Cyan
    "#F97316", // Orange
    "#8B5A2B", // Brown
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (habitName.trim()) {
      onAddHabit(habitName.trim(), selectedColor);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Add New Habit</h2>
        <button
          onClick={onCancel}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={24} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="habitName"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Habit Name
          </label>
          <input
            id="habitName"
            type="text"
            value={habitName}
            onChange={(e) => setHabitName(e.target.value)}
            placeholder="e.g., Drink 8 glasses of water"
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
            autoFocus
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Choose Color
          </label>
          <div className="grid grid-cols-4 gap-3">
            {colors.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => setSelectedColor(color)}
                className={`w-12 h-12 rounded-full transition-all duration-200 ${
                  selectedColor === color
                    ? "ring-4 ring-offset-2 ring-gray-300 scale-110"
                    : "hover:scale-105"
                }`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors duration-200 font-medium"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!habitName.trim()}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium"
          >
            Add Habit
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddHabitForm;
