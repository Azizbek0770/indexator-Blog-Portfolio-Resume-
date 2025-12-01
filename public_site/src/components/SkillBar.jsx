import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const SkillBar = ({ skill, delay = 0 }) => {
  const [width, setWidth] = useState(0);
  const { ref, inView } = useInView({
    threshold: 0.3,
    triggerOnce: true
  });

  useEffect(() => {
    if (inView) {
      setTimeout(() => {
        setWidth(skill.level);
      }, delay);
    }
  }, [inView, skill.level, delay]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: delay / 1000 }}
      className="mb-6"
    >
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-base font-semibold text-gray-900 dark:text-white">
          {skill.name}
        </h4>
        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
          {skill.level}%
        </span>
      </div>
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-primary-500 to-primary-600 rounded-full transition-all duration-1000 ease-out"
          style={{ width: `${width}%` }}
        />
      </div>
    </motion.div>
  );
};

export default SkillBar;