import {
  useCallback,
  useState,
} from 'react';

import toast from 'react-hot-toast';

import api from '../utils/api';

export const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const request = useCallback(async (method, endpoint, data = null, config = {}) => {
    setLoading(true);
    setError(null);

    try {
      let response;
      switch (method.toLowerCase()) {
        case 'get':
          response = await api.get(endpoint, config);
          break;
        case 'post':
          response = await api.post(endpoint, data, config);
          break;
        case 'put':
          response = await api.put(endpoint, data, config);
          break;
        case 'patch':
          response = await api.patch(endpoint, data, config);
          break;
        case 'delete':
          response = await api.delete(endpoint, config);
          break;
        default:
          throw new Error(`Unsupported method: ${method}`);
      }

      setLoading(false);
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'An error occurred';
      setError(errorMessage);
      setLoading(false);
      toast.error(errorMessage);
      throw err;
    }
  }, []);

  const get = useCallback((endpoint, config) => request('get', endpoint, null, config), [request]);
  const post = useCallback((endpoint, data, config) => request('post', endpoint, data, config), [request]);
  const put = useCallback((endpoint, data, config) => request('put', endpoint, data, config), [request]);
  const patch = useCallback((endpoint, data, config) => request('patch', endpoint, data, config), [request]);
  const del = useCallback((endpoint, config) => request('delete', endpoint, null, config), [request]);

  return { loading, error, get, post, put, patch, del };
};