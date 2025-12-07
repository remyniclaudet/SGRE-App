import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Link } from 'react-router-dom';
import {
  FaClipboardList,
  FaCheckCircle,
  FaClock,
  FaTimesCircle,
  FaBox,
  FaCalendarAlt
} from 'react-icons/fa';

const ClientDashboard = () => {
  const [stats, setStats] = useState({
    totalReservations: 0,
    confirmedReservations: 0,
    pendingReservations: 0,
    cancelledReservations: 0
  });
  const [recentReservations, setRecentReservations] = useState([]);
  const [availableResources, setAvailableResources] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Récupérer les réservations de l'utilisateur
      const reservationsRes = await api.get('/reservations/my-reservations');
      const reservationsData = reservationsRes.data.reservations;
      
      // Récupérer les ressources disponibles
      const resourcesRes = await api.get('/resources/public');
      const resourcesData = resourcesRes.data.resources;
      
      // Calculer les statistiques
      const confirmed = reservationsData.filter(r => r.status === 'confirmed').length;
      const pending = reservationsData.filter(r => r.status === 'pending').length;
      const cancelled = reservationsData.filter(r => r.status === 'cancelled').length;
      
      setStats({
        totalReservations: reservationsData.length,
        confirmedReservations: confirmed,
        pendingReservations: pending,
        cancelledReservations: cancelled
      });
      
      // Réservations récentes
      setRecentReservations(reservationsData.slice(0, 5));
      
      // Ressources disponibles
      setAvailableResources(resourcesData.slice(0, 6));
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total réservations',
      value: stats.totalReservations,
      icon: FaClipboardList,
      color: 'bg-blue-500',
      link: '/client/reservations'
    },
    {
      title: 'Confirmées',
      value: stats.confirmedReservations,
      icon: FaCheckCircle,
      color: 'bg-green-500',
      link: '/client/reservations?status=confirmed'
    },
    {
      title: 'En attente',
      value: stats.pendingReservations,
      icon: FaClock,
      color: 'bg-yellow-500',
      link: '/client/reservations?status=pending'
    },
    {
      title: 'Annulées',
      value: stats.cancelledReservations,
      icon: FaTimesCircle,
      color: 'bg-red-500',
      link: '/client/reservations?status=cancelled'
    }
  ];

  const handleCancelReservation = async (reservationId) => {
    if (window.confirm('Êtes-vous sûr de vouloir annuler cette réservation ?')) {
      try {
        await api.put(`/reservations/${reservationId}/cancel`);
        fetchDashboardData(); // Rafraîchir les données
      } catch (error) {
        console.error('Error cancelling reservation:', error);
        alert('Erreur lors de l\'annulation');
      }
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
      <h1 className="text-3xl font-bold mb-8">Tableau de Bord Client</h1>
      
      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, index) => (
          <Link key={index} to={stat.link} className="card hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-600 text-sm">{stat.title}</p>
                <p className="text-2xl font-bold">{stat.value}</p>
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
        {/* Réservations récentes */}
        <div className="card">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Mes réservations récentes</h2>
            <Link to="/client/reservations" className="text-primary-600 hover:text-primary-700 text-sm">
              Voir tout
            </Link>
          </div>
          
          <div className="space-y-4">
            {recentReservations.length > 0 ? (
              recentReservations.map((reservation) => (
                <div key={reservation.id} className="border-b pb-4 last:border-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">{reservation.resource_name}</h3>
                      <p className="text-gray-600 text-sm">
                        {new Date(reservation.start_date).toLocaleDateString()} • 
                        Statut: <span className={`font-medium ${
                          reservation.status === 'confirmed' ? 'text-green-600' :
                          reservation.status === 'pending' ? 'text-yellow-600' :
                          'text-red-600'
                        }`}>
                          {reservation.status}
                        </span>
                      </p>
                    </div>
                    {reservation.status === 'pending' && (
                      <button
                        onClick={() => handleCancelReservation(reservation.id)}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        Annuler
                      </button>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <FaClipboardList className="text-gray-400 text-4xl mx-auto mb-4" />
                <p className="text-gray-500">Aucune réservation</p>
                <Link to="/client/catalog" className="text-primary-600 hover:text-primary-700 text-sm mt-2 inline-block">
                  Parcourir le catalogue
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Ressources disponibles */}
        <div className="card">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Ressources disponibles</h2>
            <Link to="/client/catalog" className="text-primary-600 hover:text-primary-700 text-sm">
              Voir tout
            </Link>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            {availableResources.map((resource) => (
              <Link
                key={resource.id}
                to={`/client/catalog/${resource.id}`}
                className="border rounded-lg p-4 hover:border-primary-500 hover:shadow transition-all"
              >
                <div className="flex items-center mb-2">
                  {resource.type === 'Salle' ? (
                    <FaCalendarAlt className="text-blue-500 mr-2" />
                  ) : (
                    <FaBox className="text-green-500 mr-2" />
                  )}
                  <h3 className="font-medium text-sm">{resource.name}</h3>
                </div>
                <p className="text-xs text-gray-600 truncate">{resource.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Actions rapides */}
      <div className="mt-8 card">
        <h2 className="text-xl font-semibold mb-6">Actions rapides</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link
            to="/client/catalog"
            className="bg-blue-50 hover:bg-blue-100 p-4 rounded-lg text-center"
          >
            <div className="text-blue-600 font-semibold">Parcourir le catalogue</div>
            <div className="text-sm text-gray-600 mt-1">Trouver des ressources disponibles</div>
          </Link>
          <Link
            to="/client/reservations"
            className="bg-green-50 hover:bg-green-100 p-4 rounded-lg text-center"
          >
            <div className="text-green-600 font-semibold">Mes réservations</div>
            <div className="text-sm text-gray-600 mt-1">Voir et gérer mes réservations</div>
          </Link>
          <Link
            to="/client/profile"
            className="bg-purple-50 hover:bg-purple-100 p-4 rounded-lg text-center"
          >
            <div className="text-purple-600 font-semibold">Mon profil</div>
            <div className="text-sm text-gray-600 mt-1">Modifier mes informations</div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ClientDashboard;