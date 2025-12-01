import React from 'react';
import { motion } from 'framer-motion';
import { useApi } from '../hooks/useApi';
import { useScrollAnimation } from '../hooks/useAnimation';
import ServiceCard from '../components/ServiceCard';
import { fadeInUp, staggerContainer } from '../utils/animations';

const Services = () => {
  const { data: services } = useApi('/services');
  const { ref, inView } = useScrollAnimation();

  return (
    <section id="services" className="py-24 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          variants={staggerContainer}
        >
          {/* HEADER */}
          <motion.div variants={fadeInUp} className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              My <span className="gradient-text">Services</span>
            </h2>

            <div className="w-28 h-1 bg-gradient-to-r from-primary-500 to-purple-600 mx-auto rounded-full mb-8" />

            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              High-quality digital services tailored to your goals
            </p>
          </motion.div>

          {/* SERVICES GRID */}
          <motion.div
            variants={staggerContainer}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10"
          >
            {services?.map((service, index) => (
              <ServiceCard
                key={service.id}
                service={service}
                delay={index * 100}
              />
            ))}
          </motion.div>

          {/* CALL TO ACTION */}
          <motion.div variants={fadeInUp} className="mt-20 text-center">
            <div className="inline-block px-10 py-12 bg-gradient-to-br from-primary-600 to-purple-700 rounded-3xl shadow-2xl border border-white/20 dark:border-white/10">
              <h3 className="text-3xl font-bold text-white mb-4">
                Ready to start your next project?
              </h3>

              <p className="text-white/90 mb-8 max-w-lg mx-auto text-lg leading-relaxed">
                Let’s collaborate and turn your ideas into something remarkable.
              </p>

              <a
                href="#contact"
                className="inline-block px-10 py-4 bg-white text-primary-600 rounded-full font-semibold shadow-xl hover:bg-gray-100 transition-all"
              >
                Get In Touch
              </a>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Services;
