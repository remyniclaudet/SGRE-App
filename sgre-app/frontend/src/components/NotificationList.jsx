// filepath: /media/kakureta/part1/Projet/sgre-app/frontend/src/components/NotificationList.jsx
import React from 'react';

const NotificationList = ({ onClose }) => {
  const notifications = [
    {
      id: 1,
      title: 'Nouvelle réservation',
      message: 'Une nouvelle réservation nécessite votre validation',
      type: 'RESERVATION',
      read: false,
      time: '5 min'
    },
    {
      id: 2,
      title: 'Réservation confirmée',
      message: 'Votre réservation pour la Salle A a été confirmée',
      type: 'CONFIRMATION',
      read: false,
      time: '1 heure'
    },
    {
      id: 3,
      title: 'Événement modifié',
      message: 'L\'événement "Conférence Annuelle" a été modifié',
      type: 'EVENT',
      read: true,
      time: '3 heures'
    },
    {
      id: 4,
      title: 'Maintenance prévue',
      message: 'Maintenance système prévue ce weekend',
      type: 'SYSTEM',
      read: true,
      time: '1 jour'
    }
  ];

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'RESERVATION':
        return '📅';
      case 'CONFIRMATION':
        return '✅';
      case 'EVENT':
        return '📊';
      case 'SYSTEM':
        return '⚙️';
      default:
        return '🔔';
    }
  };

  const markAsRead = (id) => {
    // Logic to mark notification as read
  };

  const deleteNotification = (id) => {
    // Logic to delete notification
  };

  const markAllAsRead = () => {
    // Logic to mark all notifications as read
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div>
      <h2>Notifications ({unreadCount})</h2>
      <ul>
        {notifications.map(notification => (
          <li key={notification.id}>
            <span>{getNotificationIcon(notification.type)} {notification.title}</span>
            <p>{notification.message}</p>
            <small>{notification.time}</small>
            <button onClick={() => markAsRead(notification.id)}>Mark as Read</button>
            <button onClick={() => deleteNotification(notification.id)}>Delete</button>
          </li>
        ))}
      </ul>
      <button onClick={onClose}>Close</button>
    </div>
  );
};

export default NotificationList;