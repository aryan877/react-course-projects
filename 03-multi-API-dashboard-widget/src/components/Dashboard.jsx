import CryptoWidget from "@/components/widgets/CryptoWidget";
import FactWidget from "@/components/widgets/FactWidget";
import WeatherWidget from "@/components/widgets/WeatherWidget";
import { useEffect, useState } from "react";

const Dashboard = () => {
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    // Load theme from localStorage
    const savedTheme = localStorage.getItem("dashboardTheme") || "light";
    setTheme(savedTheme);
    document.documentElement.classList.toggle("dark", savedTheme === "dark");

    // Update timestamp every minute
    const interval = setInterval(() => {
      setLastUpdated(new Date());
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("dashboardTheme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 glass border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-4">
            <div className="text-center lg:text-left">
              <h1 className="text-2xl lg:text-3xl font-bold gradient-text mb-1">
                Personal Dashboard
              </h1>
              <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-sm text-foreground/60">
                <span className="font-medium text-lg text-foreground">
                  {formatTime(lastUpdated)}
                </span>
                <span className="hidden sm:block">•</span>
                <span>{formatDate(lastUpdated)}</span>
              </div>
            </div>
            <button
              className="p-3 rounded-xl glass hover:bg-white/70 dark:hover:bg-slate-700/70 border border-border/50 transition-all duration-200 hover:scale-105"
              onClick={toggleTheme}
              title={`Switch to ${theme === "light" ? "dark" : "light"} theme`}
            >
              <span className="text-xl">{theme === "light" ? "🌙" : "☀️"}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 auto-rows-fr">
          <div className="lg:col-span-1">
            <WeatherWidget />
          </div>
          <div className="lg:col-span-1">
            <CryptoWidget />
          </div>
          <div className="lg:col-span-2 xl:col-span-1">
            <FactWidget />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="glass border-t border-border/50 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-foreground/60">
            Last updated: {formatTime(lastUpdated)} •
            <span className="text-foreground/50">
              {" "}
              Auto-refresh every 5 minutes
            </span>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;
