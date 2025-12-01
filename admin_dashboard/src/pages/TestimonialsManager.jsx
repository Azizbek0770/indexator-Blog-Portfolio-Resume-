import React, {
  useEffect,
  useState,
} from 'react';

import {
  Edit2,
  MessageSquare,
  Plus,
  Save,
  Star,
  Trash2,
  X,
} from 'lucide-react';
import toast from 'react-hot-toast';

import ImageUpload from '../components/ImageUpload';
import { useApi } from '../hooks/useApi';

const TestimonialsManager = () => {
  const { get, post, put, del } = useApi();
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    author: '',
    role: '',
    company: '',
    text: '',
    image_url: '',
    rating: 5,
    featured: false
  });

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const response = await get('/testimonials');
      setTestimonials(response.data || []);
    } catch (error) {
      console.error('Failed to fetch testimonials:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingItem) {
        await put(`/testimonials/${editingItem.id}`, formData);
        toast.success('Testimonial updated successfully!');
      } else {
        await post('/testimonials', formData);
        toast.success('Testimonial created successfully!');
      }
      
      fetchTestimonials();
      resetForm();
    } catch (error) {
      toast.error('Operation failed');
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      author: item.author,
      role: item.role || '',
      company: item.company || '',
      text: item.text,
      image_url: item.image_url || '',
      rating: item.rating || 5,
      featured: item.featured || false
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this testimonial?')) return;

    try {
      await del(`/testimonials/${id}`);
      toast.success('Testimonial deleted successfully!');
      fetchTestimonials();
    } catch (error) {
      toast.error('Failed to delete testimonial');
    }
  };

  const resetForm = () => {
    setFormData({
      author: '',
      role: '',
      company: '',
      text: '',
      image_url: '',
      rating: 5,
      featured: false
    });
    setEditingItem(null);
    setShowForm(false);
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={16}
        className={i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}
      />
    ));
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
              Testimonials
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage client testimonials and reviews
            </p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="btn-primary flex items-center space-x-2"
          >
            <Plus size={20} />
            <span>Add Testimonial</span>
          </button>
        </div>

        {/* Add/Edit Form */}
        {showForm && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {editingItem ? 'Edit Testimonial' : 'Add New Testimonial'}
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
                  <label className="label">Author Name</label>
                  <input
                    type="text"
                    value={formData.author}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                    className="input"
                    placeholder="John Doe"
                    required
                  />
                </div>

                <div>
                  <label className="label">Role/Position</label>
                  <input
                    type="text"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="input"
                    placeholder="CEO"
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
                  />
                </div>

                <div>
                  <label className="label">Rating</label>
                  <select
                    value={formData.rating}
                    onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value) })}
                    className="input"
                  >
                    {[1, 2, 3, 4, 5].map(num => (
                      <option key={num} value={num}>{num} Star{num > 1 ? 's' : ''}</option>
                    ))}
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="label">Testimonial Text</label>
                  <textarea
                    value={formData.text}
                    onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                    className="input"
                    rows="4"
                    placeholder="Write the testimonial..."
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.featured}
                      onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                      className="w-5 h-5 text-primary-600 rounded focus:ring-primary-500"
                    />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Featured Testimonial
                    </span>
                  </label>
                </div>
              </div>

              <ImageUpload
                label="Author Photo"
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

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {testimonials.map(testimonial => (
            <div
              key={testimonial.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              {testimonial.featured && (
                <div className="mb-4">
                  <span className="px-3 py-1 bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 text-xs font-bold rounded-full">
                    FEATURED
                  </span>
                </div>
              )}
              <div className="flex items-start space-x-4 mb-4">
                {testimonial.image_url ? (
                  <img
                    src={testimonial.image_url}
                    alt={testimonial.author}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-400 to-purple-500 flex items-center justify-center text-white font-bold text-xl">
                    {testimonial.author.charAt(0)}
                  </div>
                )}
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {testimonial.author}
                  </h3>
                  {testimonial.role && (
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {testimonial.role}
                      {testimonial.company && ` at ${testimonial.company}`}
                    </p>
                  )}
                  <div className="flex items-center mt-1">
                    {renderStars(testimonial.rating)}
                  </div>
                </div>
              </div>
              <p className="text-gray-700 dark:text-gray-300 mb-4 italic">
                "{testimonial.text}"
              </p>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleEdit(testimonial)}
                  className="flex-1 btn-secondary flex items-center justify-center space-x-2"
                >
                  <Edit2 size={16} />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => handleDelete(testimonial.id)}
                  className="flex-1 btn-danger flex items-center justify-center space-x-2"
                >
                  <Trash2 size={16} />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {testimonials.length === 0 && (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <MessageSquare size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600 dark:text-gray-400">
              No testimonials added yet. Click "Add Testimonial" to get started.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TestimonialsManager;