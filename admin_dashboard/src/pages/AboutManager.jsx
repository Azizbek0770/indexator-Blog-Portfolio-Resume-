import React, {
  useEffect,
  useState,
} from 'react';

import {
  Plus,
  Save,
  X,
} from 'lucide-react';
import toast from 'react-hot-toast';

import { useApi } from '../hooks/useApi';

const AboutManager = () => {
  const { get, put, loading } = useApi();
  const [formData, setFormData] = useState({
    bio: '',
    mission: '',
    languages: [],
    years_experience: 0,
    completed_projects: 0,
    happy_clients: 0
  });
  const [newLanguage, setNewLanguage] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchAboutData();
  }, []);

  const fetchAboutData = async () => {
    try {
      const response = await get('/about');
      if (response.data) {
        setFormData({
          ...response.data,
          languages: response.data.languages || []
        });
      }
    } catch (error) {
      console.error('Failed to fetch about data:', error);
    }
  };

  const handleChange = (e) => {
    const value = e.target.type === 'number' ? parseInt(e.target.value) || 0 : e.target.value;
    setFormData({
      ...formData,
      [e.target.name]: value
    });
  };

  const addLanguage = () => {
    if (newLanguage.trim() && !formData.languages.includes(newLanguage.trim())) {
      setFormData({
        ...formData,
        languages: [...formData.languages, newLanguage.trim()]
      });
      setNewLanguage('');
    }
  };

  const removeLanguage = (index) => {
    setFormData({
      ...formData,
      languages: formData.languages.filter((_, i) => i !== index)
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const response = await put('/about', formData);
      if (response.status === 'success') {
        toast.success('About section updated successfully!');
      }
    } catch (error) {
      toast.error('Failed to update about section');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            About Me Section
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your about section content
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Biography
            </h2>

            <div className="space-y-4">
              <div>
                <label className="label">Bio</label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  className="input"
                  rows="6"
                  placeholder="Write your biography..."
                  required
                />
              </div>

              <div>
                <label className="label">Mission Statement</label>
                <textarea
                  name="mission"
                  value={formData.mission}
                  onChange={handleChange}
                  className="input"
                  rows="4"
                  placeholder="Your mission or vision..."
                />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Languages
            </h2>

            <div className="space-y-4">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newLanguage}
                  onChange={(e) => setNewLanguage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addLanguage())}
                  className="input flex-1"
                  placeholder="Add a language..."
                />
                <button
                  type="button"
                  onClick={addLanguage}
                  className="btn-primary flex items-center space-x-2"
                >
                  <Plus size={20} />
                  <span>Add</span>
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {formData.languages.map((language, index) => (
                  <div
                    key={index}
                    className="inline-flex items-center space-x-2 bg-primary-100 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 px-3 py-1 rounded-full"
                  >
                    <span>{language}</span>
                    <button
                      type="button"
                      onClick={() => removeLanguage(index)}
                      className="hover:text-red-600 transition-colors"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Statistics
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="label">Years of Experience</label>
                <input
                  type="number"
                  name="years_experience"
                  value={formData.years_experience}
                  onChange={handleChange}
                  className="input"
                  min="0"
                />
              </div>

              <div>
                <label className="label">Completed Projects</label>
                <input
                  type="number"
                  name="completed_projects"
                  value={formData.completed_projects}
                  onChange={handleChange}
                  className="input"
                  min="0"
                />
              </div>

              <div>
                <label className="label">Happy Clients</label>
                <input
                  type="number"
                  name="happy_clients"
                  value={formData.happy_clients}
                  onChange={handleChange}
                  className="input"
                  min="0"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving || loading}
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
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AboutManager;