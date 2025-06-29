import { createContext, useReducer } from "react";
import { initialThemeState, themeReducer } from "./ThemeReducer";

// Create the Theme Context
export const ThemeContext = createContext();

// Theme Provider Component
export const ThemeProvider = ({ children }) => {
  const [state, dispatch] = useReducer(themeReducer, initialThemeState);

  // Action creators for easier dispatch
  const actions = {
    toggleDarkMode: () => dispatch({ type: "TOGGLE_DARK_MODE" }),
    setPrimaryColor: (color) =>
      dispatch({ type: "SET_PRIMARY_COLOR", payload: color }),
    setHeadingSize: (size) =>
      dispatch({ type: "SET_HEADING_SIZE", payload: size }),
    setBodySize: (size) => dispatch({ type: "SET_BODY_SIZE", payload: size }),
    setSpacing: (spacing) =>
      dispatch({ type: "SET_SPACING", payload: spacing }),
    resetTheme: () => dispatch({ type: "RESET_THEME" }),
  };

  const value = {
    ...state,
    ...actions,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};
