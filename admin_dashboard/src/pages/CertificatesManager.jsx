import React, {
  useEffect,
  useState,
} from 'react';

import { format } from 'date-fns';
import {
  Award,
  Edit2,
  Plus,
  Save,
  Trash2,
  X,
} from 'lucide-react';
import toast from 'react-hot-toast';

import ImageUpload from '../components/ImageUpload';
import { useApi } from '../hooks/useApi';

const CertificatesManager = () => {
  const { get, post, put, del } = useApi();
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    issuer: '',
    issue_date: '',
    credential_id: '',
    credential_url: '',
    image_url: ''
  });

  useEffect(() => {
    fetchCertificates();
  }, []);

  const fetchCertificates = async () => {
    try {
      const response = await get('/certificates');
      setCertificates(response.data || []);
    } catch (error) {
      console.error('Failed to fetch certificates:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingItem) {
        await put(`/certificates/${editingItem.id}`, formData);
        toast.success('Certificate updated successfully!');
      } else {
        await post('/certificates', formData);
        toast.success('Certificate created successfully!');
      }
      
      fetchCertificates();
      resetForm();
    } catch (error) {
      toast.error('Operation failed');
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      issuer: item.issuer,
      issue_date: item.issue_date,
      credential_id: item.credential_id || '',
      credential_url: item.credential_url || '',
      image_url: item.image_url || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this certificate?')) return;

    try {
      await del(`/certificates/${id}`);
      toast.success('Certificate deleted successfully!');
      fetchCertificates();
    } catch (error) {
      toast.error('Failed to delete certificate');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      issuer: '',
      issue_date: '',
      credential_id: '',
      credential_url: '',
      image_url: ''
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
              Certificates & Certifications
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage your professional certificates
            </p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="btn-primary flex items-center space-x-2"
          >
            <Plus size={20} />
            <span>Add Certificate</span>
          </button>
        </div>

        {/* Add/Edit Form */}
        {showForm && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {editingItem ? 'Edit Certificate' : 'Add New Certificate'}
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
                  <label className="label">Certificate Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="input"
                    placeholder="AWS Certified Solutions Architect"
                    required
                  />
                </div>

                <div>
                  <label className="label">Issuing Organization</label>
                  <input
                    type="text"
                    value={formData.issuer}
                    onChange={(e) => setFormData({ ...formData, issuer: e.target.value })}
                    className="input"
                    placeholder="Amazon Web Services"
                    required
                  />
                </div>

                <div>
                  <label className="label">Issue Date</label>
                  <input
                    type="date"
                    value={formData.issue_date}
                    onChange={(e) => setFormData({ ...formData, issue_date: e.target.value })}
                    className="input"
                    required
                  />
                </div>

                <div>
                  <label className="label">Credential ID</label>
                  <input
                    type="text"
                    value={formData.credential_id}
                    onChange={(e) => setFormData({ ...formData, credential_id: e.target.value })}
                    className="input"
                    placeholder="ABC-123-XYZ"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="label">Credential URL</label>
                  <input
                    type="url"
                    value={formData.credential_url}
                    onChange={(e) => setFormData({ ...formData, credential_url: e.target.value })}
                    className="input"
                    placeholder="https://verify.example.com/credential"
                  />
                </div>
              </div>

              <ImageUpload
                label="Certificate Image"
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

        {/* Certificates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certificates.map(cert => (
            <div
              key={cert.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              {cert.image_url ? (
                <img
                  src={cert.image_url}
                  alt={cert.name}
                  className="w-full h-48 object-cover"
                />
              ) : (
                <div className="w-full h-48 bg-gradient-to-br from-primary-400 to-purple-500 flex items-center justify-center">
                  <Award size={64} className="text-white opacity-50" />
                </div>
              )}
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {cert.name}
                </h3>
                <p className="text-primary-600 dark:text-primary-400 font-medium mb-2">
                  {cert.issuer}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Issued: {format(new Date(cert.issue_date), 'MMM yyyy')}
                </p>
                {cert.credential_id && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                    ID: {cert.credential_id}
                  </p>
                )}
                {cert.credential_url && (
                    <a
                        href={cert.credential_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 dark:text-blue-400 hover:underline block mb-4"
                    >
                        Verify Credential →
                    </a>
                    )}
                    <div className="flex items-center space-x-2">
                    <button
                        onClick={() => handleEdit(cert)}
                        className="flex-1 btn-secondary flex items-center justify-center space-x-2"
                    >
                        <Edit2 size={16} />
                        <span>Edit</span>
                    </button>
                    <button
                        onClick={() => handleDelete(cert.id)}
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
      </div>
    </div>
  );
};

export default CertificatesManager;