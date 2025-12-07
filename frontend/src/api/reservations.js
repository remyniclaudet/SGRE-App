import api from './axios';

export const getReservations = async (filters = {}) => {
  const params = new URLSearchParams();
  Object.keys(filters).forEach(key => {
    if (filters[key]) params.append(key, filters[key]);
  });
  return api.get(`/reservations?${params.toString()}`);
};

export const getUserReservations = async (userId) => {
  return api.get(`/reservations/user/${userId}`);
};

export const getReservationById = async (id) => {
  return api.get(`/reservations/${id}`);
};

export const createReservation = async (reservationData) => {
  return api.post('/reservations', reservationData);
};

export const updateReservation = async (id, reservationData) => {
  return api.put(`/reservations/${id}`, reservationData);
};

export const changeReservationStatus = async (id, status) => {
  return api.patch(`/reservations/${id}/status`, { status });
};

export const cancelReservation = async (id) => {
  return api.delete(`/reservations/${id}`);
};