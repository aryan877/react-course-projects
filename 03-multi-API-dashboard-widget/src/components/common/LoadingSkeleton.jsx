import { Loader2 } from "lucide-react";

const LoadingSkeleton = ({ type = "default" }) => {
  const getMessage = () => {
    switch (type) {
      case "weather":
        return "Loading weather data...";
      case "crypto":
        return "Loading crypto prices...";
      case "fact":
        return "Loading daily fact...";
      default:
        return "Loading...";
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-12 space-y-4">
      <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      <p className="text-foreground/60 text-sm font-medium animate-pulse">
        {getMessage()}
      </p>
    </div>
  );
};

export default LoadingSkeleton;
