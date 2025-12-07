import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Link } from 'react-router-dom';
import {
  FaBoxes,
  FaCalendarAlt,
  FaClipboardList,
  FaClock,
  FaCheckCircle,
  FaTimesCircle
} from 'react-icons/fa';

const ManagerDashboard = () => {
  const [stats, setStats] = useState({
    resources: { total: 0, available: 0 },
    events: { total: 0, planned: 0 },
    reservations: { pending: 0, total: 0 }
  });
  const [recentEvents, setRecentEvents] = useState([]);
  const [pendingReservations, setPendingReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Récupérer les ressources
      const resourcesRes = await api.get('/resources');
      const resourcesData = resourcesRes.data.resources;
      
      // Récupérer les événements
      const eventsRes = await api.get('/events/my-events');
      const eventsData = eventsRes.data.events;
      
      // Récupérer les réservations en attente
      const reservationsRes = await api.get('/reservations/pending');
      const reservationsData = reservationsRes.data.reservations;
      
      // Récupérer toutes les réservations
      const allReservationsRes = await api.get('/reservations');
      const allReservationsData = allReservationsRes.data.reservations;
      
      // Calculer les statistiques
      setStats({
        resources: {
          total: resourcesData.length,
          available: resourcesData.filter(r => r.status === 'available').length
        },
        events: {
          total: eventsData.length,
          planned: eventsData.filter(e => e.status === 'planned').length
        },
        reservations: {
          pending: reservationsData.length,
          total: allReservationsData.length
        }
      });
      
      // Événements récents
      setRecentEvents(eventsData.slice(0, 5));
      
      // Réservations en attente
      setPendingReservations(reservationsData.slice(0, 5));
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Ressources',
      value: stats.resources.total,
      subtitle: `${stats.resources.available} disponibles`,
      icon: FaBoxes,
      color: 'bg-blue-500',
      link: '/manager/resources'
    },
    {
      title: 'Événements',
      value: stats.events.total,
      subtitle: `${stats.events.planned} planifiés`,
      icon: FaCalendarAlt,
      color: 'bg-purple-500',
      link: '/manager/events'
    },
    {
      title: 'Réservations',
      value: stats.reservations.total,
      subtitle: `${stats.reservations.pending} en attente`,
      icon: FaClipboardList,
      color: 'bg-green-500',
      link: '/manager/reservations'
    }
  ];

  const handleReservationAction = async (reservationId, action) => {
    try {
      await api.put(`/reservations/${reservationId}/status`, { status: action });
      fetchDashboardData(); // Rafraîchir les données
    } catch (error) {
      console.error('Error updating reservation:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-xl">Chargement des données...</div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Tableau de Bord Manager</h1>
      
      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {statCards.map((stat, index) => (
          <Link key={index} to={stat.link} className="card hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-600 text-sm">{stat.title}</p>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-gray-500 text-sm mt-1">{stat.subtitle}</p>
              </div>
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className="text-white text-xl" />
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Deux colonnes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Événements récents */}
        <div className="card">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Événements récents</h2>
            <Link to="/manager/events" className="text-primary-600 hover:text-primary-700 text-sm">
              Voir tout
            </Link>
          </div>
          
          <div className="space-y-4">
            {recentEvents.map((event) => (
              <div key={event.id} className="border-b pb-4 last:border-0">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{event.title}</h3>
                    <p className="text-gray-600 text-sm">
                      {new Date(event.date).toLocaleDateString()} • {event.location}
                    </p>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs ${
                    event.status === 'planned' ? 'bg-blue-100 text-blue-800' :
                    event.status === 'ongoing' ? 'bg-green-100 text-green-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {event.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Réservations en attente */}
        <div className="card">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Réservations en attente</h2>
            <Link to="/manager/reservations" className="text-primary-600 hover:text-primary-700 text-sm">
              Voir tout
            </Link>
          </div>
          
          <div className="space-y-4">
            {pendingReservations.length > 0 ? (
              pendingReservations.map((reservation) => (
                <div key={reservation.id} className="border-b pb-4 last:border-0">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-medium">{reservation.resource_name}</h3>
                      <p className="text-gray-600 text-sm">
                        Par {reservation.user_name} • 
                        {new Date(reservation.start_date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleReservationAction(reservation.id, 'confirmed')}
                      className="flex-1 bg-green-100 text-green-700 px-3 py-1 rounded text-sm hover:bg-green-200"
                    >
                      <FaCheckCircle className="inline mr-1" /> Accepter
                    </button>
                    <button
                      onClick={() => handleReservationAction(reservation.id, 'rejected')}
                      className="flex-1 bg-red-100 text-red-700 px-3 py-1 rounded text-sm hover:bg-red-200"
                    >
                      <FaTimesCircle className="inline mr-1" /> Refuser
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">Aucune réservation en attente</p>
            )}
          </div>
        </div>
      </div>

      {/* Actions rapides */}
      <div className="mt-8 card">
        <h2 className="text-xl font-semibold mb-6">Actions rapides</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link
            to="/manager/resources/new"
            className="bg-blue-50 hover:bg-blue-100 p-4 rounded-lg text-center"
          >
            <div className="text-blue-600 font-semibold">Ajouter une ressource</div>
            <div className="text-sm text-gray-600 mt-1">Nouvelle salle ou équipement</div>
          </Link>
          <Link
            to="/manager/events/new"
            className="bg-purple-50 hover:bg-purple-100 p-4 rounded-lg text-center"
          >
            <div className="text-purple-600 font-semibold">Créer un événement</div>
            <div className="text-sm text-gray-600 mt-1">Planifier un nouvel événement</div>
          </Link>
          <Link
            to="/manager/reservations"
            className="bg-green-50 hover:bg-green-100 p-4 rounded-lg text-center"
          >
            <div className="text-green-600 font-semibold">Gérer les réservations</div>
            <div className="text-sm text-gray-600 mt-1">Voir toutes les réservations</div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboard;