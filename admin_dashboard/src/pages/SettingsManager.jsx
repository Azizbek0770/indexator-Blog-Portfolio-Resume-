import React, {
  useEffect,
  useState,
} from 'react';

import {
  Globe,
  Palette,
  Save,
  Settings as SettingsIcon,
  Type,
} from 'lucide-react';
import toast from 'react-hot-toast';

import { useApi } from '../hooks/useApi';

const SettingsManager = () => {
  const { get, put } = useApi();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    theme: 'light',
    primary_color: '#3B82F6',
    secondary_color: '#8B5CF6',
    font_family: 'Inter',
    site_title: 'My Portfolio',
    site_description: '',
    social_links: {
      github: '',
      linkedin: '',
      twitter: '',
      facebook: '',
      instagram: '',
      youtube: '',
      website: ''
    }
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await get('/settings');
      if (response.data) {
        setFormData({
          ...response.data,
          social_links: response.data.social_links || {
            github: '',
            linkedin: '',
            twitter: '',
            facebook: '',
            instagram: '',
            youtube: '',
            website: ''
          }
        });
      }
    } catch (error) {
      console.error('Failed to fetch settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSocialLinkChange = (platform, value) => {
    setFormData({
      ...formData,
      social_links: {
        ...formData.social_links,
        [platform]: value
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const response = await put('/settings', formData);
      if (response.status === 'success') {
        toast.success('Settings updated successfully!');
      }
    } catch (error) {
      toast.error('Failed to update settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Global Settings
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Configure global portfolio settings and preferences
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Site Information */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Globe className="text-primary-600 dark:text-primary-400" size={24} />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Site Information
              </h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="label">Site Title</label>
                <input
                  type="text"
                  name="site_title"
                  value={formData.site_title}
                  onChange={handleChange}
                  className="input"
                  placeholder="My Portfolio"
                />
              </div>

              <div>
                <label className="label">Site Description</label>
                <textarea
                  name="site_description"
                  value={formData.site_description}
                  onChange={handleChange}
                  className="input"
                  rows="3"
                  placeholder="A brief description of your portfolio site..."
                />
              </div>
            </div>
          </div>

          {/* Theme & Appearance */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Palette className="text-primary-600 dark:text-primary-400" size={24} />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Theme & Colors
              </h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="label">Default Theme</label>
                <select
                  name="theme"
                  value={formData.theme}
                  onChange={handleChange}
                  className="input"
                >
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="label">Primary Color</label>
                  <div className="flex space-x-2">
                    <input
                      type="color"
                      name="primary_color"
                      value={formData.primary_color}
                      onChange={handleChange}
                      className="w-16 h-10 rounded border border-gray-300 dark:border-gray-600"
                    />
                    <input
                      type="text"
                      name="primary_color"
                      value={formData.primary_color}
                      onChange={handleChange}
                      className="input flex-1"
                      placeholder="#3B82F6"
                    />
                  </div>
                </div>

                <div>
                  <label className="label">Secondary Color</label>
                  <div className="flex space-x-2">
                    <input
                      type="color"
                      name="secondary_color"
                      value={formData.secondary_color}
                      onChange={handleChange}
                      className="w-16 h-10 rounded border border-gray-300 dark:border-gray-600"
                    />
                    <input
                      type="text"
                      name="secondary_color"
                      value={formData.secondary_color}
                      onChange={handleChange}
                      className="input flex-1"
                      placeholder="#8B5CF6"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Typography */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Type className="text-primary-600 dark:text-primary-400" size={24} />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Typography
              </h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="label">Font Family</label>
                <select
                  name="font_family"
                  value={formData.font_family}
                  onChange={handleChange}
                  className="input"
                >
                  <option value="Inter">Inter</option>
                  <option value="Roboto">Roboto</option>
                  <option value="Open Sans">Open Sans</option>
                  <option value="Poppins">Poppins</option>
                  <option value="Montserrat">Montserrat</option>
                  <option value="Lato">Lato</option>
                </select>
              </div>
            </div>
          </div>

          {/* Social Links */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex items-center space-x-2 mb-4">
              <SettingsIcon className="text-primary-600 dark:text-primary-400" size={24} />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Social Media Links
              </h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="label">GitHub</label>
                <input
                  type="url"
                  value={formData.social_links.github}
                  onChange={(e) => handleSocialLinkChange('github', e.target.value)}
                  className="input"
                  placeholder="https://github.com/username"
                />
              </div>

              <div>
                <label className="label">LinkedIn</label>
                <input
                  type="url"
                  value={formData.social_links.linkedin}
                  onChange={(e) => handleSocialLinkChange('linkedin', e.target.value)}
                  className="input"
                  placeholder="https://linkedin.com/in/username"
                />
              </div>

              <div>
                <label className="label">Twitter</label>
                <input
                  type="url"
                  value={formData.social_links.twitter}
                  onChange={(e) => handleSocialLinkChange('twitter', e.target.value)}
                  className="input"
                  placeholder="https://twitter.com/username"
                />
              </div>

              <div>
                <label className="label">Facebook</label>
                <input
                  type="url"
                  value={formData.social_links.facebook}
                  onChange={(e) => handleSocialLinkChange('facebook', e.target.value)}
                  className="input"
                  placeholder="https://facebook.com/username"
                />
              </div>

              <div>
                <label className="label">Instagram</label>
                <input
                  type="url"
                  value={formData.social_links.instagram}
                  onChange={(e) => handleSocialLinkChange('instagram', e.target.value)}
                  className="input"
                  placeholder="https://instagram.com/username"
                />
              </div>

              <div>
                <label className="label">YouTube</label>
                <input
                  type="url"
                  value={formData.social_links.youtube}
                  onChange={(e) => handleSocialLinkChange('youtube', e.target.value)}
                  className="input"
                  placeholder="https://youtube.com/channel/..."
                />
              </div>

              <div>
                <label className="label">Personal Website</label>
                <input
                  type="url"
                  value={formData.social_links.website}
                  onChange={(e) => handleSocialLinkChange('website', e.target.value)}
                  className="input"
                  placeholder="https://yourwebsite.com"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="btn-primary flex items-center space-x-2"
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save size={20} />
                  <span>Save Settings</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SettingsManager;