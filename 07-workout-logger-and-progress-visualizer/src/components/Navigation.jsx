import { Dumbbell, Menu, Scale, TrendingUp, X } from "lucide-react";
import { useState } from "react";
import { NavLink, useLocation } from "react-router";
import useWorkoutStore from "../store/workoutStore";

const Navigation = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { weightUnit, setWeightUnit } = useWorkoutStore();
  const location = useLocation();

  const navItems = [
    { path: "/log", label: "Log Workout", icon: Dumbbell },
    { path: "/progress", label: "Progress", icon: TrendingUp },
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleWeightUnit = () => {
    const newUnit = weightUnit === "lbs" ? "kg" : "lbs";
    setWeightUnit(newUnit);
  };

  const isActiveRoute = (path) => {
    if (path === "/log") {
      return location.pathname === "/" || location.pathname === "/log";
    }
    return location.pathname === path;
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <NavLink to="/" className="flex items-center space-x-2">
            <Dumbbell className="h-8 w-8 text-primary-600" />
            <span className="text-xl font-bold text-gradient">FitTrackerz</span>
          </NavLink>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <div className="flex space-x-8">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) => `
                      flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200
                      ${
                        isActive || isActiveRoute(item.path)
                          ? "bg-primary-100 text-primary-700 shadow-sm"
                          : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                      }
                    `}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </NavLink>
                );
              })}
            </div>

            {/* Weight Unit Toggle */}
            <button
              onClick={toggleWeightUnit}
              className="flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-all duration-200 border border-gray-200"
              title={`Switch to ${weightUnit === "lbs" ? "kg" : "lbs"}`}
            >
              <Scale className="h-4 w-4" />
              <span className="font-semibold">{weightUnit}</span>
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors duration-200"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4 animate-fade-in">
            <div className="space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={({ isActive }) => `
                      flex items-center space-x-3 w-full px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200
                      ${
                        isActive || isActiveRoute(item.path)
                          ? "bg-primary-100 text-primary-700 shadow-sm"
                          : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                      }
                    `}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </NavLink>
                );
              })}

              {/* Mobile Weight Unit Toggle */}
              <button
                onClick={() => {
                  toggleWeightUnit();
                  setIsMobileMenuOpen(false);
                }}
                className="flex items-center space-x-3 w-full px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-all duration-200 border border-gray-200"
              >
                <Scale className="h-4 w-4" />
                <span>
                  Weight Unit:{" "}
                  <span className="font-semibold">{weightUnit}</span>
                </span>
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
