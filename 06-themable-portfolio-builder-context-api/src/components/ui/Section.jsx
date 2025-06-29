import React from 'react';
import { useTheme } from '../../context/ThemeContext';

const Section = ({ children, className = '', id = '', title = '' }) => {
  const { isDarkMode, spacing, typography } = useTheme();

  const textColor = isDarkMode ? 'text-white' : 'text-gray-900';
  const sectionPadding = 'py-16 px-4 sm:px-6 lg:px-8';

  return (
    <section id={id} className={`${sectionPadding} ${className}`}>
      <div className="max-w-7xl mx-auto">
        {title && (
          <h2 className={`${typography.headingSize} font-bold text-center mb-12 ${textColor}`}>
            {title}
          </h2>
        )}
        {children}
      </div>
    </section>
  );
};

export default Section;