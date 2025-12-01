import React, {
  useEffect,
  useState,
} from 'react';

import { Toaster } from 'react-hot-toast';
import {
  Navigate,
  Route,
  Routes,
} from 'react-router-dom';

import ProtectedRoute from './components/ProtectedRoute';
import Sidebar from './components/Sidebar';
import { useAuth } from './hooks/useAuth';
import AboutManager from './pages/AboutManager';
import BlogManager from './pages/BlogManager';
import CertificatesManager from './pages/CertificatesManager';
import Dashboard from './pages/Dashboard';
import EducationManager from './pages/EducationManager';
import ExperienceManager from './pages/ExperienceManager';
import HeroManager from './pages/HeroManager';
import Login from './pages/Login';
import MessagesViewer from './pages/MessagesViewer';
import ProjectsManager from './pages/ProjectsManager';
import ServicesManager from './pages/ServicesManager';
import SettingsManager from './pages/SettingsManager';
import SkillsManager from './pages/SkillsManager';
import TestimonialsManager from './pages/TestimonialsManager';

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const { isAuthenticated, loading } = useAuth();

  useEffect(() => {
    const isDark = localStorage.getItem('darkMode') === 'true';
    setDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem('darkMode', newMode.toString());
    if (newMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const adminRoute = import.meta.env.VITE_ADMIN_ROUTE || '/curbadmin0270';

  return (
    <div className={darkMode ? 'dark' : ''}>
      <Toaster position="top-right" />
      
      <Routes>
        <Route path={`${adminRoute}/login`} element={<Login />} />
        
        <Route
          path={`${adminRoute}/*`}
          element={
            <ProtectedRoute>
              <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
                <Sidebar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
                <div className="flex-1 overflow-auto">
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/hero" element={<HeroManager />} />
                    <Route path="/about" element={<AboutManager />} />
                    <Route path="/skills" element={<SkillsManager />} />
                    <Route path="/experience" element={<ExperienceManager />} />
                    <Route path="/education" element={<EducationManager />} />
                    <Route path="/certificates" element={<CertificatesManager />} />
                    <Route path="/projects" element={<ProjectsManager />} />
                    <Route path="/services" element={<ServicesManager />} />
                    <Route path="/testimonials" element={<TestimonialsManager />} />
                    <Route path="/blog" element={<BlogManager />} />
                    <Route path="/messages" element={<MessagesViewer />} />
                    <Route path="/settings" element={<SettingsManager />} />
                  </Routes>
                </div>
              </div>
            </ProtectedRoute>
          }
        />
        
        <Route path="*" element={<Navigate to={`${adminRoute}/login`} replace />} />
      </Routes>
    </div>
  );
}

export default App;