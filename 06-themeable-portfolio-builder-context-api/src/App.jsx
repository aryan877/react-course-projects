import Navigation from "@/components/Navigation";
import ThemeSettings from "@/components/ThemeSettings";
import About from "@/components/sections/About";
import Contact from "@/components/sections/Contact";
import Hero from "@/components/sections/Hero";
import Projects from "@/components/sections/Projects";
import Skills from "@/components/sections/Skills";
import { ThemeProvider } from "@/context/ThemeContext";
import { useTheme } from "@/hooks/useTheme";
import { useState } from "react";

// Main App Content Component
const AppContent = () => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const { isDarkMode } = useTheme();

  const backgroundClass = isDarkMode
    ? "bg-gray-900 text-white"
    : "bg-white text-gray-900";

  return (
    <div
      className={`min-h-screen ${backgroundClass} transition-colors duration-300`}
    >
      <Navigation onToggleSettings={() => setIsSettingsOpen(true)} />

      <main>
        <Hero />
        <About />
        <Projects />
        <Skills />
        <Contact />
      </main>

      <ThemeSettings
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />

      {/* Footer */}
      <footer
        className={`py-8 px-4 text-center border-t ${
          isDarkMode
            ? "border-gray-800 bg-gray-900"
            : "border-gray-200 bg-gray-50"
        }`}
      >
        <p className={isDarkMode ? "text-gray-400" : "text-gray-600"}>
          © 2024 John Doe. Built with React and love.
        </p>
      </footer>
    </div>
  );
};

// Main App Component with Theme Provider
function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;
