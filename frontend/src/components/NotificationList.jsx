import React, { useState, useEffect } from 'react';
import { FaTimes, FaCheck, FaEnvelope, FaEnvelopeOpen, FaTrash } from 'react-icons/fa';
import { markAsRead, deleteNotification } from '../api/notifications';

const NotificationList = ({ notifications = [], onClose }) => {
  const [localNotifications, setLocalNotifications] = useState(notifications);

  useEffect(() => {
    setLocalNotifications(notifications);
  }, [notifications]);

  const handleMarkAsRead = async (notificationId) => {
    try {
      await markAsRead(notificationId);
      setLocalNotifications(prev =>
        prev.map(notif =>
          notif.id === notificationId ? { ...notif, read_at: new Date().toISOString() } : notif
        )
      );
    } catch (error) {
      console.error('Erreur lors du marquage comme lu:', error);
    }
  };

  const handleDelete = async (notificationId) => {
    try {
      await deleteNotification(notificationId);
      setLocalNotifications(prev => prev.filter(notif => notif.id !== notificationId));
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
    }
  };

  const formatTime = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));

    if (diffInMinutes < 1) return 'À l\'instant';
    if (diffInMinutes < 60) return `Il y a ${diffInMinutes} min`;
    if (diffInMinutes < 1440) return `Il y a ${Math.floor(diffInMinutes / 60)} h`;
    
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short'
    });
  };

  const unreadCount = localNotifications.filter(n => !n.read_at).length;

  return (
    <div className="w-full sm:w-96">
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold text-gray-900">
            Notifications {unreadCount > 0 && `(${unreadCount})`}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <FaTimes />
          </button>
        </div>
      </div>

      {/* Notifications List */}
      <div className="max-h-96 overflow-y-auto">
        {localNotifications.length === 0 ? (
          <div className="p-8 text-center">
            <FaEnvelopeOpen className="text-4xl text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Aucune notification</p>
          </div>
        ) : (
          localNotifications.map(notification => (
            <div
              key={notification.id}
              className={`p-4 border-b hover:bg-gray-50 ${
                !notification.read_at ? 'bg-blue-50' : ''
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-start gap-3 flex-1">
                  <div className={`p-2 rounded-full ${
                    !notification.read_at ? 'bg-blue-100' : 'bg-gray-100'
                  }`}>
                    {!notification.read_at ? (
                      <FaEnvelope className="text-blue-600" />
                    ) : (
                      <FaEnvelopeOpen className="text-gray-600" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{notification.title}</h4>
                    <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                  </div>
                </div>
                <div className="flex gap-1">
                  {!notification.read_at && (
                    <button
                      onClick={() => handleMarkAsRead(notification.id)}
                      className="p-1 text-green-600 hover:bg-green-50 rounded"
                      title="Marquer comme lu"
                    >
                      <FaCheck size={14} />
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(notification.id)}
                    className="p-1 text-red-600 hover:bg-red-50 rounded"
                    title="Supprimer"
                  >
                    <FaTrash size={14} />
                  </button>
                </div>
              </div>
              <div className="flex justify-between items-center mt-2">
                <span className="text-xs text-gray-500">
                  {formatTime(notification.created_at)}
                </span>
                {!notification.read_at && (
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
      <div className="p-4 border-t">
        <a
          href="/notifications"
          className="block text-center text-primary-600 hover:text-primary-700 font-medium"
          onClick={onClose}
        >
          Voir toutes les notifications
        </a>
      </div>
    </div>
  );
};

export default NotificationList;