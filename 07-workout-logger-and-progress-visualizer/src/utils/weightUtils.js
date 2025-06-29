/**
 * Weight conversion utilities
 */

// Conversion constants
const LBS_TO_KG_RATIO = 2.20462;

/**
 * Convert weight between units
 * @param {number} weight - The weight value to convert
 * @param {string} fromUnit - Source unit ('lbs' or 'kg')
 * @param {string} toUnit - Target unit ('lbs' or 'kg')
 * @returns {number} Converted weight rounded to 1 decimal place
 */
export const convertWeight = (weight, fromUnit, toUnit) => {
  if (fromUnit === toUnit) return weight;

  if (fromUnit === "lbs" && toUnit === "kg") {
    return Math.round((weight / LBS_TO_KG_RATIO) * 10) / 10;
  }

  if (fromUnit === "kg" && toUnit === "lbs") {
    return Math.round(weight * LBS_TO_KG_RATIO * 10) / 10;
  }

  return weight;
};

/**
 * Get display weight in the specified unit
 * @param {Object} workout - Workout object with weight and weightUnit
 * @param {string} displayUnit - Unit to display ('lbs' or 'kg')
 * @returns {number} Weight converted to display unit
 */
export const getDisplayWeight = (workout, displayUnit) => {
  const workoutUnit = workout.weightUnit || "lbs";
  return convertWeight(workout.weight, workoutUnit, displayUnit);
};

/**
 * Calculate total volume for a workout in specified unit
 * @param {Object} workout - Workout object
 * @param {string} displayUnit - Unit to display ('lbs' or 'kg')
 * @returns {number} Total volume (weight × sets × reps)
 */
export const getDisplayVolume = (workout, displayUnit) => {
  const displayWeight = getDisplayWeight(workout, displayUnit);
  return displayWeight * workout.sets * workout.reps;
};

/**
 * Get appropriate step value for weight input based on unit
 * @param {string} unit - Weight unit ('lbs' or 'kg')
 * @returns {string} Step value for input
 */
export const getWeightStep = (unit) => {
  return unit === "kg" ? "0.25" : "0.5";
};

/**
 * Get appropriate placeholder value for weight input based on unit
 * @param {string} unit - Weight unit ('lbs' or 'kg')
 * @returns {string} Placeholder value
 */
export const getWeightPlaceholder = (unit) => {
  return unit === "kg" ? "60" : "135";
};

/**
 * Convert workout weight to editing unit (for forms)
 * @param {Object} workout - Workout object
 * @param {string} editUnit - Unit to edit in ('lbs' or 'kg')
 * @returns {number} Weight converted for editing
 */
export const getEditWeight = (workout, editUnit) => {
  const workoutUnit = workout.weightUnit || "lbs";
  return convertWeight(workout.weight, workoutUnit, editUnit);
};
