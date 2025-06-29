import {
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";
import { format, parseISO } from "date-fns";
import { Activity, BarChart3, Download, TrendingUp } from "lucide-react";
import Papa from "papaparse";
import { useEffect, useMemo, useState } from "react";
import { Line } from "react-chartjs-2";
import useWorkoutStore from "../store/workoutStore";
import { getDisplayVolume, getDisplayWeight } from "../utils/weightUtils";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const ProgressChart = () => {
  const { getUniqueExercises, getWorkoutsByExercise, weightUnit, workouts } =
    useWorkoutStore();
  const [selectedExercise, setSelectedExercise] = useState("");
  const [chartType, setChartType] = useState("weight"); // 'weight' or 'volume'

  const exercises = getUniqueExercises();

  // Set default exercise to the first one available
  useEffect(() => {
    if (exercises.length > 0 && !selectedExercise) {
      setSelectedExercise(exercises[0]);
    }
    if (
      exercises.length > 0 &&
      selectedExercise &&
      !exercises.includes(selectedExercise)
    ) {
      setSelectedExercise(exercises[0]);
    }
  }, [exercises, selectedExercise]);

  const exerciseWorkouts = useMemo(() => {
    return selectedExercise ? getWorkoutsByExercise(selectedExercise) : [];
  }, [selectedExercise, getWorkoutsByExercise]);

  const chartData = useMemo(() => {
    if (!exerciseWorkouts.length) return null;

    const labels = exerciseWorkouts.map((workout) =>
      format(parseISO(workout.date), "MMM dd")
    );

    const weightData = exerciseWorkouts.map((workout) =>
      getDisplayWeight(workout, weightUnit)
    );
    const volumeData = exerciseWorkouts.map((workout) =>
      getDisplayVolume(workout, weightUnit)
    );

    const dataPoints = chartType === "weight" ? weightData : volumeData;
    const label =
      chartType === "weight"
        ? `Max Weight (${weightUnit})`
        : `Volume (${weightUnit})`;
    const borderColor =
      chartType === "weight" ? "rgb(37, 99, 235)" : "rgb(5, 150, 105)";
    const backgroundColor =
      chartType === "weight"
        ? "rgba(37, 99, 235, 0.1)"
        : "rgba(5, 150, 105, 0.1)";

    return {
      labels,
      datasets: [
        {
          label,
          data: dataPoints,
          borderColor,
          backgroundColor,
          borderWidth: 3,
          fill: true,
          tension: 0.4,
          pointBackgroundColor: borderColor,
          pointBorderColor: "#fff",
          pointBorderWidth: 2,
          pointRadius: 6,
          pointHoverRadius: 8,
        },
      ],
    };
  }, [exerciseWorkouts, chartType, weightUnit]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          font: {
            size: 14,
            weight: "500",
          },
        },
      },
      title: {
        display: true,
        text: `${selectedExercise} Progress - ${
          chartType === "weight" ? "Max Weight" : "Volume"
        } Over Time`,
        font: {
          size: 16,
          weight: "600",
        },
        padding: 20,
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        titleColor: "#fff",
        bodyColor: "#fff",
        borderColor: "rgba(255, 255, 255, 0.1)",
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: false,
        callbacks: {
          label: function (context) {
            const workout = exerciseWorkouts[context.dataIndex];
            const displayWeight = getDisplayWeight(workout, weightUnit);
            if (chartType === "weight") {
              return `Weight: ${context.parsed.y} ${weightUnit} (${workout.sets} × ${workout.reps})`;
            } else {
              return `Volume: ${context.parsed.y.toLocaleString()} ${weightUnit} (${displayWeight.toLocaleString()} × ${
                workout.sets
              } × ${workout.reps})`;
            }
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          color: "rgba(0, 0, 0, 0.05)",
        },
        ticks: {
          font: {
            size: 12,
          },
        },
      },
      y: {
        beginAtZero: false,
        grid: {
          color: "rgba(0, 0, 0, 0.05)",
        },
        ticks: {
          font: {
            size: 12,
          },
          callback: function (value) {
            return chartType === "volume" ? value.toLocaleString() : value;
          },
        },
      },
    },
    interaction: {
      intersect: false,
      mode: "index",
    },
  };

  const exportData = () => {
    if (!exerciseWorkouts.length) return;

    const data = exerciseWorkouts.map((workout) => ({
      Date: workout.date,
      Exercise: workout.exerciseName,
      [`Weight (${weightUnit})`]: getDisplayWeight(workout, weightUnit),
      Sets: workout.sets,
      Reps: workout.reps,
      [`Volume (${weightUnit})`]: getDisplayVolume(workout, weightUnit),
    }));

    const csv = Papa.unparse(data, {
      header: true,
      skipEmptyLines: true,
    });

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${selectedExercise.replace(/\s+/g, "_")}_progress.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const allExercises = useMemo(() => {
    const flattened = workouts.flatMap((s) => s.exercises);
    return flattened;
  }, [workouts]);

  const maxWeightForExercise = useMemo(() => {
    return Math.max(
      0,
      ...exerciseWorkouts.map((w) => getDisplayWeight(w, weightUnit))
    );
  }, [exerciseWorkouts, weightUnit]);

  const totalVolumeForExercise = useMemo(() => {
    return exerciseWorkouts.reduce(
      (sum, w) => sum + getDisplayVolume(w, weightUnit),
      0
    );
  }, [exerciseWorkouts, weightUnit]);

  if (allExercises.length === 0) {
    return (
      <div className="card">
        <div className="card-body text-center py-16">
          <div className="mx-auto w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
            <TrendingUp className="h-10 w-10 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No data to display
          </h3>
          <p className="text-gray-600 max-w-md mx-auto">
            Start logging workouts to see your progress charts and track your
            improvements over time.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Controls Section */}
      <div className="card">
        <div className="card-header">
          <div className="flex items-center space-x-2">
            <Activity className="h-5 w-5 text-primary-600" />
            <h3 className="text-lg font-semibold text-gray-900">
              Progress Analytics
            </h3>
          </div>
        </div>

        <div className="card-body">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div>
                <label
                  htmlFor="exercise-select"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Select Exercise
                </label>
                <select
                  id="exercise-select"
                  value={selectedExercise}
                  onChange={(e) => setSelectedExercise(e.target.value)}
                  className="input w-full sm:w-56"
                >
                  {exercises.map((exercise) => (
                    <option key={exercise} value={exercise}>
                      {exercise}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="chart-type"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Chart Type
                </label>
                <select
                  id="chart-type"
                  value={chartType}
                  onChange={(e) => setChartType(e.target.value)}
                  className="input w-full sm:w-40"
                >
                  <option value="weight">Max Weight</option>
                  <option value="volume">Volume</option>
                </select>
              </div>
            </div>

            {exerciseWorkouts.length > 0 && (
              <button
                onClick={exportData}
                className="btn-outline flex items-center space-x-2"
              >
                <Download className="h-4 w-4" />
                <span>Export Data</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Chart Section */}
      {selectedExercise && exerciseWorkouts.length > 0 ? (
        <div className="card">
          <div className="card-body p-6">
            <div className="h-96">
              <Line data={chartData} options={chartOptions} />
            </div>
          </div>
        </div>
      ) : selectedExercise ? (
        <div className="card">
          <div className="card-body text-center py-12">
            <BarChart3 className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No data for {selectedExercise}
            </h3>
            <p className="text-gray-600">
              Log more workouts for this exercise to see progress trends.
            </p>
          </div>
        </div>
      ) : null}

      {/* Stats Cards */}
      {selectedExercise && exerciseWorkouts.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="card">
            <div className="card-body text-center">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Activity className="h-6 w-6 text-primary-600" />
              </div>
              <p className="text-sm font-medium text-gray-600 mb-1">
                Total Sessions
              </p>
              <p className="text-2xl font-bold text-primary-600">
                {exerciseWorkouts.length}
              </p>
            </div>
          </div>

          <div className="card">
            <div className="card-body text-center">
              <div className="w-12 h-12 bg-secondary-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <TrendingUp className="h-6 w-6 text-secondary-600" />
              </div>
              <p className="text-sm font-medium text-gray-600 mb-1">
                Max Weight
              </p>
              <p className="text-2xl font-bold text-secondary-600">
                {maxWeightForExercise} {weightUnit}
              </p>
            </div>
          </div>

          <div className="card">
            <div className="card-body text-center">
              <div className="w-12 h-12 bg-accent-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <BarChart3 className="h-6 w-6 text-accent-600" />
              </div>
              <p className="text-sm font-medium text-gray-600 mb-1">
                Total Volume
              </p>
              <p className="text-2xl font-bold text-accent-600">
                {totalVolumeForExercise.toLocaleString()} {weightUnit}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProgressChart;
