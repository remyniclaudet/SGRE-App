import api from './axios';

export const getResources = async (filters = {}) => {
  const params = new URLSearchParams();
  Object.keys(filters).forEach(key => {
    if (filters[key]) params.append(key, filters[key]);
  });
  return api.get(`/resources?${params.toString()}`);
};

export const getResourceById = async (id) => {
  return api.get(`/resources/${id}`);
};

export const createResource = async (resourceData) => {
  return api.post('/resources', resourceData);
};

export const updateResource = async (id, resourceData) => {
  return api.put(`/resources/${id}`, resourceData);
};

export const deleteResource = async (id) => {
  return api.delete(`/resources/${id}`);
};

export const checkAvailability = async (id, startAt, endAt) => {
  return api.get(`/resources/${id}/availability`, {
    params: { start_at: startAt, end_at: endAt }
  });
};