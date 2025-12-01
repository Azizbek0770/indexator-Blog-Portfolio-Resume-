import {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';

import toast from 'react-hot-toast';

import api from '../utils/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    verifyToken();
  }, []);

  const verifyToken = async () => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const response = await api.get('/auth/verify');
      if (response.data.status === 'success') {
        setUser(response.data.data);
      } else {
        localStorage.removeItem('adminToken');
      }
    } catch (error) {
      localStorage.removeItem('adminToken');
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      if (response.data.status === 'success') {
        localStorage.setItem('adminToken', response.data.data.token);
        setUser(response.data.data.user);
        toast.success('Login successful!');
        return true;
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('adminToken');
    setUser(null);
    toast.success('Logged out successfully');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    const token = localStorage.getItem('adminToken');
    return {
      user: null,
      loading: false,
      isAuthenticated: !!token,
      login: async () => false,
      logout: () => {}
    };
  }
  return context;
};
