// frontend/src/services/api.js

import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:4000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Example of an API call
export const fetchResources = async () => {
  const response = await api.get('/resources');
  return response.data;
};

// Example of an API call
export const fetchEvents = async () => {
  const response = await api.get('/events');
  return response.data;
};

// Example of an API call
export const loginUser = async (credentials) => {
  const response = await api.post('/auth/login', credentials);
  return response.data;
};

// Example of an API call
export const registerUser = async (userData) => {
  const response = await api.post('/auth/register', userData);
  return response.data;
};

// Add more API calls as needed

export default api;