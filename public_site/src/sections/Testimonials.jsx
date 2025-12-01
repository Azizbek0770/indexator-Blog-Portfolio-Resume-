import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useApi } from '../hooks/useApi';
import { useScrollAnimation } from '../hooks/useAnimation';
import TestimonialCard from '../components/TestimonialCard';
import { fadeInUp, staggerContainer } from '../utils/animations';

const Testimonials = () => {
  const { data: testimonials } = useApi('/testimonials');
  const { ref, inView } = useScrollAnimation();
  const [currentIndex, setCurrentIndex] = useState(0);

  const itemsPerPage = 3;
  const totalPages = Math.ceil((testimonials?.length || 0) / itemsPerPage);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % totalPages);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + totalPages) % totalPages);
  };

  const visibleTestimonials = testimonials?.slice(
    currentIndex * itemsPerPage,
    (currentIndex + 1) * itemsPerPage
  ) || [];

  // Auto-play carousel
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => clearInterval(interval);
  }, [currentIndex, totalPages]);

  if (!testimonials || testimonials.length === 0) {
    return null;
  }

  return (
    <section id="testimonials" className="py-20 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={staggerContainer}
        >
          {/* Section Header */}
          <motion.div variants={fadeInUp} className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Client <span className="gradient-text">Testimonials</span>
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-primary-500 to-purple-600 mx-auto rounded-full mb-8"></div>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              What my clients say about working with me
            </p>
          </motion.div>

          {/* Testimonials Carousel */}
          <div className="relative">
            <motion.div
              variants={staggerContainer}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {visibleTestimonials.map((testimonial, index) => (
                <TestimonialCard
                  key={testimonial.id}
                  testimonial={testimonial}
                  delay={index * 100}
                />
              ))}
            </motion.div>

            {/* Navigation Buttons */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center space-x-4 mt-12">
                <button
                  onClick={prevSlide}
                  className="p-3 bg-primary-600 text-white rounded-full hover:bg-primary-700 transition-colors shadow-lg"
                  aria-label="Previous testimonials"
                >
                  <ChevronLeft size={24} />
                </button>

                {/* Pagination Dots */}
                <div className="flex space-x-2">
                  {Array.from({ length: totalPages }).map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentIndex(index)}
                      className={`w-3 h-3 rounded-full transition-all duration-300 ${
                        currentIndex === index
                          ? 'bg-primary-600 w-8'
                          : 'bg-gray-300 dark:bg-gray-600'
                      }`}
                      aria-label={`Go to testimonial page ${index + 1}`}
                    />
                  ))}
                </div>

                <button
                  onClick={nextSlide}
                  className="p-3 bg-primary-600 text-white rounded-full hover:bg-primary-700 transition-colors shadow-lg"
                  aria-label="Next testimonials"
                >
                  <ChevronRight size={24} />
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Testimonials;