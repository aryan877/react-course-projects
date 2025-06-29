import React from 'react';
import { X, Moon, Sun, Palette, Type, Layout } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import Button from './ui/Button';
import Card from './ui/Card';

const ThemeSettings = ({ isOpen, onClose }) => {
  const {
    isDarkMode,
    colors,
    typography,
    spacing,
    toggleDarkMode,
    setPrimaryColor,
    setHeadingSize,
    setBodySize,
    setSpacing,
    resetTheme
  } = useTheme();

  if (!isOpen) return null;

  const colorOptions = [
    { name: 'Blue', value: 'blue', class: 'bg-blue-600' },
    { name: 'Purple', value: 'purple', class: 'bg-purple-600' },
    { name: 'Green', value: 'green', class: 'bg-green-600' },
    { name: 'Red', value: 'red', class: 'bg-red-600' },
    { name: 'Gray', value: 'gray', class: 'bg-gray-600' }
  ];

  const fontSizeOptions = {
    heading: [
      { name: 'Small', value: 'text-2xl' },
      { name: 'Medium', value: 'text-3xl' },
      { name: 'Large', value: 'text-4xl' },
      { name: 'X-Large', value: 'text-5xl' }
    ],
    body: [
      { name: 'Small', value: 'text-sm' },
      { name: 'Medium', value: 'text-base' },
      { name: 'Large', value: 'text-lg' },
      { name: 'X-Large', value: 'text-xl' }
    ]
  };

  const spacingOptions = [
    { name: 'Compact', value: 'p-4' },
    { name: 'Normal', value: 'p-6' },
    { name: 'Relaxed', value: 'p-8' },
    { name: 'Spacious', value: 'p-12' }
  ];

  const overlayStyles = 'fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4';
  const panelStyles = `max-w-md w-full max-h-[90vh] overflow-y-auto ${isDarkMode ? 'bg-gray-900 border border-gray-700' : 'bg-white border border-gray-200'} rounded-xl shadow-2xl`;

  const textColor = isDarkMode ? 'text-white' : 'text-gray-900';
  const labelColor = isDarkMode ? 'text-gray-200' : 'text-gray-800';
  const iconColor = isDarkMode ? 'text-gray-300' : 'text-gray-700';

  return (
    <div className={overlayStyles} onClick={onClose}>
      <div className={panelStyles} onClick={e => e.stopPropagation()}>
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className={`text-2xl font-bold ${textColor}`}>
              Theme Settings
            </h2>
            <button
              onClick={onClose}
              className={`p-2 rounded-lg ${isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}
            >
              <X size={24} />
            </button>
          </div>

          <div className="space-y-6">
            {/* Dark Mode Toggle */}
            <div>
              <div className={`flex items-center gap-2 mb-3 ${iconColor}`}>
                {isDarkMode ? <Moon size={20} /> : <Sun size={20} />}
                <h3 className={`font-bold ${textColor}`}>
                  Appearance
                </h3>
              </div>
              <Button
                onClick={toggleDarkMode}
                variant="outline"
                className="w-full flex items-center justify-center gap-2"
              >
                {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
                {isDarkMode ? 'Light Mode' : 'Dark Mode'}
              </Button>
            </div>

            {/* Colors */}
            <div>
              <div className={`flex items-center gap-2 mb-3 ${iconColor}`}>
                <Palette size={20} />
                <h3 className={`font-bold ${textColor}`}>
                  Primary Color
                </h3>
              </div>
              
              <div className="flex gap-2">
                {colorOptions.map((color) => (
                  <button
                    key={color.value}
                    onClick={() => setPrimaryColor(color.value)}
                    className={`w-8 h-8 rounded-full ${color.class} border-2 ${
                      colors.primary === color.value ? 'border-white shadow-lg' : 'border-transparent'
                    } transition-all`}
                    title={color.name}
                  />
                ))}
              </div>
            </div>

            {/* Typography */}
            <div>
              <div className={`flex items-center gap-2 mb-3 ${iconColor}`}>
                <Type size={20} />
                <h3 className={`font-bold ${textColor}`}>
                  Typography
                </h3>
              </div>
              
              <div className="mb-4">
                <label className={`block text-sm font-bold mb-2 ${labelColor}`}>
                  Heading Size
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {fontSizeOptions.heading.map((size) => (
                    <button
                      key={size.value}
                      onClick={() => setHeadingSize(size.value)}
                      className={`p-2 text-sm rounded-lg border font-medium ${
                        typography.headingSize === size.value
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                          : `border-gray-400 dark:border-gray-500 ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`
                      } transition-all`}
                    >
                      {size.name}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className={`block text-sm font-bold mb-2 ${labelColor}`}>
                  Body Text Size
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {fontSizeOptions.body.map((size) => (
                    <button
                      key={size.value}
                      onClick={() => setBodySize(size.value)}
                      className={`p-2 text-sm rounded-lg border font-medium ${
                        typography.bodySize === size.value
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                          : `border-gray-400 dark:border-gray-500 ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`
                      } transition-all`}
                    >
                      {size.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Spacing */}
            <div>
              <div className={`flex items-center gap-2 mb-3 ${iconColor}`}>
                <Layout size={20} />
                <h3 className={`font-bold ${textColor}`}>
                  Spacing
                </h3>
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                {spacingOptions.map((space) => (
                  <button
                    key={space.value}
                    onClick={() => setSpacing(space.value)}
                    className={`p-2 text-sm rounded-lg border font-medium ${
                      spacing.padding === space.value
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                        : `border-gray-400 dark:border-gray-500 ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`
                    } transition-all`}
                  >
                    {space.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Reset Button */}
            <div className={`pt-4 border-t ${isDarkMode ? 'border-gray-600' : 'border-gray-300'}`}>
              <Button
                onClick={resetTheme}
                variant="outline"
                className="w-full"
              >
                Reset to Default
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThemeSettings;