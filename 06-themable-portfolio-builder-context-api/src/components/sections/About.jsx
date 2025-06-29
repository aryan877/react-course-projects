import React from 'react';
import { User, Download } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import Section from '../ui/Section';
import Card from '../ui/Card';
import Button from '../ui/Button';

const About = () => {
  const { isDarkMode, typography, colors } = useTheme();

  const textColor = isDarkMode ? 'text-gray-200' : 'text-gray-800';
  const highlightColor = isDarkMode ? 'text-blue-300' : 'text-blue-800';

  return (
    <Section id="about" title="About Me">
      <div className="grid md:grid-cols-2 gap-12 items-center">
        {/* Profile Image */}
        <div className="flex justify-center">
          <div className="relative">
            <div className="w-80 h-80 rounded-full overflow-hidden border-4 border-gray-200 dark:border-gray-600 shadow-xl">
              <img
                src="https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-4 -right-4 bg-blue-600 text-white p-4 rounded-full shadow-lg">
              <User size={24} />
            </div>
          </div>
        </div>

        {/* About Content */}
        <div>
          <Card>
            <h3 className={`${typography.headingSize} font-bold mb-6 ${highlightColor}`}>
              Hello, I'm John Doe
            </h3>
            <p className={`${typography.bodySize} ${textColor} mb-6 leading-relaxed font-semibold`}>
              I'm a passionate full-stack developer with over 5 years of experience creating 
              beautiful and functional web applications. I specialize in React, Node.js, and 
              modern web technologies.
            </p>
            <p className={`${typography.bodySize} ${textColor} mb-6 leading-relaxed font-semibold`}>
              When I'm not coding, you can find me exploring new technologies, contributing to 
              open-source projects, or sharing my knowledge through technical writing and mentoring.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <Button variant="primary" className="flex items-center gap-2">
                <Download size={16} />
                Download Resume
              </Button>
              <Button variant="outline">
                Contact Me
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </Section>
  );
};

export default About;