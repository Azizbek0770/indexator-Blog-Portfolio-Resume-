import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useApi } from '../hooks/useApi';
import { useScrollAnimation } from '../hooks/useAnimation';
import BlogCard from '../components/BlogCard';
import { fadeInUp, staggerContainer } from '../utils/animations';

const Blog = () => {
  const { data: posts } = useApi('/blog');
  const { data: categories } = useApi('/blog/categories/all');
  const { ref, inView } = useScrollAnimation();
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Filter posts by category
  const filteredPosts = posts?.filter(post => {
    if (selectedCategory === 'all') return true;
    return post.category?.slug === selectedCategory;
  }) || [];

  // Show only latest 6 posts
  const displayedPosts = filteredPosts.slice(0, 6);

  return (
    <section id="blog" className="py-20 bg-gray-50 dark:bg-gray-800">
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
              Latest <span className="gradient-text">Blog Posts</span>
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-primary-500 to-purple-600 mx-auto rounded-full mb-8"></div>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Thoughts, tutorials, and insights
            </p>
          </motion.div>

          {/* Category Filter */}
          {categories && categories.length > 0 && (
            <motion.div variants={fadeInUp} className="flex flex-wrap justify-center gap-3 mb-12">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${
                  selectedCategory === 'all'
                    ? 'bg-primary-600 text-white shadow-lg'
                    : 'bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                All Posts
              </button>
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.slug)}
                  className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${
                    selectedCategory === category.slug
                      ? 'bg-primary-600 text-white shadow-lg'
                      : 'bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </motion.div>
          )}

          {/* Blog Grid */}
          <motion.div
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {displayedPosts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </motion.div>

          {/* Empty State */}
          {displayedPosts.length === 0 && (
            <motion.div
              variants={fadeInUp}
              className="text-center py-12"
            >
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                No blog posts found in this category.
              </p>
            </motion.div>
          )}

          {/* View All Button */}
          {posts && posts.length > 6 && (
            <motion.div variants={fadeInUp} className="text-center mt-12">
              <button className="px-8 py-3 bg-primary-600 text-white rounded-full font-semibold hover:bg-primary-700 transition-colors shadow-lg">
                View All Posts
              </button>
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default Blog;