import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { 
  getUserNotifications, 
  markAsRead, 
  markAllAsRead,
  deleteNotification 
} from '../api/notifications';
import { FaBell, FaCheck, FaTrash, FaEnvelope, FaEnvelopeOpen } from 'react-icons/fa';

const Notifications = () => {
  const { user } = useContext(AuthContext);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // 'all', 'unread', 'read'

  useEffect(() => {
    if (user) {
      fetchNotifications();
      // Polling toutes les 10 secondes
      const interval = setInterval(fetchNotifications, 10000);
      return () => clearInterval(interval);
    }
  }, [user, filter]);

  const fetchNotifications = async () => {
    try {
      const response = await getUserNotifications();
      setNotifications(response.notifications || []);
    } catch (error) {
      console.error('Erreur lors du chargement des notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      await markAsRead(notificationId);
      fetchNotifications();
    } catch (error) {
      console.error('Erreur lors du marquage comme lu:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead();
      fetchNotifications();
    } catch (error) {
      console.error('Erreur lors du marquage de tous comme lus:', error);
    }
  };

  const handleDeleteNotification = async (notificationId) => {
    try {
      await deleteNotification(notificationId);
      fetchNotifications();
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
    }
  };

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'unread') return !notification.read_at;
    if (filter === 'read') return notification.read_at;
    return true;
  });

  const unreadCount = notifications.filter(n => !n.read_at).length;

  const formatDate = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));

    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now - date) / (1000 * 60));
      return `Il y a ${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''}`;
    } else if (diffInHours < 24) {
      return `Il y a ${diffInHours} heure${diffInHours > 1 ? 's' : ''}`;
    } else {
      return date.toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-600">Chargement des notifications...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
          <p className="text-gray-600 mt-2">
            Restez informé des mises à jour et des activités
          </p>
        </div>
        <div className="flex items-center gap-4">
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              className="btn btn-secondary flex items-center gap-2"
            >
              <FaCheck />
              Tout marquer comme lu
            </button>
          )}
          <div className="relative">
            <FaBell className="text-2xl text-gray-600" />
            {unreadCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="card p-6">
        <div className="flex gap-4">
          <button
            onClick={() => setFilter('all')}
            className={`btn ${filter === 'all' ? 'btn-primary' : 'btn-outline'}`}
          >
            Toutes ({notifications.length})
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`btn ${filter === 'unread' ? 'btn-primary' : 'btn-outline'}`}
          >
            Non lues ({unreadCount})
          </button>
          <button
            onClick={() => setFilter('read')}
            className={`btn ${filter === 'read' ? 'btn-primary' : 'btn-outline'}`}
          >
            Lues ({notifications.length - unreadCount})
          </button>
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-4">
        {filteredNotifications.length === 0 ? (
          <div className="text-center py-12">
            <FaBell className="text-4xl text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {filter === 'unread' 
                ? 'Aucune notification non lue' 
                : 'Aucune notification'}
            </h3>
            <p className="text-gray-500">
              {filter === 'unread'
                ? 'Vous êtes à jour !'
                : 'Vous n\'avez pas encore de notifications'
              }
            </p>
          </div>
        ) : (
          filteredNotifications.map(notification => (
            <div
              key={notification.id}
              className={`card p-6 ${!notification.read_at ? 'border-l-4 border-primary-500' : ''}`}
            >
              <div className="flex justify-between items-start">
                <div className="flex items-start gap-4 flex-1">
                  <div className={`p-3 rounded-lg ${!notification.read_at ? 'bg-primary-100' : 'bg-gray-100'}`}>
                    {!notification.read_at ? (
                      <FaEnvelope className="text-primary-600" />
                    ) : (
                      <FaEnvelopeOpen className="text-gray-600" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-1">{notification.title}</h3>
                    <p className="text-gray-600 mb-2">{notification.message}</p>
                    <span className="text-sm text-gray-500">
                      {formatDate(notification.created_at)}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  {!notification.read_at && (
                    <button
                      onClick={() => handleMarkAsRead(notification.id)}
                      className="btn btn-outline p-2"
                      title="Marquer comme lu"
                    >
                      <FaCheck />
                    </button>
                  )}
                  <button
                    onClick={() => handleDeleteNotification(notification.id)}
                    className="btn btn-outline p-2 text-red-600 hover:text-red-700"
                    title="Supprimer"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Notification Types */}
      <div className="card p-6">
        <h2 className="text-lg font-semibold mb-4">Types de notifications</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold text-blue-700 mb-2">Réservations</h3>
            <ul className="text-sm text-blue-600 space-y-1">
              <li>• Confirmation de réservation</li>
              <li>• Conflit de réservation</li>
              <li>• Annulation de réservation</li>
            </ul>
          </div>
          <div className="p-4 bg-green-50 rounded-lg">
            <h3 className="font-semibold text-green-700 mb-2">Événements</h3>
            <ul className="text-sm text-green-600 space-y-1">
              <li>• Modification d'événement</li>
              <li>• Rappel d'événement</li>
              <li>• Nouveau participant</li>
            </ul>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg">
            <h3 className="font-semibold text-purple-700 mb-2">Système</h3>
            <ul className="text-sm text-purple-600 space-y-1">
              <li>• Bienvenue</li>
              <li>• Mises à jour système</li>
              <li>• Notifications d'administration</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notifications;