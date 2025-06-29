import {
  AlertCircle,
  Calendar,
  Edit,
  ListChecks,
  Save,
  Trash2,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import useWorkoutStore from "../store/workoutStore";
import AddExerciseForm from "./AddExerciseForm";

const EditWorkoutModal = ({ workout: session, onClose }) => {
  const { updateWorkout } = useWorkoutStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [sessionName, setSessionName] = useState(session.name);
  const [sessionDate, setSessionDate] = useState(session.date);
  const [sessionExercises, setSessionExercises] = useState(session.exercises);

  const [errors, setErrors] = useState({});

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  const handleAddExercise = (exercise) => {
    setSessionExercises([...sessionExercises, exercise]);
  };

  const handleRemoveExercise = (exerciseId) => {
    setSessionExercises(sessionExercises.filter((ex) => ex.id !== exerciseId));
  };

  const validateForm = () => {
    if (sessionExercises.length === 0) {
      setErrors({
        session: "A workout session must have at least one exercise.",
      });
      return false;
    }
    setErrors({});
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 300));

      updateWorkout(session.id, {
        name: sessionName,
        date: sessionDate,
        exercises: sessionExercises,
      });

      onClose();
    } catch (error) {
      console.error("Error updating workout:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
              <Edit className="h-5 w-5 text-primary-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Edit Workout Session
              </h2>
              <p className="text-sm text-gray-600">
                Update your workout details and exercises
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-200 rounded-lg transition-colors duration-200"
            disabled={isSubmitting}
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-140px)]">
          <form onSubmit={handleSubmit} className="p-6 space-y-8">
            {/* Session Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="sessionName"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Session Name
                </label>
                <input
                  type="text"
                  id="sessionName"
                  value={sessionName}
                  onChange={(e) => setSessionName(e.target.value)}
                  className="input"
                  placeholder="e.g., Morning Push Day"
                  disabled={isSubmitting}
                />
              </div>
              <div>
                <label
                  htmlFor="date"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  <Calendar className="inline h-4 w-4 mr-1 text-primary-600" />
                  Date
                </label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={sessionDate}
                  onChange={(e) => setSessionDate(e.target.value)}
                  className="input"
                  disabled={isSubmitting}
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
              {sessionExercises.length > 0 ? (
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
              ) : (
                <div className="text-center py-8 bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg">
                  <ListChecks className="mx-auto h-12 w-12 text-gray-400 mb-3" />
                  <p className="text-gray-600 font-medium">
                    No exercises in this session
                  </p>
                  <p className="text-sm text-gray-500">
                    Add exercises below to update your workout
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
            {errors.session && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
                <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium text-red-800">
                    Unable to save changes
                  </h4>
                  <p className="text-sm text-red-700 mt-1">{errors.session}</p>
                </div>
              </div>
            )}
          </form>
        </div>

        {/* Footer */}
        <div className="flex justify-end space-x-3 px-6 py-4 border-t border-gray-200 bg-gray-50">
          <button
            type="button"
            onClick={onClose}
            className="btn-outline"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="btn-primary flex items-center space-x-2 min-w-[140px] justify-center"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                <span>Save Changes</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditWorkoutModal;
