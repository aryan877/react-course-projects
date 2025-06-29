/**
 * Pre-defined exercises organized by muscle groups
 */

export const EXERCISE_CATEGORIES = {
  CHEST: {
    name: "Chest",
    exercises: [
      "Bench Press",
      "Incline Bench Press",
      "Decline Bench Press",
      "Dumbbell Press",
      "Incline Dumbbell Press",
      "Dumbbell Flyes",
      "Push-ups",
      "Chest Dips",
      "Cable Flyes",
      "Pec Deck",
    ],
  },
  BACK: {
    name: "Back",
    exercises: [
      "Deadlift",
      "Pull-ups",
      "Chin-ups",
      "Barbell Rows",
      "Dumbbell Rows",
      "T-Bar Rows",
      "Seated Cable Rows",
      "Lat Pulldowns",
      "Face Pulls",
      "Shrugs",
    ],
  },
  SHOULDERS: {
    name: "Shoulders",
    exercises: [
      "Overhead Press",
      "Shoulder Press",
      "Dumbbell Shoulder Press",
      "Lateral Raises",
      "Front Raises",
      "Rear Delt Flyes",
      "Arnold Press",
      "Upright Rows",
      "Pike Push-ups",
      "Handstand Push-ups",
    ],
  },
  LEGS: {
    name: "Legs",
    exercises: [
      "Squat",
      "Back Squat",
      "Front Squat",
      "Leg Press",
      "Lunges",
      "Bulgarian Split Squats",
      "Romanian Deadlift",
      "Leg Curls",
      "Leg Extensions",
      "Calf Raises",
      "Walking Lunges",
      "Goblet Squats",
    ],
  },
  ARMS: {
    name: "Arms",
    exercises: [
      "Bicep Curls",
      "Hammer Curls",
      "Tricep Dips",
      "Tricep Extensions",
      "Close-Grip Bench Press",
      "Preacher Curls",
      "Cable Curls",
      "Overhead Tricep Extension",
      "21s",
      "Concentration Curls",
    ],
  },
  CORE: {
    name: "Core",
    exercises: [
      "Plank",
      "Crunches",
      "Russian Twists",
      "Dead Bug",
      "Mountain Climbers",
      "Bicycle Crunches",
      "Leg Raises",
      "Hanging Knee Raises",
      "Wood Chops",
      "Ab Wheel",
    ],
  },
  CARDIO: {
    name: "Cardio",
    exercises: [
      "Running",
      "Cycling",
      "Rowing",
      "Elliptical",
      "Stair Climber",
      "Jump Rope",
      "Burpees",
      "High Knees",
      "Jumping Jacks",
      "Sprint Intervals",
    ],
  },
  FULL_BODY: {
    name: "Full Body",
    exercises: [
      "Burpees",
      "Clean and Press",
      "Thrusters",
      "Turkish Get-up",
      "Bear Crawl",
      "Man Makers",
      "Squat to Press",
      "Deadlift to Row",
      "Renegade Rows",
      "Mountain Climbers",
    ],
  },
};

// Get all categories
export const getAllCategories = () => {
  return Object.keys(EXERCISE_CATEGORIES).map((key) => ({
    key,
    name: EXERCISE_CATEGORIES[key].name,
    exercises: EXERCISE_CATEGORIES[key].exercises,
  }));
};
