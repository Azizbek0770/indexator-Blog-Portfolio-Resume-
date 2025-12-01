import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useApi } from '../hooks/useApi';
import { useScrollAnimation } from '../hooks/useAnimation';
import ProjectCard from '../components/ProjectCard';
import Modal from '../components/Modal';
import { ExternalLink, Code } from 'lucide-react';
import { fadeInUp, staggerContainer } from '../utils/animations';

const Portfolio = () => {
  const { data: projects } = useApi('/projects');
  const { ref, inView } = useScrollAnimation();
  const [selectedProject, setSelectedProject] = useState(null);
  const [filter, setFilter] = useState('all');

  const categories = [
    'all',
    'featured',
    ...new Set(projects?.map(p => p.tech_stack?.[0]).filter(Boolean) || [])
  ];

  const filteredProjects =
    projects?.filter(project => {
      if (filter === 'all') return true;
      if (filter === 'featured') return project.featured;
      return project.tech_stack?.includes(filter);
    }) || [];

  return (
    <section id="portfolio" className="py-24 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          variants={staggerContainer}
        >
          {/* SECTION HEADER */}
          <motion.div variants={fadeInUp} className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              My <span className="gradient-text">Portfolio</span>
            </h2>

            <div className="w-28 h-1 bg-gradient-to-r from-primary-500 to-purple-600 mx-auto rounded-full mb-8" />

            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Carefully crafted projects built with modern technologies
            </p>
          </motion.div>

          {/* FILTER BUTTONS */}
          <motion.div
            variants={fadeInUp}
            className="flex flex-wrap justify-center gap-3 mb-14"
          >
            {categories.slice(0, 6).map(category => (
              <button
                key={category}
                onClick={() => setFilter(category)}
                className={`
                  px-6 py-2 rounded-full font-medium backdrop-blur-md border transition-all
                  ${
                    filter === category
                      ? 'bg-primary-600 text-white shadow-lg border-primary-700'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 border-gray-300/30 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }
                `}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </motion.div>

          {/* PROJECT GRID */}
          <motion.div
            variants={staggerContainer}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10"
          >
            {filteredProjects.map(project => (
              <ProjectCard key={project.id} project={project} onClick={setSelectedProject} />
            ))}
          </motion.div>

          {/* NO RESULTS */}
          {filteredProjects.length === 0 && (
            <motion.div variants={fadeInUp} className="text-center py-12">
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                No projects match this category.
              </p>
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* PROJECT MODAL */}
      <Modal
        isOpen={!!selectedProject}
        onClose={() => setSelectedProject(null)}
        title={selectedProject?.title}
      >
        {selectedProject && (
          <div className="space-y-6">
            {/* IMAGE */}
            {selectedProject.image_url && (
              <img
                src={selectedProject.image_url}
                alt={selectedProject.title}
                className="w-full h-64 md:h-80 object-cover rounded-xl shadow-lg"
              />
            )}

            {/* DESCRIPTION */}
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                Description
              </h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                {selectedProject.description}
              </p>
            </div>

            {/* DETAILS */}
            {selectedProject.detailed_description && (
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  Details
                </h3>
                <div
                  className="prose dark:prose-invert max-w-none"
                  dangerouslySetInnerHTML={{
                    __html: selectedProject.detailed_description
                  }}
                />
              </div>
            )}

            {/* TECHNOLOGIES */}
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                Technologies Used
              </h3>
              <div className="flex flex-wrap gap-2">
                {selectedProject.tech_stack?.map((tech, i) => (
                  <span
                    key={i}
                    className="px-4 py-2 bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300 rounded-full font-medium"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* LINKS */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              {selectedProject.demo_url && (
                <a
                  href={selectedProject.demo_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-all shadow"
                >
                  <ExternalLink size={20} />
                  Live Demo
                </a>
              )}

              {selectedProject.code_url && (
                <a
                  href={selectedProject.code_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gray-800 text-white rounded-lg font-semibold hover:bg-gray-900 transition-all shadow"
                >
                  <Code size={20} />
                  Source Code
                </a>
              )}
            </div>
          </div>
        )}
      </Modal>
    </section>
  );
};

export default Portfolio;
