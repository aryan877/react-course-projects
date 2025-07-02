import AddExerciseForm from "@/components/AddExerciseForm";
import useWorkoutStore from "@/store/workoutStore";
import {
  AlertCircle,
  Calendar,
  Dumbbell,
  ListChecks,
  Save,
  Trash2,
} from "lucide-react";
import { useState } from "react";

const WorkoutForm = () => {
  const { addWorkout } = useWorkoutStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sessionName, setSessionName] = useState("");
  const [sessionDate, setSessionDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [sessionExercises, setSessionExercises] = useState([]);
  const [error, setError] = useState("");

  const handleAddExercise = (exercise) => {
    setSessionExercises([...sessionExercises, exercise]);
  };

  const handleRemoveExercise = (exerciseId) => {
    setSessionExercises(sessionExercises.filter((ex) => ex.id !== exerciseId));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (sessionExercises.length === 0) {
      setError("Please add at least one exercise to the workout session.");
      return;
    }
    setError("");
    setIsSubmitting(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 500));

      addWorkout({
        name: sessionName.trim() || `Workout on ${sessionDate}`,
        date: sessionDate,
        exercises: sessionExercises,
      });

      // Reset form
      setSessionName("");
      setSessionDate(new Date().toISOString().split("T")[0]);
      setSessionExercises([]);

      const submitButton = e.target.querySelector('button[type="submit"]');
      submitButton.classList.add("animate-bounce-subtle");
      setTimeout(() => {
        submitButton.classList.remove("animate-bounce-subtle");
      }, 600);
    } catch (error) {
      console.error("Error adding workout session:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="card">
      <div className="card-header">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-primary-100 rounded-lg">
            <Dumbbell className="h-6 w-6 text-primary-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Create Workout Session
            </h2>
            <p className="text-sm text-gray-600">
              Log your exercises and track your progress
            </p>
          </div>
        </div>
      </div>

      <div className="card-body">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Session Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="sessionName"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Session Name
                <span className="text-gray-400 font-normal ml-1">
                  (Optional)
                </span>
              </label>
              <input
                type="text"
                id="sessionName"
                value={sessionName}
                onChange={(e) => setSessionName(e.target.value)}
                className="input"
                placeholder="e.g., Morning Push Day, Leg Workout"
                disabled={isSubmitting}
              />
              <p className="mt-1 text-xs text-gray-500">
                Leave blank to auto-generate based on date
              </p>
            </div>

            <div>
              <label
                htmlFor="date"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                <Calendar className="inline h-4 w-4 mr-1 text-primary-600" />
                Workout Date
              </label>
              <input
                type="date"
                id="date"
                name="date"
                value={sessionDate}
                onChange={(e) => setSessionDate(e.target.value)}
                className="input"
                disabled={isSubmitting}
                required
              />
            </div>
          </div>

          {/* Exercises Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                <ListChecks className="h-5 w-5 text-secondary-600" />
                <span>Exercises</span>
                {sessionExercises.length > 0 && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary-100 text-secondary-800">
                    {sessionExercises.length}{" "}
                    {sessionExercises.length === 1 ? "exercise" : "exercises"}
                  </span>
                )}
              </h3>
            </div>

            {/* Exercise List */}
            {sessionExercises.length > 0 && (
              <div className="space-y-3">
                {sessionExercises.map((ex, index) => (
                  <div
                    key={ex.id}
                    className="flex items-center justify-between bg-gray-50 border border-gray-200 p-4 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0 w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-semibold text-primary-600">
                          {index + 1}
                        </span>
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">
                          {ex.exerciseName}
                        </p>
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">
                            {ex.weight} {ex.weightUnit}
                          </span>
                          <span className="mx-2">•</span>
                          <span>{ex.sets} sets</span>
                          <span className="mx-2">•</span>
                          <span>{ex.reps} reps</span>
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveExercise(ex.id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors duration-200"
                      disabled={isSubmitting}
                      title="Remove exercise"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {sessionExercises.length === 0 && (
              <div className="text-center py-8 bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg">
                <ListChecks className="mx-auto h-12 w-12 text-gray-400 mb-3" />
                <p className="text-gray-600 font-medium">
                  No exercises added yet
                </p>
                <p className="text-sm text-gray-500">
                  Add your first exercise below to get started
                </p>
              </div>
            )}
          </div>

          {/* Add Exercise Form */}
          <AddExerciseForm
            onAddExercise={handleAddExercise}
            isSubmitting={isSubmitting}
          />

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
              <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-red-800">
                  Unable to save workout
                </h4>
                <p className="text-sm text-red-700 mt-1">{error}</p>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex justify-end pt-6 border-t border-gray-200">
            <button
              type="submit"
              disabled={isSubmitting || sessionExercises.length === 0}
              className="btn-primary text-base py-3 px-8 flex items-center space-x-2 min-w-[160px] justify-center"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="h-5 w-5" />
                  <span>Save Workout</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default WorkoutForm;
