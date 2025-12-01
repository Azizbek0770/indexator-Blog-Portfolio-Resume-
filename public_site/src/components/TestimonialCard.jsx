import React from 'react';
import { motion } from 'framer-motion';
import { Quote, Star } from 'lucide-react';
import { scaleIn } from '../utils/animations';

const TestimonialCard = ({ testimonial, delay = 0 }) => {
  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={16}
        className={`${
          i < rating
            ? 'text-yellow-400 fill-yellow-400'
            : 'text-gray-300 dark:text-gray-600'
        }`}
      />
    ));
  };

  return (
    <motion.div
      variants={scaleIn}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      transition={{ delay: delay / 1000 }}
      className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg relative"
    >
      {/* Quote Icon */}
      <div className="absolute -top-4 -left-4 w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center shadow-lg">
        <Quote size={24} className="text-white" />
      </div>

      {/* Rating */}
      <div className="flex items-center space-x-1 mb-4">
        {renderStars(testimonial.rating || 5)}
      </div>

      {/* Testimonial Text */}
      <p className="text-gray-700 dark:text-gray-300 mb-6 italic leading-relaxed">
        "{testimonial.text}"
      </p>

      {/* Author Info */}
      <div className="flex items-center space-x-4">
        {testimonial.image_url ? (
          <img
            src={testimonial.image_url}
            alt={testimonial.author}
            className="w-12 h-12 rounded-full object-cover"
          />
        ) : (
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-400 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
            {testimonial.author.charAt(0)}
          </div>
        )}
        <div>
          <h4 className="font-semibold text-gray-900 dark:text-white">
            {testimonial.author}
          </h4>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {testimonial.role}
            {testimonial.company && ` at ${testimonial.company}`}
          </p>
        </div>
      </div>

      {/* Featured Badge */}
      {testimonial.featured && (
        <div className="absolute top-4 right-4">
          <span className="px-3 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 text-xs font-bold rounded-full">
            Featured
          </span>
        </div>
      )}
    </motion.div>
  );
};

export default TestimonialCard;