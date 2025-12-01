import React from 'react';
import { motion } from 'framer-motion';
import { Download, Mail, ChevronDown } from 'lucide-react';
import { Link } from 'react-scroll';
import { useApi } from '../hooks/useApi';
import AnimatedBackground from '../components/AnimatedBackground';
import { fadeInUp } from '../utils/animations';

const Hero = () => {
  const { data: hero, loading } = useApi('/hero');

  if (loading) {
    return (
      <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
        <div className="loading"></div>
      </section>
    );
  }

  return (
    <section
      id="hero"
      className="
        relative min-h-screen flex items-center justify-center overflow-hidden
        bg-gradient-to-br from-primary-50 via-purple-50 to-pink-50
        dark:from-gray-900 dark:via-gray-800 dark:to-gray-900
      "
    >
      {/* Soft Animated Background */}
      <AnimatedBackground />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* LEFT CONTENT */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.2 }
              }
            }}
            className="text-center lg:text-left"
          >
            <motion.div variants={fadeInUp}>
              <span className="
                inline-block px-5 py-2 rounded-full
                bg-white/50 dark:bg-white/10 backdrop-blur-sm
                text-primary-700 dark:text-primary-300 text-sm font-semibold
                shadow-md border border-white/40 dark:border-white/5
              ">
                Welcome to my portfolio
              </span>
            </motion.div>

            <motion.h1
              variants={fadeInUp}
              className="text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight mt-6 text-gray-900 dark:text-white"
            >
              Hi, I'm{' '}
              <span className="gradient-text drop-shadow-xl">
                {hero?.title || 'Developer'}
              </span>
            </motion.h1>

            <motion.p
              variants={fadeInUp}
              className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 mt-6 leading-relaxed"
            >
              {hero?.slogan || 'Building amazing digital experiences'}
            </motion.p>

            {/* CTA BUTTONS */}
            <motion.div
              variants={fadeInUp}
              className="flex flex-col sm:flex-row gap-5 mt-8 justify-center lg:justify-start"
            >
              {hero?.cta_primary_text && (
                <a
                  href={hero.cta_primary_link || '#contact'}
                  className="
                    inline-flex items-center space-x-2 px-8 py-4 rounded-full
                    bg-primary-600 text-white font-semibold shadow-xl
                    hover:bg-primary-700 hover:shadow-2xl transition-all duration-300
                  "
                >
                  <Mail size={20} />
                  <span>{hero.cta_primary_text}</span>
                </a>
              )}

              {hero?.cta_secondary_text && (
                <a
                  href={hero.cta_secondary_link || '/resume.pdf'}
                  className="
                    inline-flex items-center space-x-2 px-8 py-4 rounded-full
                    bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                    border border-gray-300 dark:border-gray-700
                    font-semibold shadow-lg hover:shadow-2xl 
                    hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300
                  "
                >
                  <Download size={20} />
                  <span>{hero.cta_secondary_text}</span>
                </a>
              )}
            </motion.div>
          </motion.div>

          {/* RIGHT CONTENT — AVATAR */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex justify-center lg:justify-end"
          >
            <div className="relative">
              {/* Glow Ring */}
              <div className="absolute -inset-6 rounded-full bg-gradient-to-r from-primary-600 to-purple-600 blur-3xl opacity-40 animate-pulse"></div>

              {/* Avatar Frame */}
              <div className="
                relative w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96
                rounded-full overflow-hidden shadow-3xl
                border-[10px] border-white dark:border-gray-900
              ">
                {hero?.avatar_url ? (
                  <img
                    src={hero.avatar_url}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="
                    w-full h-full flex items-center justify-center
                    bg-gradient-to-br from-primary-400 to-purple-600
                  ">
                    <span className="text-7xl font-bold text-white">
                      {hero?.title?.charAt(0) || 'D'}
                    </span>
                  </div>
                )}
              </div>

              {/* Floating Badge */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="
                  absolute -bottom-4 -right-4 px-6 py-3 rounded-full
                  bg-white dark:bg-gray-800 shadow-xl
                  border border-gray-200 dark:border-gray-700
                "
              >
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    Available for work
                  </span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Down Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <Link to="about" smooth={true} duration={600} className="cursor-pointer">
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="flex flex-col items-center text-gray-600 dark:text-gray-400 hover:text-primary-500 dark:hover:text-primary-300"
          >
            <span className="text-sm font-medium">Scroll Down</span>
            <ChevronDown size={26} />
          </motion.div>
        </Link>
      </motion.div>
    </section>
  );
};

export default Hero;
