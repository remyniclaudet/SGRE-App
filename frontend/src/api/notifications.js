import api from './axios';

export const getUserNotifications = async () => {
  return api.get('/notifications');
};

export const markAsRead = async (notificationId) => {
  return api.patch(`/notifications/${notificationId}/read`);
};

export const markAllAsRead = async () => {
  return api.patch('/notifications/read-all');
};

export const deleteNotification = async (notificationId) => {
  return api.delete(`/notifications/${notificationId}`);
};