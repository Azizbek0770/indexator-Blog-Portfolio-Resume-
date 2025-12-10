import React from 'react';
import { Github, Linkedin, Twitter, Mail, Heart } from 'lucide-react';
import { useApi } from '../hooks/useApi';

const Footer = () => {
  const { data: settings } = useApi('/settings');
  const currentYear = new Date().getFullYear();

  const socialLinks = settings?.social_links || {};

  const normalize = (key, raw) => {
    if (!raw) return null;
    const val = String(raw).trim().replace(/^#/, '');
    if (key === 'email') return val.startsWith('mailto:') ? val : `mailto:${val}`;
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

  const socialIcons = {
    github: { icon: Github, url: normalize('github', socialLinks.github) },
    linkedin: { icon: Linkedin, url: normalize('linkedin', socialLinks.linkedin) },
    twitter: { icon: Twitter, url: normalize('twitter', socialLinks.twitter) },
    email: { icon: Mail, url: normalize('email', socialLinks.email) }
  };

  return (
    <footer className="bg-gray-900 dark:bg-black text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">

          {/* Brand */}
          <div>
            <h3 className="text-2xl font-bold mb-4 gradient-text">
              {settings?.site_title || 'Portfolio'}
            </h3>
            <p className="text-gray-400">
              {settings?.site_description || 'Building amazing digital experiences'}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {['about', 'portfolio', 'blog', 'contact'].map((section) => (
                <li key={section}>
                  <a
                    href={`#${section}`}
                    className="text-gray-400 hover:text-primary-400 transition-colors"
                  >
                    {section.charAt(0).toUpperCase() + section.slice(1)}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Connect With Me</h4>
            <div className="flex space-x-4">
              {Object.entries(socialIcons).map(([key, { icon: Icon, url }]) => {
                if (!url) return null;

                return (
                  <a
                    key={key}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={key}
                    className="p-3 bg-gray-800 rounded-full hover:bg-primary-600 transition-colors hover:shadow-lg hover:shadow-primary-700/30"
                  >
                    <Icon size={20} />
                  </a>
                );
              })}
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-800 text-center">
          <p className="text-gray-400 flex items-center justify-center">
            Made with{' '}
            <Heart size={16} className="mx-1 text-red-500" fill="currentColor" /> © {currentYear} All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
