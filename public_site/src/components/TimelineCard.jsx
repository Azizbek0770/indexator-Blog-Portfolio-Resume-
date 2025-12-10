import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin } from 'lucide-react';
import { format } from 'date-fns';
import { fadeInUp } from '../utils/animations';

const TimelineCard = ({ item, icon: Icon, index }) => {
  const isEven = index % 2 === 0;

  return (
    <motion.div
      variants={fadeInUp}
      className={`relative flex items-center ${isEven ? 'justify-start' : 'justify-end'} mb-8`}
    >
      {/* Timeline Line */}
      <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-primary-200 dark:bg-primary-800" />

      {/* Timeline Dot */}
      <div className="absolute left-1/2 transform -translate-x-1/2 w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center z-10 shadow-lg">
        <Icon size={24} className="text-white" />
      </div>

      {/* Content Card */}
      <div className={`w-full md:w-5/12 ${isEven ? 'md:pr-8 text-right md:text-right text-left' : 'md:pl-8 text-left'}`}>
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg"
        >
          {/* Date Badge */}
          <div className={`inline-flex items-center space-x-2 px-3 py-1 bg-primary-100 dark:bg-primary-900/30 rounded-full mb-3`}>
            <Calendar size={14} className="text-primary-600 dark:text-primary-400" />
            <span className="text-sm font-medium text-primary-700 dark:text-primary-300">
              {format(new Date(item.start_date), 'MMM yyyy')} - {' '}
              {item.current || !item.end_date
                ? 'Present'
                : format(new Date(item.end_date), 'MMM yyyy')}
            </span>
          </div>

          {/* Title */}
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
            {item.title || item.degree}
          </h3>

          {/* Subtitle */}
          <p className="text-primary-600 dark:text-primary-400 font-semibold mb-2">
            {item.company || item.school}
          </p>

          {/* Additional Info */}
          {(item.location || item.field) && (
            <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 mb-3">
              {item.location && (
                <>
                  <MapPin size={14} />
                  <span>{item.location}</span>
                </>
              )}
              {item.field && <span>{item.field}</span>}
              {item.gpa && <span>• GPA: {item.gpa}</span>}
            </div>
          )}

          {/* Description */}
          {item.description && (
            <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
              {item.description}
            </p>
          )}

          {/* Current Badge */}
          {item.current && (
            <div className="mt-3">
              <span className="inline-block px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-semibold rounded-full">
                Current
              </span>
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default TimelineCard;
