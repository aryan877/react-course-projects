import { Code2, ExternalLink, Github } from "lucide-react";
import { useTheme } from "../../hooks/useTheme";
import Button from "../ui/Button";
import Card from "../ui/Card";
import Section from "../ui/Section";

const Projects = () => {
  const { isDarkMode, typography } = useTheme();

  const textColor = isDarkMode ? "text-gray-200" : "text-gray-800";
  const titleColor = isDarkMode ? "text-white" : "text-gray-900";

  const projects = [
    {
      id: 1,
      title: "E-Commerce Platform",
      description:
        "A full-featured e-commerce platform built with React, Node.js, and MongoDB. Features include user authentication, payment processing, and admin dashboard.",
      image:
        "https://images.pexels.com/photos/230544/pexels-photo-230544.jpeg?auto=compress&cs=tinysrgb&w=800",
      technologies: ["React", "Node.js", "MongoDB", "Stripe"],
      liveUrl: "#",
      githubUrl: "#",
    },
    {
      id: 2,
      title: "Task Management App",
      description:
        "A collaborative task management application with real-time updates, drag-and-drop functionality, and team collaboration features.",
      image:
        "https://images.pexels.com/photos/3183153/pexels-photo-3183153.jpeg?auto=compress&cs=tinysrgb&w=800",
      technologies: ["Vue.js", "Firebase", "Vuex", "CSS3"],
      liveUrl: "#",
      githubUrl: "#",
    },
    {
      id: 3,
      title: "Weather Dashboard",
      description:
        "A responsive weather dashboard that provides detailed weather information with beautiful data visualizations and location-based forecasts.",
      image:
        "https://images.pexels.com/photos/1118873/pexels-photo-1118873.jpeg?auto=compress&cs=tinysrgb&w=800",
      technologies: ["JavaScript", "Chart.js", "Weather API", "CSS3"],
      liveUrl: "#",
      githubUrl: "#",
    },
  ];

  return (
    <Section id="projects" title="Featured Projects">
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects.map((project) => (
          <Card key={project.id} className="group">
            {/* Project Image */}
            <div className="relative overflow-hidden rounded-lg mb-6">
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black bg-opacity-60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <div className="flex gap-3">
                  <Button size="sm" variant="primary">
                    <ExternalLink size={16} />
                  </Button>
                  <Button size="sm" variant="outline">
                    <Github size={16} />
                  </Button>
                </div>
              </div>
            </div>

            {/* Project Content */}
            <div>
              <h3 className={`text-xl font-bold mb-3 ${titleColor}`}>
                {project.title}
              </h3>
              <p
                className={`${typography.bodySize} ${textColor} mb-4 leading-relaxed font-semibold`}
              >
                {project.description}
              </p>

              {/* Technologies */}
              <div className="flex flex-wrap gap-2 mb-6">
                {project.technologies.map((tech) => (
                  <span
                    key={tech}
                    className={`px-3 py-1 text-sm rounded-full font-semibold border shadow-sm ${
                      isDarkMode
                        ? "bg-blue-900/40 text-blue-200 border-blue-700"
                        : "bg-blue-600 text-white border-blue-700"
                    }`}
                  >
                    {tech}
                  </span>
                ))}
              </div>

              {/* Project Links */}
              <div className="flex gap-3">
                <Button
                  size="sm"
                  variant="primary"
                  className="flex items-center gap-2"
                >
                  <ExternalLink size={14} />
                  Live Demo
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <Github size={14} />
                  Code
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* View More Projects */}
      <div className="text-center mt-12">
        <Button variant="primary" className="flex items-center gap-2 mx-auto">
          <Code2 size={16} />
          View All Projects
        </Button>
      </div>
    </Section>
  );
};

export default Projects;
