import { ThemeContext } from "@/context/ThemeContext";
import { useContext } from "react";

// Custom hook to use the Theme Context
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
