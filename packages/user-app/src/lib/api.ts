import axios from "axios";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem("token");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export const api = {
  // Expenses
  expenses: {
    getAll: () => apiClient.get("/expenses"),
    getStats: () => apiClient.get("/expenses/stats"),
    getSummary: () => apiClient.get("/expenses/summary"),
  },

  // Workouts
  workouts: {
    getAll: () => apiClient.get("/workouts"),
    getStats: () => apiClient.get("/workouts/stats"),
  },

  // Body Weight
  bodyWeight: {
    getAll: () => apiClient.get("/body-weight"),
    getStats: () => apiClient.get("/body-weight/stats"),
  },

  // Wholesale
  wholesale: {
    getAll: () => apiClient.get("/wholesale"),
    analytics: {
      getStats: () => apiClient.get("/wholesale/analytics/stats"),
    },
  },
};

export default apiClient;
