import { AlertCircle, Hash, PlusCircle, Target } from "lucide-react";
import { useState } from "react";
import useWorkoutStore from "../store/workoutStore";
import { getAllCategories } from "../utils/exercises";
import { getWeightPlaceholder, getWeightStep } from "../utils/weightUtils";

const AddExerciseForm = ({ onAddExercise, isSubmitting }) => {
  const { weightUnit } = useWorkoutStore();

  const initialExerciseState = {
    exerciseName: "",
    customExerciseName: "",
    weight: "",
    sets: "",
    reps: "",
  };

  const [formData, setFormData] = useState(initialExerciseState);
  const [errors, setErrors] = useState({});
  const [isCustomExercise, setIsCustomExercise] = useState(false);

  const categories = getAllCategories();

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "exerciseName") {
      if (value === "custom") {
        setIsCustomExercise(true);
        setFormData((prev) => ({
          ...prev,
          exerciseName: "custom",
          customExerciseName: "",
        }));
      } else {
        setIsCustomExercise(false);
        setFormData((prev) => ({
          ...prev,
          exerciseName: value,
          customExerciseName: "",
        }));
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
    if (name === "exerciseName" || name === "customExerciseName") {
      setErrors((prev) => ({ ...prev, exerciseName: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    const exercise = isCustomExercise
      ? formData.customExerciseName.trim()
      : formData.exerciseName.trim();

    if (!exercise) {
      newErrors.exerciseName = "Exercise name is required";
    }
    if (!formData.weight || formData.weight < 0) {
      newErrors.weight = "Weight must be 0 or more";
    }
    if (!formData.sets || formData.sets <= 0) {
      newErrors.sets = "Sets must be > 0";
    }
    if (!formData.reps || formData.reps <= 0) {
      newErrors.reps = "Reps must be > 0";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddClick = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const finalExerciseName = isCustomExercise
      ? formData.customExerciseName.trim()
      : formData.exerciseName.trim();

    onAddExercise({
      id: `${Date.now()}-${Math.random()}`,
      exerciseName: finalExerciseName,
      weight: parseFloat(formData.weight) || 0,
      sets: parseInt(formData.sets),
      reps: parseInt(formData.reps),
      weightUnit: weightUnit,
    });

    setFormData(initialExerciseState);
    setIsCustomExercise(false);
    setErrors({});
  };

  return (
    <div className="card bg-gradient-to-br from-gray-50 to-white border-2 border-dashed border-gray-300">
      <div className="card-body">
        <div className="flex items-center space-x-2 mb-4">
          <PlusCircle className="h-5 w-5 text-primary-600" />
          <h3 className="text-lg font-semibold text-gray-900">Add Exercise</h3>
        </div>

        <div className="space-y-6">
          {/* Exercise Selection */}
          <div>
            <label
              htmlFor="exerciseName"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              <Target className="inline h-4 w-4 mr-1 text-primary-600" />
              Exercise
            </label>
            <select
              id="exerciseName"
              name="exerciseName"
              value={formData.exerciseName}
              onChange={handleInputChange}
              className={`input ${
                errors.exerciseName
                  ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                  : ""
              }`}
              disabled={isSubmitting}
            >
              <option value="" disabled>
                Select an exercise
              </option>
              {categories.map((category) => (
                <optgroup key={category.key} label={category.name}>
                  {category.exercises.map((exercise) => (
                    <option key={exercise} value={exercise}>
                      {exercise}
                    </option>
                  ))}
                </optgroup>
              ))}
              <optgroup label="Custom">
                <option value="custom">Create Custom Exercise</option>
              </optgroup>
            </select>

            {isCustomExercise && (
              <div className="mt-3">
                <input
                  type="text"
                  name="customExerciseName"
                  value={formData.customExerciseName}
                  onChange={handleInputChange}
                  className={`input ${
                    errors.exerciseName
                      ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                      : ""
                  }`}
                  placeholder="Enter custom exercise name"
                  disabled={isSubmitting}
                />
              </div>
            )}

            {errors.exerciseName && (
              <p className="mt-2 text-sm text-red-600 flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" />
                {errors.exerciseName}
              </p>
            )}
          </div>

          {/* Weight, Sets, Reps Grid */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label
                htmlFor="weight"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Weight ({weightUnit})
              </label>
              <input
                type="number"
                id="weight"
                name="weight"
                value={formData.weight}
                onChange={handleInputChange}
                className={`input ${
                  errors.weight
                    ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                    : ""
                }`}
                placeholder={getWeightPlaceholder(weightUnit)}
                min="0"
                step={getWeightStep(weightUnit)}
                disabled={isSubmitting}
              />
              {errors.weight && (
                <p className="mt-1 text-xs text-red-600">{errors.weight}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="sets"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                <Hash className="inline h-4 w-4 mr-1 text-secondary-600" />
                Sets
              </label>
              <input
                type="number"
                id="sets"
                name="sets"
                value={formData.sets}
                onChange={handleInputChange}
                className={`input ${
                  errors.sets
                    ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                    : ""
                }`}
                placeholder="3"
                min="1"
                disabled={isSubmitting}
              />
              {errors.sets && (
                <p className="mt-1 text-xs text-red-600">{errors.sets}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="reps"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                <Hash className="inline h-4 w-4 mr-1 text-accent-600" />
                Reps
              </label>
              <input
                type="number"
                id="reps"
                name="reps"
                value={formData.reps}
                onChange={handleInputChange}
                className={`input ${
                  errors.reps
                    ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                    : ""
                }`}
                placeholder="10"
                min="1"
                disabled={isSubmitting}
              />
              {errors.reps && (
                <p className="mt-1 text-xs text-red-600">{errors.reps}</p>
              )}
            </div>
          </div>

          {/* Add Button */}
          <div className="flex justify-end pt-2">
            <button
              type="button"
              onClick={handleAddClick}
              disabled={isSubmitting}
              className="btn-primary flex items-center space-x-2"
            >
              <PlusCircle className="h-4 w-4" />
              <span>Add Exercise</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddExerciseForm;
