import React from 'react';
import { ExternalLink, Code } from 'lucide-react';
import { motion } from 'framer-motion';
import { fadeInUp } from '../utils/animations';

const ProjectCard = ({ project, onClick }) => {
  return (
    <motion.div
      variants={fadeInUp}
      whileHover={{ y: -10 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-2xl"
      onClick={() => onClick && onClick(project)}
    >
      {/* Project Image */}
      <div className="relative h-48 overflow-hidden">
        {project.image_url ? (
          <img
            src={project.image_url}
            alt={project.title}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary-400 to-purple-600 flex items-center justify-center">
            <Code size={64} className="text-white opacity-50" />
          </div>
        )}

        {project.featured && (
          <div className="absolute top-4 right-4 px-3 py-1 bg-yellow-400 text-yellow-900 text-xs font-bold rounded-full">
            FEATURED
          </div>
        )}
      </div>

      {/* Project Info */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          {project.title}
        </h3>

        <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
          {project.description}
        </p>

        {/* Tech Stack */}
        <div className="flex flex-wrap gap-2 mb-4">
          {project.tech_stack?.slice(0, 3).map((tech, index) => (
            <span
              key={index}
              className="px-3 py-1 text-xs font-medium bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full"
            >
              {tech}
            </span>
          ))}

          {project.tech_stack?.length > 3 && (
            <span className="px-3 py-1 text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full">
              +{project.tech_stack.length - 3} more
            </span>
          )}
        </div>

        {/* Action Links */}
        <div className="flex items-center space-x-4">
          {project.demo_url && (
            <a
              href={project.demo_url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex items-center space-x-1 text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
            >
              <ExternalLink size={16} />
              <span className="text-sm font-medium">Live Demo</span>
            </a>
          )}

          {project.code_url && (
            <a
              href={project.code_url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex items-center space-x-1 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
            >
              <Code size={16} />
              <span className="text-sm font-medium">Source Code</span>
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ProjectCard;
