import api from './axios';

export const getEvents = async (filters = {}) => {
  const params = new URLSearchParams();
  Object.keys(filters).forEach(key => {
    if (filters[key]) params.append(key, filters[key]);
  });
  return api.get(`/events?${params.toString()}`);
};

export const getEventById = async (id) => {
  return api.get(`/events/${id}`);
};

export const createEvent = async (eventData) => {
  return api.post('/events', eventData);
};

export const updateEvent = async (id, eventData) => {
  return api.put(`/events/${id}`, eventData);
};

export const deleteEvent = async (id) => {
  return api.delete(`/events/${id}`);
};

export const addParticipant = async (eventId, userId) => {
  return api.post(`/events/${eventId}/participants`, { user_id: userId });
};

export const removeParticipant = async (eventId, userId) => {
  return api.delete(`/events/${eventId}/participants/${userId}`);
};