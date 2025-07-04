import { convertWeight } from "@/utils/weightUtils";
import { create } from "zustand";
import { persist } from "zustand/middleware";

const useWorkoutStore = create(
  persist(
    (set, get) => ({
      workouts: [], // Array of workout sessions
      isLoading: false,
      error: null,
      weightUnit: "lbs", // 'lbs' or 'kg'

      // Set weight unit
      setWeightUnit: (unit) => {
        set({ weightUnit: unit });
      },

      // Convert weight between units (using utility)
      convertWeight: (weight, fromUnit, toUnit) => {
        return convertWeight(weight, fromUnit, toUnit);
      },

      // Get weight display with unit
      getWeightDisplay: (weight) => {
        const { weightUnit } = get();
        return `${weight} ${weightUnit}`;
      },

      // Add a new workout session
      addWorkout: (session) => {
        const newSession = {
          id: Date.now().toString(),
          ...session,
          createdAt: new Date().toISOString(),
        };

        set((state) => ({
          workouts: [...state.workouts, newSession],
          error: null,
        }));
      },

      // Update an existing workout session
      updateWorkout: (id, updates) => {
        set((state) => ({
          workouts: state.workouts.map((session) =>
            session.id === id
              ? { ...session, ...updates, updatedAt: new Date().toISOString() }
              : session
          ),
          error: null,
        }));
      },

      // Delete a workout session
      deleteWorkout: (id) => {
        set((state) => ({
          workouts: state.workouts.filter((session) => session.id !== id),
          error: null,
        }));
      },

      // Get workouts for a specific exercise from all sessions
      getWorkoutsByExercise: (exerciseName) => {
        const { workouts } = get();
        const allExercises = workouts.flatMap((session) =>
          session.exercises.map((ex) => ({
            ...ex,
            date: session.date, // Add session date to each exercise
          }))
        );
        return allExercises
          .filter(
            (ex) => ex.exerciseName.toLowerCase() === exerciseName.toLowerCase()
          )
          .sort((a, b) => new Date(a.date) - new Date(b.date));
      },

      // Get unique exercise names from all sessions
      getUniqueExercises: () => {
        const { workouts } = get();
        const exercises = workouts.flatMap((session) =>
          session.exercises.map((ex) => ex.exerciseName)
        );
        return [...new Set(exercises)].sort();
      },

      // Get workout statistics
      getWorkoutStats: () => {
        const { workouts } = get();
        const totalWorkouts = workouts.length;
        const uniqueExercises = get().getUniqueExercises().length;

        return {
          totalWorkouts,
          uniqueExercises,
        };
      },

      // Set loading state
      setLoading: (loading) => set({ isLoading: loading }),

      // Set error state
      setError: (error) => set({ error }),

      // Clear error
      clearError: () => set({ error: null }),
    }),
    {
      name: "workout-storage",
    }
  )
);

export default useWorkoutStore;
