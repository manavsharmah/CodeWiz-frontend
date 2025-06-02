import axios from 'axios';

// API base URL
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Add request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        const response = await api.post('/auth/token/refresh/', {
          refresh: refreshToken,
        });

        const { access } = response.data;
        localStorage.setItem('accessToken', access);
        originalRequest.headers.Authorization = `Bearer ${access}`;
        return api(originalRequest);
      } catch (error) {
        // Handle refresh token error
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  }
);

// Types
export interface Project {
  id: string;
  name: string;
  description?: string;
  main_language: string;
  created_at: string;
  updated_at: string;
}

export interface FileSystemItem {
  id: string;
  name: string;
  item_type: 'file' | 'folder';
  content?: string;
  parent?: string | null;
  project: string;
  file_extension?: string;
  size: number;
  path: string;
  created_at: string;
  updated_at: string;
  children?: FileSystemItem[];
}

export interface CreateItemData {
  name: string;
  item_type: 'file' | 'folder';
  project_id: string;
  parent_id?: string | null;
  content?: string;
}

export interface UpdateItemData {
  name?: string;
  content?: string;
}

// Project API
export const projectApi = {
  getAll: () => api.get<Project[]>('/api/projects/'),
  get: (id: string) => api.get<Project>(`/api/projects/${id}/`),
  create: (data: Partial<Project>) => api.post<Project>('/api/projects/', data),
  update: (id: string, data: Partial<Project>) => api.patch<Project>(`/api/projects/${id}/`, data),
  delete: (id: string) => api.delete(`/api/projects/${id}/`),
  getTree: (id: string) => api.get<{ tree: FileSystemItem[] }>(`/api/projects/${id}/tree/`),
};

// File System API
export const fileSystemApi = {
  getByProject: (projectId: string) => api.get<FileSystemItem[]>(`/api/files/`, {
    params: { project: projectId }
  }),
  get: (id: string) => api.get<FileSystemItem>(`/api/files/${id}/`),
  create: (data: CreateItemData) => api.post<FileSystemItem>('/api/files/', {
    name: data.name,
    item_type: data.item_type,
    content: data.content,
    parent_id: data.parent_id,
    project_id: data.project_id
  }),
  update: (id: string, data: UpdateItemData) => api.patch<FileSystemItem>(`/api/files/${id}/`, data),
  delete: (id: string) => api.delete(`/api/files/${id}/`),
  execute: (id: string) => api.post<{ output: string }>(`/api/files/${id}/execute/`),
};

// Utility functions
export const getLanguageFromExtension = (filename: string): string => {
  const extension = filename.split('.').pop()?.toLowerCase();
  const languageMap: { [key: string]: string } = {
    'py': 'python',
    'js': 'javascript',
    'ts': 'typescript',
    'jsx': 'javascript',
    'tsx': 'typescript',
    'html': 'html',
    'css': 'css',
    'json': 'json',
    'md': 'markdown',
    'txt': 'text',
  };
  return languageMap[extension || ''] || 'text';
};

export const getFileIcon = (filename: string, isFolder: boolean = false): string => {
  if (isFolder) return '📁';
  
  const extension = filename.split('.').pop()?.toLowerCase();
  const iconMap: { [key: string]: string } = {
    'py': '🐍',
    'js': '📜',
    'ts': '📜',
    'jsx': '⚛️',
    'tsx': '⚛️',
    'html': '🌐',
    'css': '🎨',
    'json': '📋',
    'md': '📝',
    'txt': '📄',
  };
  return iconMap[extension || ''] || '📄';
};

export default api; 