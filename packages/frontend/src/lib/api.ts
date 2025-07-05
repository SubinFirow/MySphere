import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    // Add auth token if available
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle common errors
    if (error.response?.status === 401) {
      // Unauthorized - clear token and redirect to login
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

// API methods
export const apiClient = {
  // Health check
  health: () => api.get('/api/health'),
  
  // Auth endpoints
  auth: {
    login: (credentials: { email: string; password: string }) =>
      api.post('/api/auth/login', credentials),
    register: (userData: { name: string; email: string; password: string }) =>
      api.post('/api/auth/register', userData),
    logout: () => api.post('/api/auth/logout'),
    me: () => api.get('/api/auth/me'),
  },
  
  // User endpoints
  users: {
    getProfile: () => api.get('/api/users/profile'),
    updateProfile: (data: any) => api.put('/api/users/profile', data),
  },
};

export default api;
