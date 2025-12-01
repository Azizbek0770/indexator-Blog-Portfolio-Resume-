import React, {
  useEffect,
  useState,
} from 'react';

import { format } from 'date-fns';
import {
  Briefcase,
  Edit2,
  Plus,
  Save,
  Trash2,
  X,
} from 'lucide-react';
import toast from 'react-hot-toast';

import { useApi } from '../hooks/useApi';

const ExperienceManager = () => {
  const { get, post, put, del } = useApi();
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    start_date: '',
    end_date: '',
    current: false,
    description: '',
    location: '',
    sort_order: 0
  });

  useEffect(() => {
    fetchExperiences();
  }, []);

  const fetchExperiences = async () => {
    try {
      const response = await get('/experience');
      setExperiences(response.data || []);
    } catch (error) {
      console.error('Failed to fetch experiences:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingItem) {
        await put(`/experience/${editingItem.id}`, formData);
        toast.success('Experience updated successfully!');
      } else {
        await post('/experience', formData);
        toast.success('Experience created successfully!');
      }
      
      fetchExperiences();
      resetForm();
    } catch (error) {
      toast.error('Operation failed');
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      company: item.company,
      start_date: item.start_date,
      end_date: item.end_date || '',
      current: item.current,
      description: item.description || '',
      location: item.location || '',
      sort_order: item.sort_order || 0
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this experience?')) return;

    try {
      await del(`/experience/${id}`);
      toast.success('Experience deleted successfully!');
      fetchExperiences();
    } catch (error) {
      toast.error('Failed to delete experience');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      company: '',
      start_date: '',
      end_date: '',
      current: false,
      description: '',
      location: '',
      sort_order: 0
    });
    setEditingItem(null);
    setShowForm(false);
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
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Work Experience
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage your professional experience timeline
            </p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="btn-primary flex items-center space-x-2"
          >
            <Plus size={20} />
            <span>Add Experience</span>
          </button>
        </div>

        {/* Add/Edit Form */}
        {showForm && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {editingItem ? 'Edit Experience' : 'Add New Experience'}
              </h2>
              <button
                onClick={resetForm}
                className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="label">Job Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="input"
                    placeholder="Senior Developer"
                    required
                  />
                </div>

                <div>
                  <label className="label">Company</label>
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="input"
                    placeholder="Tech Corp"
                    required
                  />
                </div>

                <div>
                  <label className="label">Start Date</label>
                  <input
                    type="date"
                    value={formData.start_date}
                    onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                    className="input"
                    required
                  />
                </div>

                <div>
                  <label className="label">End Date</label>
                  <input
                    type="date"
                    value={formData.end_date}
                    onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                    className="input"
                    disabled={formData.current}
                  />
                  <label className="flex items-center mt-2">
                    <input
                      type="checkbox"
                      checked={formData.current}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        current: e.target.checked,
                        end_date: e.target.checked ? '' : formData.end_date
                      })}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      Currently working here
                    </span>
                  </label>
                </div>

                <div>
                  <label className="label">Location</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="input"
                    placeholder="New York, NY"
                  />
                </div>

                <div>
                  <label className="label">Sort Order</label>
                  <input
                    type="number"
                    value={formData.sort_order}
                    onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) || 0 })}
                    className="input"
                    placeholder="0"
                  />
                </div>
              </div>

              <div>
                <label className="label">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="input"
                  rows="4"
                  placeholder="Describe your role and achievements..."
                />
              </div>

              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={resetForm}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary flex items-center space-x-2">
                  <Save size={20} />
                  <span>{editingItem ? 'Update' : 'Create'}</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Experience Timeline */}
        <div className="space-y-6">
          {experiences.map(exp => (
            <div
              key={exp.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4 flex-1">
                  <div className="p-3 bg-primary-100 dark:bg-primary-900/20 rounded-lg">
                    <Briefcase className="text-primary-600 dark:text-primary-400" size={24} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                      {exp.title}
                    </h3>
                    <p className="text-primary-600 dark:text-primary-400 font-medium">
                      {exp.company}
                    </p>
                    <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600 dark:text-gray-400">
                      <span>
                        {format(new Date(exp.start_date), 'MMM yyyy')} - {' '}
                        {exp.current ? 'Present' : format(new Date(exp.end_date), 'MMM yyyy')}
                      </span>
                      {exp.location && (
                        <span>• {exp.location}</span>
                      )}
                      {exp.current && (
                        <span className="px-2 py-1 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-full text-xs">
                          Current
                        </span>
                      )}
                    </div>
                    {exp.description && (
                      <p className="mt-3 text-gray-700 dark:text-gray-300">
                        {exp.description}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2 ml-4">
                  <button
                    onClick={() => handleEdit(exp)}
                    className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(exp.id)}
                    className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {experiences.length === 0 && (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <Briefcase size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600 dark:text-gray-400">
              No work experience added yet. Click "Add Experience" to get started.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExperienceManager;