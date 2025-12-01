import React, {
  useEffect,
  useState,
} from 'react';

import { format } from 'date-fns';
import {
  Edit2,
  GraduationCap,
  Plus,
  Save,
  Trash2,
  X,
} from 'lucide-react';
import toast from 'react-hot-toast';

import { useApi } from '../hooks/useApi';

const EducationManager = () => {
  const { get, post, put, del } = useApi();
  const [educations, setEducations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    school: '',
    degree: '',
    field: '',
    start_date: '',
    end_date: '',
    current: false,
    description: '',
    gpa: '',
    sort_order: 0
  });

  useEffect(() => {
    fetchEducations();
  }, []);

  const fetchEducations = async () => {
    try {
      const response = await get('/education');
      setEducations(response.data || []);
    } catch (error) {
      console.error('Failed to fetch educations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingItem) {
        await put(`/education/${editingItem.id}`, formData);
        toast.success('Education updated successfully!');
      } else {
        await post('/education', formData);
        toast.success('Education created successfully!');
      }
      
      fetchEducations();
      resetForm();
    } catch (error) {
      toast.error('Operation failed');
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      school: item.school,
      degree: item.degree,
      field: item.field || '',
      start_date: item.start_date,
      end_date: item.end_date || '',
      current: item.current,
      description: item.description || '',
      gpa: item.gpa || '',
      sort_order: item.sort_order || 0
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this education?')) return;

    try {
      await del(`/education/${id}`);
      toast.success('Education deleted successfully!');
      fetchEducations();
    } catch (error) {
      toast.error('Failed to delete education');
    }
  };

  const resetForm = () => {
    setFormData({
      school: '',
      degree: '',
      field: '',
      start_date: '',
      end_date: '',
      current: false,
      description: '',
      gpa: '',
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
              Education
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage your educational background
            </p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="btn-primary flex items-center space-x-2"
          >
            <Plus size={20} />
            <span>Add Education</span>
          </button>
        </div>

        {/* Add/Edit Form */}
        {showForm && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {editingItem ? 'Edit Education' : 'Add New Education'}
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
                  <label className="label">School/University</label>
                  <input
                    type="text"
                    value={formData.school}
                    onChange={(e) => setFormData({ ...formData, school: e.target.value })}
                    className="input"
                    placeholder="University of Technology"
                    required
                  />
                </div>

                <div>
                  <label className="label">Degree</label>
                  <input
                    type="text"
                    value={formData.degree}
                    onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                    className="input"
                    placeholder="Bachelor of Science"
                    required
                  />
                </div>

                <div>
                  <label className="label">Field of Study</label>
                  <input
                    type="text"
                    value={formData.field}
                    onChange={(e) => setFormData({ ...formData, field: e.target.value })}
                    className="input"
                    placeholder="Computer Science"
                  />
                </div>

                <div>
                  <label className="label">GPA (Optional)</label>
                  <input
                    type="text"
                    value={formData.gpa}
                    onChange={(e) => setFormData({ ...formData, gpa: e.target.value })}
                    className="input"
                    placeholder="3.8"
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
                      Currently studying
                    </span>
                  </label>
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
                  placeholder="Additional details about your education..."
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

        {/* Education List */}
        <div className="space-y-6">
          {educations.map(edu => (
            <div
              key={edu.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4 flex-1">
                  <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                    <GraduationCap className="text-purple-600 dark:text-purple-400" size={24} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                      {edu.degree}
                    </h3>
                    <p className="text-purple-600 dark:text-purple-400 font-medium">
                      {edu.school}
                    </p>
                    {edu.field && (
                      <p className="text-gray-600 dark:text-gray-400">
                        {edu.field}
                      </p>
                    )}
                    <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600 dark:text-gray-400">
                      <span>
                        {format(new Date(edu.start_date), 'MMM yyyy')} - {' '}
                        {edu.current ? 'Present' : format(new Date(edu.end_date), 'MMM yyyy')}
                      </span>
                      {edu.gpa && (
                        <span>• GPA: {edu.gpa}</span>
                      )}
                      {edu.current && (
                        <span className="px-2 py-1 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-full text-xs">
                          Current
                        </span>
                      )}
                    </div>
                    {edu.description && (
                      <p className="mt-3 text-gray-700 dark:text-gray-300">
                        {edu.description}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2 ml-4">
                  <button
                    onClick={() => handleEdit(edu)}
                    className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(edu.id)}
                    className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {educations.length === 0 && (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <GraduationCap size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600 dark:text-gray-400">
              No education added yet. Click "Add Education" to get started.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EducationManager;