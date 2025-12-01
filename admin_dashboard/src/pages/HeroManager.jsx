import React, {
  useEffect,
  useState,
} from 'react';

import { Save } from 'lucide-react';
import toast from 'react-hot-toast';

import ImageUpload from '../components/ImageUpload';
import { useApi } from '../hooks/useApi';

const HeroManager = () => {
  const { get, put, loading } = useApi();
  const [formData, setFormData] = useState({
    title: '',
    slogan: '',
    avatar_url: '',
    cta_primary_text: '',
    cta_primary_link: '',
    cta_secondary_text: '',
    cta_secondary_link: ''
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchHeroData();
  }, []);

  const fetchHeroData = async () => {
    try {
      const response = await get('/hero');
      if (response.data) {
        setFormData(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch hero data:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const response = await put('/hero', formData);
      if (response.status === 'success') {
        toast.success('Hero section updated successfully!');
      }
    } catch (error) {
      toast.error('Failed to update hero section');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Hero Section
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage the hero section of your portfolio
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Basic Information
            </h2>

            <div className="space-y-4">
              <div>
                <label className="label">Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="input"
                  placeholder="Full Stack Developer"
                  required
                />
              </div>

              <div>
                <label className="label">Slogan</label>
                <textarea
                  name="slogan"
                  value={formData.slogan}
                  onChange={handleChange}
                  className="input"
                  rows="3"
                  placeholder="Building amazing digital experiences..."
                  required
                />
              </div>

              <ImageUpload
                label="Avatar Image"
                currentImage={formData.avatar_url}
                onUploadSuccess={(url) => setFormData({ ...formData, avatar_url: url })}
              />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Call to Action Buttons
            </h2>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="label">Primary Button Text</label>
                  <input
                    type="text"
                    name="cta_primary_text"
                    value={formData.cta_primary_text}
                    onChange={handleChange}
                    className="input"
                    placeholder="Contact Me"
                  />
                </div>
                <div>
                  <label className="label">Primary Button Link</label>
                  <input
                    type="text"
                    name="cta_primary_link"
                    value={formData.cta_primary_link}
                    onChange={handleChange}
                    className="input"
                    placeholder="#contact"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="label">Secondary Button Text</label>
                  <input
                    type="text"
                    name="cta_secondary_text"
                    value={formData.cta_secondary_text}
                    onChange={handleChange}
                    className="input"
                    placeholder="Download Resume"
                  />
                </div>
                <div>
                  <label className="label">Secondary Button Link</label>
                  <input
                    type="text"
                    name="cta_secondary_link"
                    value={formData.cta_secondary_link}
                    onChange={handleChange}
                    className="input"
                    placeholder="/resume.pdf"
                  />
                </div>
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

export default HeroManager;