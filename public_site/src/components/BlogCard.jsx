import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { fadeInUp } from '../utils/animations';

const BlogCard = ({ post }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/blog/${post.slug}`);
  };

  const readingTime = Math.ceil((post.content?.length || 0) / 1000);

  return (
    <motion.article
      variants={fadeInUp}
      whileHover={{ y: -10 }}
      onClick={handleClick}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-2xl"
    >
      {/* Featured Image */}
      <div className="relative h-48 overflow-hidden">
        {post.image_url ? (
          <img
            src={post.image_url}
            alt={post.title}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-600" />
        )}
        {post.category && (
          <div className="absolute top-4 left-4 px-3 py-1 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-full">
            <span className="text-xs font-semibold text-gray-900 dark:text-white">
              {post.category.name}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Meta Info */}
        <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400 mb-3">
          <div className="flex items-center space-x-1">
            <Calendar size={14} />
            <span>{format(new Date(post.created_at), 'MMM dd, yyyy')}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Clock size={14} />
            <span>{readingTime} min read</span>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 line-clamp-2">
          {post.title}
        </h3>

        {/* Excerpt */}
        <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
          {post.excerpt || post.content?.replace(/<[^>]*>/g, '').substring(0, 150) + '...'}
        </p>

        {/* Read More */}
        <div className="flex items-center text-primary-600 dark:text-primary-400 font-medium group">
          <span>Read More</span>
          <ArrowRight 
            size={16} 
            className="ml-1 transition-transform group-hover:translate-x-1" 
          />
        </div>
      </div>
    </motion.article>
  );
};

export default BlogCard;