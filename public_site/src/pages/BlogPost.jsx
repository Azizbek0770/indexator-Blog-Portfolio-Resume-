import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, Clock, Tag } from 'lucide-react';
import { format } from 'date-fns';
import api from '../utils/api';
import { fadeInUp } from '../utils/animations';

const BlogPost = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await api.get(`/blog/slug/${slug}`);
        setPost(response.data.data);
      } catch (error) {
        console.error('Failed to fetch blog post:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
        <div className="loading"></div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Post Not Found
          </h1>
          <button
            onClick={() => navigate('/')}
            className="text-primary-600 dark:text-primary-400 hover:underline"
          >
            Go back home
          </button>
        </div>
      </div>
    );
  }

  const readingTime = Math.ceil((post.content?.length || 0) / 1000);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 pt-24 pb-16">
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate('/')}
          className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors mb-8"
        >
          <ArrowLeft size={20} />
          <span>Back to Home</span>
        </motion.button>

        {/* Featured Image */}
        {post.image_url && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 rounded-2xl overflow-hidden shadow-2xl"
          >
            <img
              src={post.image_url}
              alt={post.title}
              className="w-full h-96 object-cover"
            />
          </motion.div>
        )}

        {/* Post Header */}
        <motion.header
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          className="mb-8"
        >
          {/* Category */}
          {post.category && (
            <div className="mb-4">
              <span className="inline-flex items-center space-x-2 px-4 py-2 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full font-semibold">
                <Tag size={16} />
                <span>{post.category.name}</span>
              </span>
            </div>
          )}

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            {post.title}
          </h1>

          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-6 text-gray-600 dark:text-gray-400">
            <div className="flex items-center space-x-2">
              <Calendar size={18} />
              <span>{format(new Date(post.created_at), 'MMMM dd, yyyy')}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock size={18} />
              <span>{readingTime} min read</span>
            </div>
          </div>
        </motion.header>

        {/* Post Content */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.2 }}
          className="blog-content prose prose-lg dark:prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Divider */}
        <div className="my-12 border-t border-gray-200 dark:border-gray-800"></div>

        {/* Call to Action */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-r from-primary-500 to-purple-600 rounded-2xl p-8 text-center text-white"
        >
          <h3 className="text-2xl font-bold mb-4">
            Enjoyed this article?
          </h3>
          <p className="mb-6">
            Let's connect and discuss your next project!
          </p>
          <button
            onClick={() => navigate('/#contact')}
            className="px-8 py-3 bg-white text-primary-600 rounded-full font-semibold hover:bg-gray-100 transition-colors shadow-lg"
          >
            Get In Touch
          </button>
        </motion.div>
      </article>
    </div>
  );
};

export default BlogPost;