import React from 'react';
import { Code, Palette, Database, Globe, Smartphone, Zap } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import Section from '../ui/Section';
import Card from '../ui/Card';

const Skills = () => {
  const { isDarkMode, typography } = useTheme();

  const textColor = isDarkMode ? 'text-gray-200' : 'text-gray-800';
  const titleColor = isDarkMode ? 'text-white' : 'text-gray-900';

  const skillCategories = [
    {
      icon: Code,
      title: 'Frontend Development',
      skills: ['React', 'Vue.js', 'TypeScript', 'JavaScript', 'HTML5', 'CSS3'],
      color: 'text-blue-600'
    },
    {
      icon: Database,
      title: 'Backend Development',
      skills: ['Node.js', 'Python', 'MongoDB', 'PostgreSQL', 'Express.js', 'FastAPI'],
      color: 'text-green-600'
    },
    {
      icon: Smartphone,
      title: 'Mobile Development',
      skills: ['React Native', 'Flutter', 'iOS', 'Android', 'Expo', 'Firebase'],
      color: 'text-purple-600'
    },
    {
      icon: Palette,
      title: 'Design & UI/UX',
      skills: ['Figma', 'Adobe XD', 'Photoshop', 'Tailwind CSS', 'Bootstrap', 'Material-UI'],
      color: 'text-pink-600'
    },
    {
      icon: Globe,
      title: 'DevOps & Cloud',
      skills: ['AWS', 'Docker', 'Kubernetes', 'CI/CD', 'Nginx', 'Linux'],
      color: 'text-orange-600'
    },
    {
      icon: Zap,
      title: 'Tools & Others',
      skills: ['Git', 'Webpack', 'Jest', 'Cypress', 'Jira', 'Agile'],
      color: 'text-yellow-600'
    }
  ];

  return (
    <Section id="skills" title="Skills & Expertise">
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {skillCategories.map((category, index) => (
          <Card key={index} className="text-center">
            <div className="flex justify-center mb-4">
              <div className={`p-4 rounded-full bg-gray-100 dark:bg-gray-700 ${category.color}`}>
                <category.icon size={32} />
              </div>
            </div>
            
            <h3 className={`text-xl font-bold mb-4 ${titleColor}`}>
              {category.title}
            </h3>
            
            <div className="flex flex-wrap gap-2 justify-center">
              {category.skills.map((skill) => (
                <span
                  key={skill}
                  className={`px-3 py-1 text-sm rounded-full border transition-colors duration-200 hover:scale-105 font-semibold ${
                    isDarkMode
                      ? 'border-gray-500 text-gray-200 hover:border-gray-400 bg-gray-800/50'
                      : 'border-gray-500 text-gray-800 hover:border-gray-600 bg-gray-50'
                  }`}
                >
                  {skill}
                </span>
              ))}
            </div>
          </Card>
        ))}
      </div>

      {/* Additional Info */}
      <div className="mt-16 text-center">
        <Card className="max-w-4xl mx-auto">
          <h3 className={`text-2xl font-bold mb-4 ${titleColor}`}>
            Always Learning
          </h3>
          <p className={`${typography.bodySize} ${textColor} leading-relaxed font-semibold`}>
            Technology is constantly evolving, and I'm passionate about staying up-to-date with the latest 
            trends and best practices. I regularly explore new frameworks, attend conferences, and contribute 
            to open-source projects to continuously improve my skills and knowledge.
          </p>
        </Card>
      </div>
    </Section>
  );
};

export default Skills;