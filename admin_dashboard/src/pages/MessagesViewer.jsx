import React, {
  useEffect,
  useState,
} from 'react';

import { format } from 'date-fns';
// ICONS
import {
  Check,
  Mail,
  Search,
  Trash2,
} from 'lucide-react';
import toast from 'react-hot-toast';

import { useApi } from '../hooks/useApi';

const MessagesViewer = () => {
  const { get, patch, del } = useApi();
  const [messages, setMessages] = useState([]);
  const [filteredMessages, setFilteredMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [filter, setFilter] = useState('all'); 
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchMessages();
  }, []);

  useEffect(() => {
    filterMessages();
  }, [messages, filter, searchTerm]);

  const fetchMessages = async () => {
    try {
      const response = await get('/messages');
      setMessages(response.data || []);
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterMessages = () => {
    let filtered = messages;

    if (filter === 'unread') {
      filtered = filtered.filter(msg => !msg.read);
    } else if (filter === 'read') {
      filtered = filtered.filter(msg => msg.read);
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(msg =>
        msg.name.toLowerCase().includes(term) ||
        msg.email.toLowerCase().includes(term) ||
        msg.message.toLowerCase().includes(term) ||
        (msg.subject && msg.subject.toLowerCase().includes(term))
      );
    }

    setFilteredMessages(filtered);
  };

  const handleMarkAsRead = async (id) => {
    try {
      await patch(`/messages/${id}/read`);
      toast.success('Message marked as read');
      fetchMessages();

      if (selectedMessage?.id === id) {
        setSelectedMessage(prev => ({ ...prev, read: true }));
      }
    } catch (error) {
      toast.error('Failed to mark message as read');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this message?')) return;

    try {
      await del(`/messages/${id}`);
      toast.success('Message deleted successfully');
      fetchMessages();
      if (selectedMessage?.id === id) setSelectedMessage(null);
    } catch (error) {
      toast.error('Failed to delete message');
    }
  };

  const handleSelectMessage = (message) => {
    setSelectedMessage(message);
    if (!message.read) handleMarkAsRead(message.id);
  };

  const unreadCount = messages.filter(msg => !msg.read).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Messages
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            View and manage contact form submissions
            {unreadCount > 0 && (
              <span className="ml-2 px-2 py-1 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-full text-sm font-medium">
                {unreadCount} unread
              </span>
            )}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* LEFT COLUMN: LIST */}
          <div className="lg:col-span-1 bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">

              {/* SEARCH */}
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input pl-10"
                  placeholder="Search messages..."
                />
              </div>

              {/* FILTER BUTTONS */}
              <div className="flex space-x-2">
                <button
                  onClick={() => setFilter('all')}
                  className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filter === 'all'
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  All ({messages.length})
                </button>

                <button
                  onClick={() => setFilter('unread')}
                  className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filter === 'unread'
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  Unread ({unreadCount})
                </button>

                <button
                  onClick={() => setFilter('read')}
                  className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filter === 'read'
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  Read ({messages.length - unreadCount})
                </button>
              </div>
            </div>

            <div className="overflow-y-auto" style={{ maxHeight: 'calc(100vh - 300px)' }}>
              {filteredMessages.length > 0 ? (
                filteredMessages.map(message => (
                  <div
                    key={message.id}
                    onClick={() => handleSelectMessage(message)}
                    className={`p-4 border-b border-gray-200 dark:border-gray-700 cursor-pointer transition-colors ${
                      selectedMessage?.id === message.id
                        ? 'bg-primary-50 dark:bg-primary-900/20'
                        : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                    } ${!message.read ? 'bg-blue-50 dark:bg-blue-900/10' : ''}`}
                  >
                    <div className="flex items-start justify-between mb-1">
                      <h4 className={`font-semibold text-gray-900 dark:text-white ${!message.read ? 'font-bold' : ''}`}>
                        {message.name}
                      </h4>
                      {!message.read && <div className="w-2 h-2 bg-blue-600 rounded-full"></div>}
                    </div>

                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{message.email}</p>

                    {message.subject && (
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{message.subject}</p>
                    )}

                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                      {message.message}
                    </p>

                    <p className="text-xs text-gray-500 mt-2">
                      {format(new Date(message.created_at), 'MMM dd, yyyy HH:mm')}
                    </p>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center">
                  <Mail size={48} className="mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600 dark:text-gray-400">No messages found</p>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN: DETAILS */}
          <div className="lg:col-span-2">
            {selectedMessage ? (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                      {selectedMessage.subject || 'No Subject'}
                    </h2>

                    <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                      <span className="font-medium">{selectedMessage.name}</span>
                      <span>•</span>

                      <a
                        href={`mailto:${selectedMessage.email}`}
                        className="text-primary-600 dark:text-primary-400 hover:underline"
                      >
                        {selectedMessage.email}
                      </a>

                      <span>•</span>
                      <span>{format(new Date(selectedMessage.created_at), 'MMM dd, yyyy HH:mm')}</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    {!selectedMessage.read && (
                      <button
                        onClick={() => handleMarkAsRead(selectedMessage.id)}
                        className="p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                        title="Mark as read"
                      >
                        <Check size={20} />
                      </button>
                    )}

                    <button
                      onClick={() => handleDelete(selectedMessage.id)}
                      className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                      title="Delete message"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>

                {/* CONTENT */}
                <div className="prose dark:prose-invert max-w-none">
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                    <p className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap">
                      {selectedMessage.message}
                    </p>
                  </div>
                </div>

                {/* REPLY */}
                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <a
                    href={`mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject || 'Your message'}`}
                    className="btn-primary inline-flex items-center space-x-2"
                  >
                    <Mail size={20} />
                    <span>Reply via Email</span>
                  </a>
                </div>
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-12 text-center">
                <Mail size={64} className="mx-auto text-gray-400 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  No Message Selected
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Select a message from the list to view its contents
                </p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default MessagesViewer;
