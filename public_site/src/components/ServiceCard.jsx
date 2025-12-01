import React from 'react';
import { motion } from 'framer-motion';
import { 
  Code, 
  Palette, 
  Smartphone, 
  Server, 
  Database, 
  Cloud, 
  Shield, 
  Zap 
} from 'lucide-react';
import { scaleIn } from '../utils/animations';

const iconMap = {
  code: Code,
  palette: Palette,
  smartphone: Smartphone,
  server: Server,
  database: Database,
  cloud: Cloud,
  shield: Shield,
  zap: Zap
};

const ServiceCard = ({ service, delay = 0 }) => {
  const Icon = iconMap[service.icon] || Code;

  return (
    <motion.div
      variants={scaleIn}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      transition={{ delay: delay / 1000 }}
      whileHover={{ y: -10, scale: 1.05 }}
      className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300"
    >
      {/* Icon */}
      <div className="relative mb-6">
        <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg transform rotate-6 hover:rotate-12 transition-transform duration-300">
          <Icon size={32} className="text-white" />
        </div>
      </div>

      {/* Title */}
      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        {service.title}
      </h3>

      {/* Description */}
      <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
        {service.description}
      </p>

      {/* Decorative Element */}
      <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center text-primary-600 dark:text-primary-400 font-medium">
          <span className="text-sm">Learn More</span>
          <svg
            className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </div>
      </div>
    </motion.div>
  );
};

export default ServiceCard;