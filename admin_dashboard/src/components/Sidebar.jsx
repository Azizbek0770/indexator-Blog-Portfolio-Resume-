import React, { useState } from 'react';

import {
  Award,
  Briefcase,
  FileText,
  FolderOpen,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Mail,
  Menu,
  MessageSquare,
  Moon,
  Settings,
  Sparkles,
  Sun,
  User,
  Wrench,
  X,
} from 'lucide-react';
import toast from 'react-hot-toast';
import {
  NavLink,
  useNavigate,
} from 'react-router-dom';

import { ADMIN_ROUTE } from '../utils/constants';

const Sidebar = ({ darkMode, toggleDarkMode }) => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    toast.success('Logged out successfully');
    navigate(`${ADMIN_ROUTE}/login`);
  };

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '' },
    { icon: Sparkles, label: 'Hero Section', path: '/hero' },
    { icon: User, label: 'About Me', path: '/about' },
    { icon: Award, label: 'Skills', path: '/skills' },
    { icon: Briefcase, label: 'Experience', path: '/experience' },
    { icon: GraduationCap, label: 'Education', path: '/education' },
    { icon: FileText, label: 'Certificates', path: '/certificates' },
    { icon: FolderOpen, label: 'Projects', path: '/projects' },
    { icon: Wrench, label: 'Services', path: '/services' },
    { icon: MessageSquare, label: 'Testimonials', path: '/testimonials' },
    { icon: FileText, label: 'Blog', path: '/blog' },
    { icon: Mail, label: 'Messages', path: '/messages' },
    { icon: Settings, label: 'Settings', path: '/settings' }
  ];

  return (
    <div
      className={`${
        collapsed ? 'w-20' : 'w-64'
      } bg-white dark:bg-gray-800 shadow-lg transition-all duration-300 flex flex-col`}
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
        {!collapsed && (
          <h1 className="text-xl font-bold text-gray-800 dark:text-white">
            Admin Panel
          </h1>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          {collapsed ? <Menu size={20} /> : <X size={20} />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={`${ADMIN_ROUTE}${item.path}`}
            className={({ isActive }) =>
              `flex items-center px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-primary-50 dark:hover:bg-gray-700 transition-colors ${
                isActive ? 'bg-primary-100 dark:bg-gray-700 text-primary-600 dark:text-primary-400 border-r-4 border-primary-600' : ''
              }`
            }
          >
            <item.icon size={20} className="flex-shrink-0" />
            {!collapsed && <span className="ml-3">{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
        <button
          onClick={toggleDarkMode}
          className="w-full flex items-center px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
        >
          {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          {!collapsed && <span className="ml-3">{darkMode ? 'Light' : 'Dark'} Mode</span>}
        </button>
        
        <button
          onClick={handleLogout}
          className="w-full flex items-center px-4 py-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
        >
          <LogOut size={20} />
          {!collapsed && <span className="ml-3">Logout</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;