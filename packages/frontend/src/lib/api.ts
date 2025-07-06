import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4001";

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    // Add auth token if available
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token && config.headers) {
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
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

// API methods
export const apiClient = {
  // Health check
  health: () => api.get("/api/health"),

  // Auth endpoints
  auth: {
    login: (credentials: { email: string; password: string }) =>
      api.post("/api/auth/login", credentials),
    register: (userData: { name: string; email: string; password: string }) =>
      api.post("/api/auth/register", userData),
    logout: () => api.post("/api/auth/logout"),
    me: () => api.get("/api/auth/me"),
  },

  // User endpoints
  users: {
    getProfile: () => api.get("/api/users/profile"),
    updateProfile: (data: Record<string, unknown>) =>
      api.put("/api/users/profile", data),
  },

  // Expense endpoints
  expenses: {
    getAll: (params?: Record<string, unknown>) =>
      api.get("/api/expenses", { params }),
    getById: (id: string) => api.get(`/api/expenses/${id}`),
    create: (data: Record<string, unknown>) => api.post("/api/expenses", data),
    update: (id: string, data: Record<string, unknown>) =>
      api.put(`/api/expenses/${id}`, data),
    delete: (id: string) => api.delete(`/api/expenses/${id}`),
    getCategories: () => api.get("/api/expenses/categories/list"),
    getPaymentTypes: () => api.get("/api/expenses/payment-types/list"),

    // Analytics endpoints
    analytics: {
      getSummary: (period?: string) =>
        api.get("/api/expenses/analytics/summary", { params: { period } }),
      getTrends: (months?: number) =>
        api.get("/api/expenses/analytics/trends", { params: { months } }),
      getTopCategories: (period?: string, limit?: number) =>
        api.get("/api/expenses/analytics/top-categories", {
          params: { period, limit },
        }),
      getStats: () => api.get("/api/expenses/analytics/stats"),
    },
  },

  // Body Weight endpoints
  bodyWeight: {
    getAll: (params?: Record<string, unknown>) =>
      api.get("/api/body-weight", { params }),
    getById: (id: string) => api.get(`/api/body-weight/${id}`),
    create: (data: Record<string, unknown>) =>
      api.post("/api/body-weight", data),
    update: (id: string, data: Record<string, unknown>) =>
      api.put(`/api/body-weight/${id}`, data),
    delete: (id: string) => api.delete(`/api/body-weight/${id}`),
    getRecent: () => api.get("/api/body-weight/recent"),

    // Analytics endpoints
    analytics: {
      getSummary: (period?: string) =>
        api.get("/api/body-weight/analytics/summary", { params: { period } }),
      getTrends: (period?: string, limit?: number) =>
        api.get("/api/body-weight/analytics/trends", {
          params: { period, limit },
        }),
      getStats: () => api.get("/api/body-weight/analytics/stats"),
    },
  },
};

export default apiClient;
