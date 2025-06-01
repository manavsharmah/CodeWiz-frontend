import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use(async (config) => {
  // Get access token from localStorage
  const token = localStorage.getItem('accessToken');
  
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If the error is 401 and we haven't tried to refresh the token yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Try to refresh the token
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          const response = await api.post('/auth/token/refresh/', {
            refresh: refreshToken
          });
          const { access } = response.data;
          localStorage.setItem('accessToken', access);
          
          // Update the original request with the new token
          originalRequest.headers['Authorization'] = `Bearer ${access}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // If refresh fails, clear tokens and redirect to login
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

// Project APIs
export const projectApi = {
  getAll: () => api.get('/projects/'),
  getById: (id: string) => api.get(`/projects/${id}/`),
  create: (data: any) => api.post('/projects/', data),
  update: (id: string, data: any) => api.patch(`/projects/${id}/`, data),
  delete: (id: string) => api.delete(`/projects/${id}/`),
  getTree: (id: string) => api.get(`/projects/${id}/tree/`),
};

// File System APIs
export const fileSystemApi = {
  getAll: () => api.get('/files/'),
  getById: (id: string) => api.get(`/files/${id}/`),
  create: (data: any) => api.post('/create_item/', data),
  update: (id: string, data: any) => api.patch(`/files/${id}/`, data),
  delete: (id: string) => api.delete(`/files/${id}/`),
  execute: (id: string, data: any) => api.post(`/files/${id}/execute/`, data),
};

// Code Execution APIs
export const codeExecutionApi = {
  execute: (data: any) => api.post('/execute_code_enhanced/', data),
  getHistory: (projectId: string) => api.get(`/projects/${projectId}/executions/`),
};

export default api; 