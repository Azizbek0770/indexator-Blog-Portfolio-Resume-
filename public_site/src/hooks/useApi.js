import { useState, useEffect } from 'react';
import api from '../utils/api';

export const useApi = (endpoint) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [info, setInfo] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const startedAt = Date.now();
      const baseURL = api.defaults.baseURL || '';
      const url = `${baseURL}${endpoint || ''}`;
      try {
        setLoading(true);
        const response = await api.get(endpoint);
        const payload = response?.data?.data;
        setData(payload);
        setError(null);
        setInfo({
          url,
          endpoint,
          status: response.status,
          ok: true,
          startedAt,
          finishedAt: Date.now(),
          durationMs: Date.now() - startedAt,
          length: Array.isArray(payload) ? payload.length : undefined
        });
      } catch (err) {
        const status = err?.response?.status;
        const message = err?.response?.data?.message || err.message;
        setError(message);
        console.error('API Error:', err);
        setInfo({
          url,
          endpoint,
          status,
          ok: false,
          errorMessage: message,
          startedAt,
          finishedAt: Date.now(),
          durationMs: Date.now() - startedAt
        });
      } finally {
        setLoading(false);
      }
    };

    if (endpoint) {
      fetchData();
    }
  }, [endpoint]);

  return { data, loading, error, info };
};

export const useApiPost = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const post = async (endpoint, data) => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.post(endpoint, data);
      setLoading(false);
      return response.data;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  };

  return { post, loading, error };
};
