import React from 'react';
import { motion } from 'framer-motion';
import { Award, Users, Briefcase, Globe } from 'lucide-react';
import { useApi } from '../hooks/useApi';
import { useScrollAnimation } from '../hooks/useAnimation';
import { fadeInUp, staggerContainer } from '../utils/animations';

const About = () => {
  const { data: about, loading } = useApi('/about');
  const { ref, inView } = useScrollAnimation();

  if (loading) {
    return (
      <section id="about" className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="loading"></div>
        </div>
      </section>
    );
  }

  const stats = [
    {
      icon: Briefcase,
      value: about?.years_experience || 0,
      label: 'Years Experience',
      suffix: '+'
    },
    {
      icon: Award,
      value: about?.completed_projects || 0,
      label: 'Projects Completed',
      suffix: '+'
    },
    {
      icon: Users,
      value: about?.happy_clients || 0,
      label: 'Happy Clients',
      suffix: '+'
    },
    {
      icon: Globe,
      value: about?.languages?.length || 0,
      label: 'Languages',
      suffix: ''
    }
  ];

  return (
    <section id="about" className="py-20 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={staggerContainer}
          className="space-y-16"
        >
          {/* Section Header */}
          <motion.div variants={fadeInUp} className="text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              About <span className="gradient-text">Me</span>
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-primary-500 to-purple-600 mx-auto rounded-full"></div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <motion.div variants={fadeInUp} className="space-y-6">
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white">
                {about?.mission || 'Passionate about creating digital experiences'}
              </h3>
              
              <div className="prose prose-lg dark:prose-invert max-w-none">
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {about?.bio || 'Loading biography...'}
                </p>
              </div>

              {/* Languages */}
              {about?.languages && about.languages.length > 0 && (
                <div>
                  <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                    Languages
                  </h4>
                  <div className="flex flex-wrap gap-3">
                    {about.languages.map((language, index) => (
                      <span
                        key={index}
                        className="px-4 py-2 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full font-medium"
                      >
                        {language}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>

            {/* Right Content - Stats Grid */}
            <motion.div
              variants={staggerContainer}
              className="grid grid-cols-2 gap-6"
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  whileHover={{ scale: 1.05 }}
                  className="bg-gradient-to-br from-primary-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 p-8 rounded-2xl shadow-lg text-center"
                >
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-500 to-purple-600 rounded-2xl mb-4 shadow-lg">
                    <stat.icon size={32} className="text-white" />
                  </div>
                  <div className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                    {stat.value}{stat.suffix}
                  </div>
                  <div className="text-gray-600 dark:text-gray-400 font-medium">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;