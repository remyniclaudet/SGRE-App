import api from './axios';

export const login = async (credentials) => {
  return api.post('/auth/login', credentials);
};

export const register = async (userData) => {
  return api.post('/auth/register', userData);
};

export const getCurrentUser = async () => {
  return api.get('/auth/me');
};