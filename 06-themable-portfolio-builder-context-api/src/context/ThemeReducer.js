// Initial theme state
export const initialThemeState = {
  isDarkMode: false,
  colors: {
    primary: "blue", // Tailwind color name
  },
  typography: {
    headingSize: "text-4xl",
    bodySize: "text-lg",
  },
  spacing: {
    padding: "p-8",
  },
};

// Theme reducer function
export const themeReducer = (state, action) => {
  switch (action.type) {
    case "TOGGLE_DARK_MODE":
      return {
        ...state,
        isDarkMode: !state.isDarkMode,
      };

    case "SET_PRIMARY_COLOR":
      return {
        ...state,
        colors: {
          ...state.colors,
          primary: action.payload,
        },
      };

    case "SET_HEADING_SIZE":
      return {
        ...state,
        typography: {
          ...state.typography,
          headingSize: action.payload,
        },
      };

    case "SET_BODY_SIZE":
      return {
        ...state,
        typography: {
          ...state.typography,
          bodySize: action.payload,
        },
      };

    case "SET_SPACING":
      return {
        ...state,
        spacing: {
          padding: action.payload,
        },
      };

    case "RESET_THEME":
      return initialThemeState;

    default:
      return state;
  }
};
