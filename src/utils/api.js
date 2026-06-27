import axios from 'axios';

export const BACKEND_URL = import.meta.env.VITE_BACKEND_URL ?? '';

const api = axios.create({
  baseURL: BACKEND_URL,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('soniq_access_token');
  if (token) config.headers['Authorization'] = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('soniq_access_token');
      localStorage.removeItem('soniq_user_profile');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
