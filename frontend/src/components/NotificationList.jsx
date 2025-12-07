import React from 'react';
import { FaTimes, FaCheck, FaEnvelope, FaEnvelopeOpen, FaTrash, FaExclamationTriangle, FaCalendarCheck, FaInfoCircle } from 'react-icons/fa';

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
        return <FaExclamationTriangle className="text-yellow-500" />;
      case 'CONFIRMATION':
        return <FaCalendarCheck className="text-green-500" />;
      case 'EVENT':
        return <FaCalendarCheck className="text-blue-500" />;
      case 'SYSTEM':
        return <FaInfoCircle className="text-purple-500" />;
      default:
        return <FaEnvelope className="text-gray-500" />;
    }
  };

  const markAsRead = (id) => {
    console.log('Marquer comme lu:', id);
  };

  const deleteNotification = (id) => {
    console.log('Supprimer notification:', id);
  };

  const markAllAsRead = () => {
    console.log('Marquer toutes comme lues');
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="w-full sm:w-96">
      {/* Header */}
      <div className="p-4 border-b bg-gray-50">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold text-gray-900">
            Notifications {unreadCount > 0 && `(${unreadCount})`}
          </h3>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-xs text-primary-600 hover:text-primary-700"
              >
                Tout marquer comme lu
              </button>
            )}
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <FaTimes />
            </button>
          </div>
        </div>
      </div>

      {/* Notifications List */}
      <div className="max-h-96 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="p-8 text-center">
            <FaEnvelopeOpen className="text-4xl text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Aucune notification</p>
          </div>
        ) : (
          notifications.map(notification => (
            <div
              key={notification.id}
              className={`p-4 border-b hover:bg-gray-50 transition-colors ${
                !notification.read ? 'bg-blue-50' : ''
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-start gap-3 flex-1">
                  <div className={`p-2 rounded-full ${
                    !notification.read ? 'bg-blue-100' : 'bg-gray-100'
                  }`}>
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{notification.title}</h4>
                    <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                  </div>
                </div>
                <div className="flex gap-1">
                  {!notification.read && (
                    <button
                      onClick={() => markAsRead(notification.id)}
                      className="p-1 text-green-600 hover:bg-green-50 rounded"
                      title="Marquer comme lu"
                    >
                      <FaCheck size={14} />
                    </button>
                  )}
                  <button
                    onClick={() => deleteNotification(notification.id)}
                    className="p-1 text-red-600 hover:bg-red-50 rounded"
                    title="Supprimer"
                  >
                    <FaTrash size={14} />
                  </button>
                </div>
              </div>
              <div className="flex justify-between items-center mt-2">
                <span className="text-xs text-gray-500">
                  {notification.time}
                </span>
                {!notification.read && (
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                    Non lu
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t bg-gray-50">
        <button
          onClick={onClose}
          className="w-full text-center text-primary-600 hover:text-primary-700 font-medium"
        >
          Voir toutes les notifications
        </button>
      </div>
    </div>
  );
};

export default NotificationList;