import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaCalendarAlt, 
  FaBuilding, 
  FaCheckCircle,
  FaClock,
  FaBell,
  FaHistory
} from 'react-icons/fa';
import { AuthContext } from '../context/AuthContext';
import { getUserReservations } from '../api/reservations';
import { getEvents } from '../api/events';
import { getUserNotifications } from '../api/notifications';

const DashboardClient = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState({
    upcomingReservations: 0,
    totalReservations: 0,
    events: 0,
    unreadNotifications: 0
  });
  const [upcomingReservations, setUpcomingReservations] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [recentNotifications, setRecentNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      const [reservationsRes, eventsRes, notificationsRes] = await Promise.all([
        getUserReservations(user.id),
        getEvents({ status: 'SCHEDULED', start_date: new Date().toISOString() }),
        getUserNotifications()
      ]);

      const upcomingRes = reservationsRes.reservations?.filter(
        r => new Date(r.start_at) > new Date() && r.status === 'CONFIRMED'
      ) || [];

      setStats({
        upcomingReservations: upcomingRes.length,
        totalReservations: reservationsRes.count || 0,
        events: eventsRes.count || 0,
        unreadNotifications: notificationsRes.unread_count || 0
      });

      setUpcomingReservations(upcomingRes.slice(0, 5));
      setUpcomingEvents(eventsRes.events?.slice(0, 5) || []);
      setRecentNotifications(notificationsRes.notifications?.slice(0, 5) || []);
    } catch (error) {
      console.error('Erreur lors du chargement du dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getReservationStatusColor = (status) => {
    switch (status) {
      case 'CONFIRMED': return 'badge-success';
      case 'PENDING': return 'badge-warning';
      case 'REJECTED': return 'badge-danger';
      case 'CANCELLED': return 'badge-danger';
      default: return 'badge-info';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-600">Chargement...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Message */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Bonjour, {user?.fullName} 👋
        </h1>
        <p className="text-gray-600 mt-2">
          Bienvenue sur votre tableau de bord client
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Réservations à venir</p>
              <p className="text-2xl font-bold mt-2">{stats.upcomingReservations}</p>
            </div>
            <div className="p-3 bg-primary-100 rounded-lg">
              <FaCalendarAlt className="text-2xl text-primary-600" />
            </div>
          </div>
          <Link to="/reservations" className="inline-block mt-4 text-sm text-primary-600 hover:text-primary-700">
            Voir toutes →
          </Link>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total réservations</p>
              <p className="text-2xl font-bold mt-2">{stats.totalReservations}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <FaHistory className="text-2xl text-blue-600" />
            </div>
          </div>
          <Link to="/reservations" className="inline-block mt-4 text-sm text-blue-600 hover:text-blue-700">
            Historique →
          </Link>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Événements à venir</p>
              <p className="text-2xl font-bold mt-2">{stats.events}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <FaBuilding className="text-2xl text-green-600" />
            </div>
          </div>
          <Link to="/events" className="inline-block mt-4 text-sm text-green-600 hover:text-green-700">
            Voir tous →
          </Link>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Notifications non lues</p>
              <p className="text-2xl font-bold mt-2">{stats.unreadNotifications}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <FaBell className="text-2xl text-purple-600" />
            </div>
          </div>
          <Link to="/notifications" className="inline-block mt-4 text-sm text-purple-600 hover:text-purple-700">
            Voir toutes →
          </Link>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card p-6">
        <h2 className="text-xl font-semibold mb-4">Actions rapides</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link 
            to="/resources" 
            className="btn btn-primary flex items-center justify-center gap-2"
          >
            <FaBuilding />
            Réserver une ressource
          </Link>
          <Link 
            to="/events" 
            className="btn btn-secondary flex items-center justify-center gap-2"
          >
            <FaCalendarAlt />
            Voir les événements
          </Link>
          <Link 
            to="/notifications" 
            className="btn bg-purple-600 text-white hover:bg-purple-700 flex items-center justify-center gap-2"
          >
            <FaBell />
            Mes notifications
          </Link>
        </div>
      </div>

      {/* Upcoming Reservations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <h2 className="text-xl font-semibold mb-4">Mes réservations à venir</h2>
          <div className="space-y-4">
            {upcomingReservations.length === 0 ? (
              <div className="text-center py-8">
                <FaClock className="text-4xl text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Aucune réservation à venir</p>
                <Link to="/resources" className="inline-block mt-2 text-primary-600 hover:text-primary-700">
                  Réserver une ressource →
                </Link>
              </div>
            ) : (
              upcomingReservations.map(reservation => (
                <div key={reservation.id} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-semibold">{reservation.resource_name}</p>
                      <p className="text-sm text-gray-600">
                        Type: {reservation.resource_type}
                      </p>
                    </div>
                    <span className={`badge ${getReservationStatusColor(reservation.status)}`}>
                      {reservation.status}
                    </span>
                  </div>
                  <p className="text-sm mb-2">
                    📅 {formatDate(reservation.start_at)} - {formatDate(reservation.end_at)}
                  </p>
                  <p className="text-sm">
                    📍 {reservation.resource_location}
                  </p>
                </div>
              ))
            )}
          </div>
          <Link to="/reservations" className="inline-block mt-4 text-sm text-primary-600 hover:text-primary-700">
            Voir toutes mes réservations →
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {/* Upcoming Events */}
          <div className="card p-6">
            <h2 className="text-xl font-semibold mb-4">Événements à venir</h2>
            <div className="space-y-4">
              {upcomingEvents.slice(0, 3).map(event => (
                <div key={event.id} className="p-4 bg-green-50 rounded-lg">
                  <p className="font-semibold mb-1">{event.title}</p>
                  <p className="text-sm text-gray-600 mb-2">
                    📅 {formatDate(event.start_at)}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">
                      👥 {event.participant_count} participants
                    </span>
                    <Link 
                      to={`/events/${event.id}`}
                      className="text-sm text-primary-600 hover:text-primary-700"
                    >
                      Voir →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
            <Link to="/events" className="inline-block mt-4 text-sm text-primary-600 hover:text-primary-700">
              Voir tous les événements →
            </Link>
          </div>

          {/* Recent Notifications */}
          <div className="card p-6">
            <h2 className="text-xl font-semibold mb-4">Notifications récentes</h2>
            <div className="space-y-4">
              {recentNotifications.map(notification => (
                <div 
                  key={notification.id} 
                  className={`p-3 rounded-lg ${!notification.read_at ? 'bg-blue-50' : 'bg-gray-50'}`}
                >
                  <p className="font-medium mb-1">{notification.title}</p>
                  <p className="text-sm text-gray-600 mb-2">{notification.message}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500">
                      {formatDate(notification.created_at)}
                    </span>
                    {!notification.read_at && (
                      <span className="badge badge-info">Non lu</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <Link to="/notifications" className="inline-block mt-4 text-sm text-primary-600 hover:text-primary-700">
              Voir toutes les notifications →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardClient;