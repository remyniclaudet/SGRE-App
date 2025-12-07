import api from './axios';

export const getUsers = async () => {
  return api.get('/users');
};

export const getUserById = async (id) => {
  return api.get(`/users/${id}`);
};

export const updateUser = async (id, userData) => {
  return api.put(`/users/${id}`, userData);
};

export const changeUserRole = async (id, role) => {
  return api.patch(`/users/${id}/role`, { role });
};