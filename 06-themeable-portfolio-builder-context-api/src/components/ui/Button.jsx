import { useTheme } from "../../hooks/useTheme";

const Button = ({
  children,
  variant = "primary",
  size = "md",
  onClick,
  className = "",
  ...props
}) => {
  const { colors, isDarkMode } = useTheme();

  // Base styles
  const baseStyles =
    "font-bold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2";

  // Size variants
  const sizeStyles = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  };

  // Color variants
  const getVariantStyles = () => {
    const colorMap = {
      blue: "bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500",
      purple:
        "bg-purple-600 hover:bg-purple-700 text-white focus:ring-purple-500",
      green: "bg-green-600 hover:bg-green-700 text-white focus:ring-green-500",
      red: "bg-red-600 hover:bg-red-700 text-white focus:ring-red-500",
      gray: "bg-gray-600 hover:bg-gray-700 text-white focus:ring-gray-500",
    };

    if (variant === "primary") {
      return colorMap[colors.primary] || colorMap.blue;
    } else if (variant === "outline") {
      const outlineMap = {
        blue: `border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white focus:ring-blue-500 ${
          isDarkMode ? "hover:border-blue-600" : ""
        }`,
        purple: `border-2 border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white focus:ring-purple-500 ${
          isDarkMode ? "hover:border-purple-600" : ""
        }`,
        green: `border-2 border-green-600 text-green-600 hover:bg-green-600 hover:text-white focus:ring-green-500 ${
          isDarkMode ? "hover:border-green-600" : ""
        }`,
        red: `border-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white focus:ring-red-500 ${
          isDarkMode ? "hover:border-red-600" : ""
        }`,
        gray: `border-2 border-gray-600 text-gray-600 hover:bg-gray-600 hover:text-white focus:ring-gray-500 ${
          isDarkMode ? "hover:border-gray-600" : ""
        }`,
      };
      return outlineMap[colors.primary] || outlineMap.blue;
    }
  };

  const finalClassName = `${baseStyles} ${
    sizeStyles[size]
  } ${getVariantStyles()} ${className}`;

  return (
    <button className={finalClassName} onClick={onClick} {...props}>
      {children}
    </button>
  );
};

export default Button;
