import { ChevronDown, Sparkles } from "lucide-react";
import React from "react";
import { useTheme } from "../../context/ThemeContext";
import Button from "../ui/Button";

const Hero = () => {
  const { isDarkMode, typography, colors } = useTheme();

  const backgroundGradient = isDarkMode
    ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"
    : "bg-gradient-to-br from-blue-50 via-white to-purple-50";

  const textColor = isDarkMode ? "text-white" : "text-gray-900";
  const subtitleColor = isDarkMode ? "text-gray-200" : "text-gray-800";

  const scrollToAbout = () => {
    document.getElementById("about")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      className={`min-h-screen flex items-center justify-center ${backgroundGradient} relative overflow-hidden`}
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        {/* Greeting Badge */}
        <div
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold mb-8 animate-bounce border shadow-lg ${
            isDarkMode
              ? "bg-blue-900/40 text-blue-200 border-blue-700"
              : "bg-blue-600 text-white border-blue-700"
          }`}
        >
          <Sparkles size={16} />
          Welcome to my portfolio
        </div>

        {/* Main Heading */}
        <h1
          className={`${typography.headingSize} md:text-6xl font-bold ${textColor} mb-6 leading-tight`}
        >
          Hi, I'm{" "}
          <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            John Doe
          </span>
        </h1>

        {/* Subtitle */}
        <p
          className={`${typography.bodySize} md:text-xl ${subtitleColor} mb-8 max-w-3xl mx-auto leading-relaxed font-semibold`}
        >
          A passionate full-stack developer crafting beautiful, functional, and
          user-centered digital experiences. I bring ideas to life through clean
          code and innovative solutions.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
          <Button variant="primary" size="lg" onClick={scrollToAbout}>
            View My Work
          </Button>
          <Button variant="outline" size="lg">
            Download Resume
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
          {[
            { number: "50+", label: "Projects Completed" },
            { number: "5+", label: "Years Experience" },
            { number: "30+", label: "Happy Clients" },
            { number: "15+", label: "Technologies" },
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <div
                className={`text-2xl md:text-3xl font-bold ${textColor} mb-2`}
              >
                {stat.number}
              </div>
              <div className={`text-sm ${subtitleColor} font-semibold`}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Scroll Indicator */}
        <button
          onClick={scrollToAbout}
          className={`${textColor} hover:text-blue-500 transition-colors animate-bounce`}
        >
          <ChevronDown size={24} />
        </button>
      </div>
    </section>
  );
};

export default Hero;
