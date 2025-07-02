import Button from "@/components/ui/Button";
import { useTheme } from "@/hooks/useTheme";
import { Menu, Settings, X } from "lucide-react";
import { useState } from "react";

const Navigation = ({ onToggleSettings }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { isDarkMode } = useTheme();

  const backgroundStyles = isDarkMode
    ? "bg-gray-900/95 backdrop-blur-md border-gray-700"
    : "bg-white/95 backdrop-blur-md border-gray-200";

  const textColor = isDarkMode ? "text-white" : "text-gray-900";
  const linkHover = isDarkMode ? "hover:text-blue-300" : "hover:text-blue-600";
  const borderColor = isDarkMode ? "border-gray-600" : "border-gray-200";

  const navLinks = [
    { href: "#about", label: "About" },
    { href: "#projects", label: "Projects" },
    { href: "#skills", label: "Skills" },
    { href: "#contact", label: "Contact" },
  ];

  const scrollToSection = (href) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setIsOpen(false);
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 border-b ${backgroundStyles}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div
            className={`text-xl font-bold ${textColor} hover:text-blue-600 ${
              isDarkMode ? "hover:text-blue-300" : "hover:text-blue-600"
            } transition-colors cursor-pointer`}
          >
            Portfolio
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => scrollToSection(link.href)}
                className={`${textColor} ${linkHover} transition-colors duration-200 font-semibold px-3 py-2 rounded-lg hover:bg-gray-100/50 ${
                  isDarkMode ? "hover:bg-gray-700/50" : "hover:bg-gray-100/50"
                }`}
              >
                {link.label}
              </button>
            ))}

            <Button
              variant="outline"
              size="sm"
              onClick={onToggleSettings}
              className="flex items-center gap-2"
            >
              <Settings size={16} />
              Theme
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={onToggleSettings}>
              <Settings size={16} />
            </Button>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`${textColor} p-2`}
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden">
            <div
              className={`px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t ${borderColor}`}
            >
              {navLinks.map((link) => (
                <button
                  key={link.href}
                  onClick={() => scrollToSection(link.href)}
                  className={`block w-full text-left px-3 py-2 rounded-lg ${textColor} ${linkHover} transition-colors duration-200 font-semibold hover:bg-gray-100/50 ${
                    isDarkMode ? "hover:bg-gray-700/50" : "hover:bg-gray-100/50"
                  }`}
                >
                  {link.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
