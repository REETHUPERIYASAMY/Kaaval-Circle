// src/services/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: '/api'
});

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
  const response = await api.put(`/complaints/${id}`, { status });
  return response.data;
};

// SOS API
export const createSOSAlert = async (locationData) => {
  const response = await api.post('/sos', { location: locationData });
  return response.data;
};

export const getSOSAlerts = async () => {
  const response = await api.get('/sos');
  return response.data;
};

export const updateSOSStatus = async (id, status) => {
  const response = await api.put(`/sos/${id}`, { status });
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