// src/services/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api' // Explicitly set the backend URL
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    // Handle common errors (like 401 Unauthorized) globally if needed
    if (error.response && error.response.status === 401) {
      // Token expired or invalid, logout user
      localStorage.removeItem('token');
      window.location.href = '/'; // Redirect to login page
    }
    return Promise.reject(error);
  }
);

// Auth API
export const loginUser = async (email, password, userType) => {
  const response = await api.post('/auth/login', { email, password, userType });
  return response.data;
};

export const registerUser = async (userData) => {
  const response = await api.post('/auth/register', userData);
  return response.data;
};

// Complaint API
export const createComplaint = async (complaintData) => {
  const response = await api.post('/complaints', complaintData);
  return response.data;
};

export const getComplaints = async () => {
  const response = await api.get('/complaints');
  return response.data;
};

export const updateComplaintStatus = async (id, status) => {
  const response = await api.patch(`/complaints/${id}/status`, { status });
  return response.data;
};

// SOS API
export const createSOSAlert = async (data) => {
  const response = await api.post('/sos',data);
  return response.data;
};

export const getSOSAlerts = async () => {
  const response = await api.get('/sos');
  return response.data;
};

export const updateSOSStatus = async (id, status) => {
  const response = await api.patch(`/sos/${id}/status`, { status });
  return response.data;
};

// Analytics API
export const getDashboardStats = async () => {
  const response = await api.get('/analytics/dashboard');
  return response.data;
};

export const getCrimeHotspots = async (lat, lng) => {
  const response = await api.get(`/analytics/hotspots?lat=${lat}&lng=${lng}`);
  return response.data;
};

export const getCrimeCategories = async () => {
  const response = await api.get('/analytics/categories');
  return response.data;
};

export const getMonthlyTrends = async () => {
  const response = await api.get('/analytics/monthly-trends');
  return response.data;
};

export default api;