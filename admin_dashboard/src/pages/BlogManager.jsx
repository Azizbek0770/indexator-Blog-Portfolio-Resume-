import React, {
  useEffect,
  useState,
} from 'react';

import { format } from 'date-fns';
import {
  Edit2,
  Eye,
  FileText,
  Plus,
  Save,
  Trash2,
  X,
} from 'lucide-react';
import toast from 'react-hot-toast';

import ImageUpload from '../components/ImageUpload';
import RichTextEditor from '../components/RichTextEditor';
import { useApi } from '../hooks/useApi';

const BlogManager = () => {
  const { get, post, put, del } = useApi();
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    category_id: '',
    image_url: '',
    published: false
  });
  const [categoryForm, setCategoryForm] = useState({
    name: '',
    slug: ''
  });

  useEffect(() => {
    fetchPosts();
    fetchCategories();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await get('/blog?published=false');
      setPosts(response.data || []);
    } catch (error) {
      console.error('Failed to fetch posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await get('/blog/categories/all');
      setCategories(response.data || []);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleTitleChange = (title) => {
    setFormData({
      ...formData,
      title,
      slug: generateSlug(title)
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingItem) {
        await put(`/blog/${editingItem.id}`, formData);
        toast.success('Blog post updated successfully!');
      } else {
        await post('/blog', formData);
        toast.success('Blog post created successfully!');
      }
      
      fetchPosts();
      resetForm();
    } catch (error) {
      toast.error('Operation failed');
    }
  };

  const handleCategorySubmit = async (e) => {
    e.preventDefault();

    try {
      await post('/blog/categories', categoryForm);
      toast.success('Category created successfully!');
      fetchCategories();
      setCategoryForm({ name: '', slug: '' });
      setShowCategoryForm(false);
    } catch (error) {
      toast.error('Failed to create category');
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      slug: item.slug,
      content: item.content,
      excerpt: item.excerpt || '',
      category_id: item.category_id || '',
      image_url: item.image_url || '',
      published: item.published
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;

    try {
      await del(`/blog/${id}`);
      toast.success('Blog post deleted successfully!');
      fetchPosts();
    } catch (error) {
      toast.error('Failed to delete post');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      slug: '',
      content: '',
      excerpt: '',
      category_id: '',
      image_url: '',
      published: false
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
              Blog Management
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Create and manage blog posts
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowCategoryForm(true)}
              className="btn-secondary flex items-center space-x-2"
            >
              <Plus size={20} />
              <span>Category</span>
            </button>
            <button
              onClick={() => setShowForm(true)}
              className="btn-primary flex items-center space-x-2"
            >
              <Plus size={20} />
              <span>New Post</span>
            </button>
          </div>
        </div>

        {/* Category Form Modal */}
        {showCategoryForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Add New Category
              </h2>
              <form onSubmit={handleCategorySubmit} className="space-y-4">
                <div>
                  <label className="label">Category Name</label>
                  <input
                    type="text"
                    value={categoryForm.name}
                    onChange={(e) => setCategoryForm({
                      name: e.target.value,
                      slug: generateSlug(e.target.value)
                    })}
                    className="input"
                    placeholder="Web Development"
                    required
                  />
                </div>
                <div>
                  <label className="label">Slug</label>
                  <input
                    type="text"
                    value={categoryForm.slug}
                    onChange={(e) => setCategoryForm({ ...categoryForm, slug: e.target.value })}
                    className="input"
                    placeholder="web-development"
                    required
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setShowCategoryForm(false)}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary">
                    Create Category
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Add/Edit Form */}
        {showForm && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {editingItem ? 'Edit Blog Post' : 'Create New Post'}
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
                  <label className="label">Post Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    className="input"
                    placeholder="My Amazing Blog Post"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="label">Slug</label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="input"
                    placeholder="my-amazing-blog-post"
                    required
                  />
                </div>

                <div>
                  <label className="label">Category</label>
                  <select
                    value={formData.category_id}
                    onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                    className="input"
                  >
                    <option value="">Select a category</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.published}
                      onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                      className="w-5 h-5 text-primary-600 rounded focus:ring-primary-500"
                    />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Publish immediately
                    </span>
                  </label>
                </div>

                <div className="md:col-span-2">
                  <label className="label">Excerpt (Short Description)</label>
                  <textarea
                    value={formData.excerpt}
                    onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                    className="input"
                    rows="3"
                    placeholder="Brief description for post preview..."
                  />
                </div>
              </div>

              <div>
                <label className="label">Content</label>
                <RichTextEditor
                  value={formData.content}
                  onChange={(value) => setFormData({ ...formData, content: value })}
                  placeholder="Write your blog post content..."
                />
              </div>

              <ImageUpload
                label="Featured Image"
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

        {/* Posts List */}
        <div className="space-y-4">
          {posts.map(post => (
            <div
              key={post.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start space-x-4">
                {post.image_url ? (
                  <img
                    src={post.image_url}
                    alt={post.title}
                    className="w-32 h-24 object-cover rounded-lg"
                  />
                ) : (
                  <div className="w-32 h-24 bg-gradient-to-br from-primary-400 to-purple-500 rounded-lg flex items-center justify-center">
                    <FileText size={32} className="text-white opacity-50" />
                  </div>
                )}
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                        {post.title}
                      </h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400 mb-2">
                        {post.category && (
                          <span className="px-2 py-1 bg-primary-100 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 rounded">
                            {post.category.name}
                          </span>
                        )}
                        <span>{format(new Date(post.created_at), 'MMM dd, yyyy')}</span>
                        <span className="flex items-center space-x-1">
                          <Eye size={14} />
                          <span>{post.views || 0} views</span>
                        </span>
                        {post.published ? (
                          <span className="px-2 py-1 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded text-xs font-medium">
                            Published
                          </span>
                        ) : (
                          <span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 rounded text-xs font-medium">
                            Draft
                          </span>
                        )}
                      </div>
                      {post.excerpt && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                          {post.excerpt}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      <button
                        onClick={() => handleEdit(post)}
                        className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(post.id)}
                        className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {posts.length === 0 && (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <FileText size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600 dark:text-gray-400">
              No blog posts yet. Click "New Post" to create your first post.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogManager;