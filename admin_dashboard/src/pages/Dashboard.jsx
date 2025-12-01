import React, {
  useEffect,
  useState,
} from 'react';

import {
  Award,
  Briefcase,
  Eye,
  FileText,
  FolderOpen,
  Mail,
  TrendingUp,
  Users,
} from 'lucide-react';
import toast from 'react-hot-toast';

import AnalyticsWidget from '../components/AnalyticsWidget';
import { useApi } from '../hooks/useApi';
import { useWebSocket } from '../hooks/useWebsocket';

const Dashboard = () => {
  const { get } = useApi();
  const [stats, setStats] = useState({
    projects: 0,
    blogPosts: 0,
    messages: 0,
    unreadMessages: 0,
    skills: 0,
    experience: 0,
    testimonials: 0,
    services: 0
  });
  const [recentMessages, setRecentMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleWebSocketMessage = (data) => {
    if (data.type === 'content_update') {
      toast.success(`${data.contentType} ${data.action}d`);
      fetchStats();
    }
  };

  const { connected } = useWebSocket(handleWebSocketMessage);

  useEffect(() => {
    fetchStats();
    fetchRecentMessages();
  }, []);

  const fetchStats = async () => {
    try {
      const [projects, blog, skills, experience, testimonials, services, messageStats] = await Promise.all([
        get('/projects'),
        get('/blog'),
        get('/skills'),
        get('/experience'),
        get('/testimonials'),
        get('/services'),
        get('/messages/stats/count')
      ]);

      setStats({
        projects: projects.data?.length || 0,
        blogPosts: blog.data?.length || 0,
        skills: skills.data?.length || 0,
        experience: experience.data?.length || 0,
        testimonials: testimonials.data?.length || 0,
        services: services.data?.length || 0,
        messages: messageStats.data?.total || 0,
        unreadMessages: messageStats.data?.unread || 0
      });
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRecentMessages = async () => {
    try {
      const response = await get('/messages?read=false');
      setRecentMessages(response.data?.slice(0, 5) || []);
    } catch (error) {
      console.error('Failed to fetch messages:', error);
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
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Welcome back! Here's what's happening with your portfolio.
        </p>
        {connected && (
          <div className="mt-2 inline-flex items-center space-x-2 text-sm text-green-600 dark:text-green-400">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>Live updates active</span>
          </div>
        )}
      </div>

      {/* Analytics Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <AnalyticsWidget
          title="Total Projects"
          value={stats.projects}
          change={12}
          icon={FolderOpen}
          color="primary"
        />
        <AnalyticsWidget
          title="Blog Posts"
          value={stats.blogPosts}
          change={8}
          icon={FileText}
          color="green"
        />
        <AnalyticsWidget
          title="Unread Messages"
          value={stats.unreadMessages}
          change={-5}
          icon={Mail}
          color="orange"
        />
        <AnalyticsWidget
          title="Total Skills"
          value={stats.skills}
          change={15}
          icon={Award}
          color="purple"
        />
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Experience</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.experience}</p>
            </div>
            <Briefcase className="text-blue-500" size={32} />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Testimonials</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.testimonials}</p>
            </div>
            <Users className="text-purple-500" size={32} />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Services</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.services}</p>
            </div>
            <TrendingUp className="text-green-500" size={32} />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Messages</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.messages}</p>
            </div>
            <Eye className="text-orange-500" size={32} />
          </div>
        </div>
      </div>

      {/* Recent Messages */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          Recent Unread Messages
        </h2>
        {recentMessages.length > 0 ? (
          <div className="space-y-4">
            {recentMessages.map((message) => (
              <div
                key={message.id}
                className="border-b border-gray-200 dark:border-gray-700 pb-4 last:border-0"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {message.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {message.email}
                    </p>
                    <p className="text-sm text-gray-700 dark:text-gray-300 mt-2">
                      {message.message.substring(0, 100)}
                      {message.message.length > 100 ? '...' : ''}
                    </p>
                  </div>
                  <span className="text-xs text-gray-500">
                    {new Date(message.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600 dark:text-gray-400 text-center py-8">
            No unread messages
          </p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;