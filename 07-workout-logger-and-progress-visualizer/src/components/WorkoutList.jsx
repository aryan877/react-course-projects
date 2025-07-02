import EditWorkoutModal from "@/components/EditWorkoutModal";
import useWorkoutStore from "@/store/workoutStore";
import { getDisplayWeight } from "@/utils/weightUtils";
import { format } from "date-fns";
import {
  Activity,
  Calendar,
  ChevronDown,
  Dumbbell,
  Edit2,
  ListChecks,
  Search,
  Trash2,
} from "lucide-react";
import { useState } from "react";

const WorkoutList = () => {
  const { workouts, deleteWorkout, weightUnit } = useWorkoutStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [editingWorkout, setEditingWorkout] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [expandedSessions, setExpandedSessions] = useState({});

  const toggleSession = (sessionId) => {
    setExpandedSessions((prev) => ({ ...prev, [sessionId]: !prev[sessionId] }));
  };

  const filteredWorkouts = workouts
    .filter(
      (session) =>
        session.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        session.exercises.some((ex) =>
          ex.exerciseName.toLowerCase().includes(searchTerm.toLowerCase())
        )
    )
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  const handleDelete = (id) => {
    deleteWorkout(id);
    setDeleteConfirmId(null);
  };

  if (workouts.length === 0) {
    return (
      <div className="card">
        <div className="card-body text-center py-16">
          <div className="mx-auto w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
            <Dumbbell className="h-10 w-10 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No workouts logged yet
          </h3>
          <p className="text-gray-600 max-w-md mx-auto">
            Your workout history will appear here once you start logging
            sessions. Start your fitness journey by creating your first workout!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
            <Activity className="h-7 w-7 text-primary-600" />
            <span>Workout History</span>
          </h2>
          <p className="text-gray-600 mt-1">
            {workouts.length} {workouts.length === 1 ? "workout" : "workouts"}{" "}
            logged
          </p>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search workouts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input pl-10 w-full sm:w-64"
          />
        </div>
      </div>

      {/* Workout Cards */}
      <div className="space-y-4">
        {filteredWorkouts.map((session) => (
          <div
            key={session.id}
            className="card group hover:shadow-lg transition-all duration-300"
          >
            <div
              className="card-body p-6 cursor-pointer"
              onClick={() => toggleSession(session.id)}
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                      <Dumbbell className="h-6 w-6 text-primary-600" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 truncate">
                          {session.name}
                        </h3>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary-100 text-secondary-800 flex-shrink-0">
                          {session.exercises.length}{" "}
                          {session.exercises.length === 1
                            ? "Exercise"
                            : "Exercises"}
                        </span>
                      </div>

                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <span>
                            {format(new Date(session.date), "MMM dd, yyyy")}
                          </span>
                        </div>
                        <div className="hidden sm:flex items-center space-x-1">
                          <span>•</span>
                          <span>
                            {session.exercises.reduce(
                              (total, ex) => total + ex.sets * ex.reps,
                              0
                            )}{" "}
                            total reps
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center space-x-2 flex-shrink-0">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingWorkout(session);
                    }}
                    className="btn-outline px-3 py-2 text-sm hover:bg-primary-50 hover:border-primary-300 hover:text-primary-700 transition-colors duration-200"
                    title="Edit workout"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>

                  {deleteConfirmId === session.id ? (
                    <div
                      className="flex items-center space-x-2"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        onClick={() => handleDelete(session.id)}
                        className="btn-danger px-3 py-2 text-sm"
                      >
                        Delete
                      </button>
                      <button
                        onClick={() => setDeleteConfirmId(null)}
                        className="btn-outline px-3 py-2 text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeleteConfirmId(session.id);
                      }}
                      className="btn-outline px-3 py-2 text-sm text-red-600 border-red-300 hover:bg-red-50 hover:border-red-400 transition-colors duration-200"
                      title="Delete workout"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}

                  <ChevronDown
                    className={`h-5 w-5 text-gray-500 transition-transform duration-200 ${
                      expandedSessions[session.id] ? "rotate-180" : ""
                    }`}
                  />
                </div>
              </div>
            </div>

            {/* Expanded Exercise Details */}
            {expandedSessions[session.id] && (
              <div className="border-t border-gray-200 bg-gray-50">
                <div className="p-6">
                  <h4 className="text-sm font-semibold text-gray-800 mb-4 flex items-center space-x-2">
                    <ListChecks className="h-4 w-4 text-secondary-600" />
                    <span>Exercise Details</span>
                  </h4>

                  <div className="grid gap-3">
                    {session.exercises.map((ex, index) => (
                      <div
                        key={ex.id}
                        className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow duration-200"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="flex-shrink-0 w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                            <span className="text-sm font-semibold text-primary-600">
                              {index + 1}
                            </span>
                          </div>

                          <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4">
                            <div>
                              <p className="font-semibold text-gray-900">
                                {ex.exerciseName}
                              </p>
                            </div>
                            <div className="flex items-center space-x-4 text-sm text-gray-600">
                              <span className="font-medium">
                                {getDisplayWeight(ex, weightUnit)} {weightUnit}
                              </span>
                            </div>
                            <div className="flex items-center space-x-4 text-sm text-gray-600">
                              <span>
                                {ex.sets} sets × {ex.reps} reps
                              </span>
                              <span className="text-xs text-gray-400">
                                = {ex.sets * ex.reps} total reps
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* No Search Results */}
      {filteredWorkouts.length === 0 && searchTerm && (
        <div className="card">
          <div className="card-body text-center py-12">
            <Search className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              No results found
            </h3>
            <p className="text-gray-600">
              No workouts match your search for{" "}
              <span className="font-medium">&quot;{searchTerm}&quot;</span>
            </p>
            <button
              onClick={() => setSearchTerm("")}
              className="btn-outline mt-4"
            >
              Clear search
            </button>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editingWorkout && (
        <EditWorkoutModal
          workout={editingWorkout}
          onClose={() => setEditingWorkout(null)}
        />
      )}
    </div>
  );
};

export default WorkoutList;
