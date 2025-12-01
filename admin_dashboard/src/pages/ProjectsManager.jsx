import React, {
  useEffect,
  useState,
} from 'react';

import {
  Code,
  Edit2,
  ExternalLink,
  FolderOpen,
  Plus,
  Save,
  Trash2,
  X,
} from 'lucide-react';
import toast from 'react-hot-toast';

import ImageUpload from '../components/ImageUpload';
import RichTextEditor from '../components/RichTextEditor';
import { useApi } from '../hooks/useApi';

const ProjectsManager = () => {
  const { get, post, put, del } = useApi();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    detailed_description: '',
    tech_stack: [],
    image_url: '',
    demo_url: '',
    code_url: '',
    featured: false,
    sort_order: 0
  });
  const [newTech, setNewTech] = useState('');

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await get('/projects');
      setProjects(response.data || []);
    } catch (error) {
      console.error('Failed to fetch projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingItem) {
        await put(`/projects/${editingItem.id}`, formData);
        toast.success('Project updated successfully!');
      } else {
        await post('/projects', formData);
        toast.success('Project created successfully!');
      }
      
      fetchProjects();
      resetForm();
    } catch (error) {
      toast.error('Operation failed');
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      description: item.description,
      detailed_description: item.detailed_description || '',
      tech_stack: item.tech_stack || [],
      image_url: item.image_url || '',
      demo_url: item.demo_url || '',
      code_url: item.code_url || '',
      featured: item.featured || false,
      sort_order: item.sort_order || 0
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;

    try {
      await del(`/projects/${id}`);
      toast.success('Project deleted successfully!');
      fetchProjects();
    } catch (error) {
      toast.error('Failed to delete project');
    }
  };

  const addTech = () => {
    if (newTech.trim() && !formData.tech_stack.includes(newTech.trim())) {
      setFormData({
        ...formData,
        tech_stack: [...formData.tech_stack, newTech.trim()]
      });
      setNewTech('');
    }
  };

  const removeTech = (index) => {
    setFormData({
      ...formData,
      tech_stack: formData.tech_stack.filter((_, i) => i !== index)
    });
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      detailed_description: '',
      tech_stack: [],
      image_url: '',
      demo_url: '',
      code_url: '',
      featured: false,
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
              Projects Portfolio
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage your project showcase
            </p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="btn-primary flex items-center space-x-2"
          >
            <Plus size={20} />
            <span>Add Project</span>
          </button>
        </div>

        {/* Add/Edit Form */}
        {showForm && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {editingItem ? 'Edit Project' : 'Add New Project'}
              </h2>
              <button
                onClick={resetForm}
                className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="label">Project Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="input"
                    placeholder="E-Commerce Platform"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="label">Short Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="input"
                    rows="3"
                    placeholder="Brief description for project cards..."
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="label">Detailed Description</label>
                  <RichTextEditor
                    value={formData.detailed_description}
                    onChange={(value) => setFormData({ ...formData, detailed_description: value })}
                    placeholder="Write detailed project information..."
                  />
                </div>

                <div>
                  <label className="label">Demo URL</label>
                  <input
                    type="url"
                    value={formData.demo_url}
                    onChange={(e) => setFormData({ ...formData, demo_url: e.target.value })}
                    className="input"
                    placeholder="https://demo.example.com"
                  />
                </div>

                <div>
                  <label className="label">Code URL</label>
                  <input
                    type="url"
                    value={formData.code_url}
                    onChange={(e) => setFormData({ ...formData, code_url: e.target.value })}
                    className="input"
                    placeholder="https://github.com/username/repo"
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

                <div className="flex items-center">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.featured}
                      onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                      className="w-5 h-5 text-primary-600 rounded focus:ring-primary-500"
                    />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Featured Project
                    </span>
                  </label>
                </div>
              </div>

              <div>
                <label className="label">Tech Stack</label>
                <div className="flex space-x-2 mb-2">
                  <input
                    type="text"
                    value={newTech}
                    onChange={(e) => setNewTech(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTech())}
                    className="input flex-1"
                    placeholder="Add technology..."
                  />
                  <button
                    type="button"
                    onClick={addTech}
                    className="btn-primary flex items-center space-x-2"
                  >
                    <Plus size={20} />
                    <span>Add</span>
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.tech_stack.map((tech, index) => (
                    <div
                      key={index}
                      className="inline-flex items-center space-x-2 bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-full"
                    >
                      <span>{tech}</span>
                      <button
                        type="button"
                        onClick={() => removeTech(index)}
                        className="hover:text-red-600 transition-colors"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <ImageUpload
                label="Project Image"
                currentImage={formData.image_url}
                onUploadSuccess={(url) => setFormData({ ...formData, image_url: url })}
              />

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

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map(project => (
            <div
              key={project.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              {project.featured && (
                <div className="bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 text-center">
                  FEATURED
                </div>
              )}
              {project.image_url ? (
                <img
                  src={project.image_url}
                  alt={project.title}
                  className="w-full h-48 object-cover"
                />
              ) : (
                <div className="w-full h-48 bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                  <FolderOpen size={64} className="text-white opacity-50" />
                </div>
              )}
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {project.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-1 mb-4">
                  {project.tech_stack?.slice(0, 3).map((tech, i) => (
                    <span
                      key={i}
                      className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded"
                    >
                      {tech}
                    </span>
                  ))}
                  {project.tech_stack?.length > 3 && (
                    <span className="text-xs text-gray-500">
                      +{project.tech_stack.length - 3}
                    </span>
                  )}
                </div>
                <div className="flex items-center space-x-2 mb-4">
                  {project.demo_url && (
                    <a
                      href={project.demo_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center space-x-1"
                    >
                      <ExternalLink size={14} />
                      <span>Demo</span>
                    </a>
                  )}
                  {project.code_url && (
                    <a
                      href={project.code_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center space-x-1"
                    >
                      <Code size={14} />
                      <span>Code</span>
                    </a>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleEdit(project)}
                    className="flex-1 btn-secondary flex items-center justify-center space-x-2"
                  >
                    <Edit2 size={16} />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => handleDelete(project.id)}
                    className="flex-1 btn-danger flex items-center justify-center space-x-2"
                  >
                    <Trash2 size={16} />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {projects.length === 0 && (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <FolderOpen size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600 dark:text-gray-400">
              No projects added yet. Click "Add Project" to get started.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectsManager;