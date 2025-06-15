import { useState } from "react";
import ErrorBoundary from "./ErrorBoundary";

const Widget = ({
  title,
  children,
  onRefresh,
  isLoading = false,
  error = null,
  className = "",
  minimizable = true,
  colorScheme = "blue",
}) => {
  const [isMinimized, setIsMinimized] = useState(false);

  const handleRefresh = () => {
    if (onRefresh && !isLoading) {
      onRefresh();
    }
  };

  const toggleMinimize = () => {
    if (minimizable) {
      setIsMinimized(!isMinimized);
    }
  };

  const getColorScheme = () => {
    const schemes = {
      blue: "border-t-blue-500",
      emerald: "border-t-emerald-500",
      amber: "border-t-amber-500",
      purple: "border-t-purple-500",
    };
    return schemes[colorScheme] || schemes.blue;
  };

  return (
    <ErrorBoundary>
      <div
        className={`
        card
        ${getColorScheme()} border-t-4
        shadow-lg hover:shadow-xl
        transition-all duration-300 ease-out
        hover:-translate-y-1
        ${isMinimized ? "hover:translate-y-0 hover:shadow-lg" : ""}
        ${className}
      `}
      >
        <div className="p-6 pb-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-foreground">{title}</h3>
            <div className="flex gap-2">
              {onRefresh && (
                <button
                  className={`
                    p-2 rounded-lg text-foreground/60 hover:text-foreground
                    hover:bg-foreground/10
                    transition-all duration-200
                    ${isLoading ? "animate-spin" : ""}
                  `}
                  onClick={handleRefresh}
                  disabled={isLoading}
                  title="Refresh data"
                >
                  🔄
                </button>
              )}
              {minimizable && (
                <button
                  className="p-2 rounded-lg text-foreground/60 hover:text-foreground hover:bg-foreground/10 transition-all duration-200"
                  onClick={toggleMinimize}
                  title={isMinimized ? "Expand" : "Minimize"}
                >
                  {isMinimized ? "📈" : "📉"}
                </button>
              )}
            </div>
          </div>

          {!isMinimized && (
            <div className="min-h-[200px]">
              {error ? (
                <div className="flex flex-col items-center justify-center py-8 text-center space-y-4">
                  <div className="text-2xl">❌</div>
                  <p className="text-foreground/60">
                    {error.message || "Something went wrong"}
                  </p>
                  <button
                    className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
                    onClick={handleRefresh}
                  >
                    Retry
                  </button>
                </div>
              ) : (
                children
              )}
            </div>
          )}
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default Widget;
