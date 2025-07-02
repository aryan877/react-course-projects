import { useTheme } from "@/hooks/useTheme";

const Card = ({ children, className = "", hover = true, ...props }) => {
  const { isDarkMode, spacing } = useTheme();

  const baseStyles = `rounded-xl shadow-lg transition-all duration-300 ${spacing.padding}`;
  const backgroundStyles = isDarkMode
    ? "bg-gray-800 border border-gray-600"
    : "bg-white border border-gray-200";
  const hoverStyles = hover
    ? "hover:shadow-xl hover:transform hover:-translate-y-1"
    : "";

  const finalClassName = `${baseStyles} ${backgroundStyles} ${hoverStyles} ${className}`;

  return (
    <div className={finalClassName} {...props}>
      {children}
    </div>
  );
};

export default Card;
