import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, CheckCircle } from 'lucide-react';
import { useScrollAnimation } from '../hooks/useAnimation';
import { useApi, useApiPost } from '../hooks/useApi';
import toast from 'react-hot-toast';
import { fadeInUp, staggerContainer } from '../utils/animations';

const Contact = () => {
  const { ref, inView } = useScrollAnimation();
  const { post, loading } = useApiPost();
  const { data: settings } = useApi('/settings');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await post('/messages', formData);
      toast.success('Message sent successfully!');
      setSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setSubmitted(false), 3000);
    } catch (error) {
      toast.error('Failed to send message.');
    }
  };

  const contactInfo = [
    { icon: Mail, title: 'Email', value: 'contact@example.com', link: 'mailto:contact@example.com' },
    { icon: Phone, title: 'Phone', value: '+1 (555) 123-4567', link: 'tel:+15551234567' },
    { icon: MapPin, title: 'Location', value: 'San Francisco, CA', link: '#' }
  ];

  const socialLinks = settings?.social_links || {};
  const normalize = (key, raw) => {
    if (!raw) return null;
    const val = String(raw).trim().replace(/^#/, '');
    if (/^https?:\/\//i.test(val)) return val;
    const handle = val.replace(/^@/, '').replace(/^\//, '');
    switch (key) {
      case 'github':
        return val.includes('github.com') ? `https://${val.replace(/^https?:\/\//, '')}` : `https://github.com/${handle}`;
      case 'linkedin':
        return val.includes('linkedin.com') ? `https://${val.replace(/^https?:\/\//, '')}` : `https://www.linkedin.com/in/${handle}`;
      case 'twitter':
        return val.includes('twitter.com') || val.includes('x.com')
          ? `https://${val.replace(/^https?:\/\//, '')}`
          : `https://twitter.com/${handle}`;
      default:
        return `https://${handle}`;
    }
  };

  return (
    <section id="contact" className="py-24 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        
        {/* HEADER */}
        <motion.div
          ref={ref}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          variants={staggerContainer}
          className="text-center mb-20"
        >
          <motion.h2 variants={fadeInUp} className="text-5xl font-bold text-gray-900 dark:text-white">
            Get In <span className="gradient-text">Touch</span>
          </motion.h2>

          <motion.div
            variants={fadeInUp}
            className="w-28 h-1 bg-gradient-to-r from-primary-500 to-purple-600 mx-auto rounded-full my-6"
          />

          <motion.p
            variants={fadeInUp}
            className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto"
          >
            Have a project in mind? Let's build something amazing together.
          </motion.p>
        </motion.div>

        {/* GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-14">
          
          {/* LEFT — CONTACT INFO */}
          <motion.div variants={fadeInUp} className="space-y-8 lg:pr-8">

            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Contact Information
            </h3>

            {contactInfo.map((item, i) => (
              <motion.a
                key={i}
                variants={fadeInUp}
                href={item.link}
                whileHover={{ x: 10 }}
                className="flex items-start space-x-4 p-5 bg-gray-50 dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
              >
                <div className="w-14 h-14 bg-primary-100 dark:bg-primary-900/30 rounded-xl flex items-center justify-center">
                  <item.icon className="text-primary-600 dark:text-primary-400" size={26} />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">{item.title}</h4>
                  <p className="text-gray-600 dark:text-gray-400">{item.value}</p>
                </div>
              </motion.a>
            ))}

            {/* SOCIALS */}
            <div className="pt-4">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Follow Me</h4>
              <div className="flex space-x-4">
                {[
                  { key: 'github', href: normalize('github', socialLinks.github) },
                  { key: 'linkedin', href: normalize('linkedin', socialLinks.linkedin) },
                  { key: 'twitter', href: normalize('twitter', socialLinks.twitter) }
                ].map(({ key, href }) => (
                  href ? (
                    <a
                      key={key}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center hover:bg-primary-600 dark:hover:bg-primary-600 hover:text-white transition-colors"
                    >
                      <span className="sr-only">{key}</span>
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387" />
                      </svg>
                    </a>
                  ) : null
                ))}
              </div>
            </div>
          </motion.div>

          {/* RIGHT — FORM */}
          <motion.div variants={fadeInUp} className="lg:col-span-2 bg-gray-50 dark:bg-gray-800 p-10 rounded-2xl shadow-lg">
            <form onSubmit={handleSubmit} className="space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Your Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  required
                />
                <Input
                  label="Your Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="john@example.com"
                  required
                />
              </div>

              <Input
                label="Subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="Project Inquiry"
              />

              <div>
                <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                  Message
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows="6"
                  required
                  placeholder="Tell me about your project..."
                  className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all text-gray-900 dark:text-white resize-none"
                />
              </div>

              {/* BUTTON */}
              <button
                type="submit"
                disabled={loading || submitted}
                className={`w-full flex items-center justify-center space-x-3 px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-300 shadow-md ${
                  submitted ? 'bg-green-600 hover:bg-green-700' : 'bg-primary-600 hover:bg-primary-700'
                } text-white`}
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white" />
                    <span>Sending...</span>
                  </>
                ) : submitted ? (
                  <>
                    <CheckCircle size={22} />
                    <span>Message Sent!</span>
                  </>
                ) : (
                  <>
                    <Send size={22} />
                    <span>Send Message</span>
                  </>
                )}
              </button>

            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const Input = ({ label, ...props }) => (
  <div>
    <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
      {label}
    </label>
    <input
      {...props}
      className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all text-gray-900 dark:text-white"
    />
  </div>
);

export default Contact;
