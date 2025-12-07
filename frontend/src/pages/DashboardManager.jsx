import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaBuilding, 
  FaCalendarAlt, 
  FaCheckCircle,
  FaClock,
  FaExclamationTriangle,
  FaUsers
} from 'react-icons/fa';
import { getResources } from '../api/resources';
import { getEvents } from '../api/events';
import { getReservations } from '../api/reservations';

const DashboardManager = () => {
  const [stats, setStats] = useState({
    resources: 0,
    events: 0,
    pendingReservations: 0,
    confirmedReservations: 0
  });
  const [pendingReservations, setPendingReservations] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      const [resourcesRes, eventsRes, reservationsRes] = await Promise.all([
        getResources(),
        getEvents({ status: 'SCHEDULED', start_date: new Date().toISOString() }),
        getReservations({ status: 'PENDING' })
      ]);

      setStats({
        resources: resourcesRes.count || 0,
        events: eventsRes.count || 0,
        pendingReservations: reservationsRes.count || 0,
        confirmedReservations: 0 // À implémenter
      });

      setPendingReservations(reservationsRes.reservations?.slice(0, 5) || []);
      setUpcomingEvents(eventsRes.events?.slice(0, 5) || []);
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

  const handleConfirmReservation = async (reservationId) => {
    // À implémenter
    console.log('Confirmer réservation:', reservationId);
  };

  const handleRejectReservation = async (reservationId) => {
    // À implémenter
    console.log('Rejeter réservation:', reservationId);
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
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Tableau de bord Manager</h1>
        <p className="text-gray-600 mt-2">
          Gérez les ressources, les événements et validez les réservations
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Ressources</p>
              <p className="text-2xl font-bold mt-2">{stats.resources}</p>
            </div>
            <div className="p-3 bg-primary-100 rounded-lg">
              <FaBuilding className="text-2xl text-primary-600" />
            </div>
          </div>
          <Link to="/resources" className="inline-block mt-4 text-sm text-primary-600 hover:text-primary-700">
            Gérer →
          </Link>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Événements</p>
              <p className="text-2xl font-bold mt-2">{stats.events}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <FaCalendarAlt className="text-2xl text-green-600" />
            </div>
          </div>
          <Link to="/events" className="inline-block mt-4 text-sm text-green-600 hover:text-green-700">
            Gérer →
          </Link>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Réservations en attente</p>
              <p className="text-2xl font-bold mt-2">{stats.pendingReservations}</p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-lg">
              <FaClock className="text-2xl text-yellow-600" />
            </div>
          </div>
          <Link to="/reservations" className="inline-block mt-4 text-sm text-yellow-600 hover:text-yellow-700">
            Valider →
          </Link>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Réservations confirmées</p>
              <p className="text-2xl font-bold mt-2">{stats.confirmedReservations}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <FaCheckCircle className="text-2xl text-blue-600" />
            </div>
          </div>
          <Link to="/reservations?status=CONFIRMED" className="inline-block mt-4 text-sm text-blue-600 hover:text-blue-700">
            Voir →
          </Link>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card p-6">
        <h2 className="text-xl font-semibold mb-4">Actions rapides</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link 
            to="/resources/new" 
            className="btn btn-primary flex items-center justify-center gap-2"
          >
            <FaBuilding />
            Ajouter une ressource
          </Link>
          <Link 
            to="/events/new" 
            className="btn btn-secondary flex items-center justify-center gap-2"
          >
            <FaCalendarAlt />
            Créer un événement
          </Link>
          <Link 
            to="/reservations" 
            className="btn bg-yellow-600 text-white hover:bg-yellow-700 flex items-center justify-center gap-2"
          >
            <FaClock />
            Gérer les réservations
          </Link>
        </div>
      </div>

      {/* Pending Reservations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <FaExclamationTriangle className="text-yellow-500" />
            Réservations en attente
          </h2>
          <div className="space-y-4">
            {pendingReservations.length === 0 ? (
              <p className="text-gray-500 text-center py-4">Aucune réservation en attente</p>
            ) : (
              pendingReservations.map(reservation => (
                <div key={reservation.id} className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-semibold">{reservation.resource_name}</p>
                      <p className="text-sm text-gray-600">
                        Par: {reservation.user_name}
                      </p>
                    </div>
                    <span className="badge badge-warning">En attente</span>
                  </div>
                  <p className="text-sm mb-3">
                    {formatDate(reservation.start_at)} - {formatDate(reservation.end_at)}
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleConfirmReservation(reservation.id)}
                      className="btn bg-green-600 text-white hover:bg-green-700 text-sm px-3 py-1"
                    >
                      Confirmer
                    </button>
                    <button
                      onClick={() => handleRejectReservation(reservation.id)}
                      className="btn bg-red-600 text-white hover:bg-red-700 text-sm px-3 py-1"
                    >
                      Rejeter
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
          <Link to="/reservations" className="inline-block mt-4 text-sm text-primary-600 hover:text-primary-700">
            Voir toutes les réservations →
          </Link>
        </div>

        {/* Upcoming Events */}
        <div className="card p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <FaCalendarAlt className="text-green-500" />
            Événements à venir
          </h2>
          <div className="space-y-4">
            {upcomingEvents.length === 0 ? (
              <p className="text-gray-500 text-center py-4">Aucun événement à venir</p>
            ) : (
              upcomingEvents.map(event => (
                <div key={event.id} className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-semibold">{event.title}</p>
                      <p className="text-sm text-gray-600">
                        Organisé par: {event.organizer_name}
                      </p>
                    </div>
                    <span className="badge badge-success">Planifié</span>
                  </div>
                  <p className="text-sm mb-2">
                    📅 {formatDate(event.start_at)} - {formatDate(event.end_at)}
                  </p>
                  <p className="text-sm mb-3">
                    📍 {event.location}
                  </p>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <FaUsers />
                    <span>{event.participant_count} participants</span>
                  </div>
                </div>
              ))
            )}
          </div>
          <Link to="/events" className="inline-block mt-4 text-sm text-primary-600 hover:text-primary-700">
            Voir tous les événements →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DashboardManager;