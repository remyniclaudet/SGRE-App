import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import {
  FaUsers,
  FaBoxes,
  FaCalendarAlt,
  FaClipboardList,
  FaArrowUp,
  FaArrowDown
} from 'react-icons/fa';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    users: { total: 0, admin: 0, manager: 0, client: 0 },
    resources: { total: 0, available: 0, unavailable: 0, maintenance: 0 },
    events: { total: 0, planned: 0, ongoing: 0, completed: 0 },
    reservations: { total: 0, pending: 0, confirmed: 0, rejected: 0 }
  });
  const [recentUsers, setRecentUsers] = useState([]);
  const [recentReservations, setRecentReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Récupérer les statistiques utilisateurs
      const usersRes = await api.get('/users/stats');
      const usersData = usersRes.data.stats;
      
      // Récupérer les statistiques ressources
      const resourcesRes = await api.get('/resources/stats');
      const resourcesData = resourcesRes.data.stats;
      
      // Récupérer les statistiques événements
      const eventsRes = await api.get('/events');
      const eventsData = eventsRes.data.events;
      
      // Récupérer les statistiques réservations
      const reservationsRes = await api.get('/reservations');
      const reservationsData = reservationsRes.data.reservations;
      
      // Récupérer les utilisateurs récents
      const usersListRes = await api.get('/users');
      const recentUsersData = usersListRes.data.users.slice(0, 5);
      
      // Récupérer les réservations récentes
      const recentReservationsData = reservationsData.slice(0, 5);
      
      // Calculer les statistiques événements
      const eventStats = {
        total: eventsData.length,
        planned: eventsData.filter(e => e.status === 'planned').length,
        ongoing: eventsData.filter(e => e.status === 'ongoing').length,
        completed: eventsData.filter(e => e.status === 'completed').length
      };
      
      // Calculer les statistiques réservations
      const reservationStats = {
        total: reservationsData.length,
        pending: reservationsData.filter(r => r.status === 'pending').length,
        confirmed: reservationsData.filter(r => r.status === 'confirmed').length,
        rejected: reservationsData.filter(r => r.status === 'rejected').length
      };
      
      // Organiser les statistiques utilisateurs
      const userStats = {
        total: usersData.reduce((sum, stat) => sum + stat.count, 0),
        admin: usersData.find(s => s.role === 'admin')?.count || 0,
        manager: usersData.find(s => s.role === 'manager')?.count || 0,
        client: usersData.find(s => s.role === 'client')?.count || 0
      };
      
      setStats({
        users: userStats,
        resources: resourcesData,
        events: eventStats,
        reservations: reservationStats
      });
      
      setRecentUsers(recentUsersData);
      setRecentReservations(recentReservationsData);
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Utilisateurs',
      value: stats.users.total,
      icon: FaUsers,
      color: 'bg-blue-500',
      details: [
        { label: 'Admin', value: stats.users.admin, color: 'text-blue-600' },
        { label: 'Managers', value: stats.users.manager, color: 'text-green-600' },
        { label: 'Clients', value: stats.users.client, color: 'text-purple-600' }
      ]
    },
    {
      title: 'Ressources',
      value: stats.resources.total,
      icon: FaBoxes,
      color: 'bg-green-500',
      details: [
        { label: 'Disponible', value: stats.resources.available, color: 'text-green-600' },
        { label: 'Indisponible', value: stats.resources.unavailable, color: 'text-red-600' },
        { label: 'Maintenance', value: stats.resources.maintenance, color: 'text-yellow-600' }
      ]
    },
    {
      title: 'Événements',
      value: stats.events.total,
      icon: FaCalendarAlt,
      color: 'bg-purple-500',
      details: [
        { label: 'Planifié', value: stats.events.planned, color: 'text-blue-600' },
        { label: 'En cours', value: stats.events.ongoing, color: 'text-green-600' },
        { label: 'Terminé', value: stats.events.completed, color: 'text-gray-600' }
      ]
    },
    {
      title: 'Réservations',
      value: stats.reservations.total,
      icon: FaClipboardList,
      color: 'bg-yellow-500',
      details: [
        { label: 'En attente', value: stats.reservations.pending, color: 'text-yellow-600' },
        { label: 'Confirmé', value: stats.reservations.confirmed, color: 'text-green-600' },
        { label: 'Rejeté', value: stats.reservations.rejected, color: 'text-red-600' }
      ]
    }
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-xl">Chargement des données...</div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Tableau de Bord Admin</h1>
      
      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, index) => (
          <div key={index} className="card">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-gray-600 text-sm">{stat.title}</p>
                <p className="text-2xl font-bold">{stat.value}</p>
              </div>
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className="text-white text-xl" />
              </div>
            </div>
            <div className="space-y-2">
              {stat.details.map((detail, idx) => (
                <div key={idx} className="flex justify-between text-sm">
                  <span className="text-gray-600">{detail.label}</span>
                  <span className={`font-medium ${detail.color}`}>{detail.value}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Contenu principal en deux colonnes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Utilisateurs récents */}
        <div className="card">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Utilisateurs récents</h2>
            <a href="/admin/users" className="text-primary-600 hover:text-primary-700 text-sm">
              Voir tout
            </a>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="table-header">Nom</th>
                  <th className="table-header">Email</th>
                  <th className="table-header">Rôle</th>
                  <th className="table-header">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {recentUsers.map((user) => (
                  <tr key={user.id}>
                    <td className="table-cell">{user.name}</td>
                    <td className="table-cell">{user.email}</td>
                    <td className="table-cell">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        user.role === 'admin' ? 'bg-red-100 text-red-800' :
                        user.role === 'manager' ? 'bg-blue-100 text-blue-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="table-cell">
                      {new Date(user.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Réservations récentes */}
        <div className="card">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Réservations récentes</h2>
            <a href="/admin/reservations" className="text-primary-600 hover:text-primary-700 text-sm">
              Voir tout
            </a>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="table-header">Utilisateur</th>
                  <th className="table-header">Ressource</th>
                  <th className="table-header">Statut</th>
                  <th className="table-header">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {recentReservations.map((reservation) => (
                  <tr key={reservation.id}>
                    <td className="table-cell">{reservation.user_name}</td>
                    <td className="table-cell">{reservation.resource_name}</td>
                    <td className="table-cell">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        reservation.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                        reservation.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {reservation.status}
                      </span>
                    </td>
                    <td className="table-cell">
                      {new Date(reservation.start_date).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Actions rapides */}
      <div className="mt-8 card">
        <h2 className="text-xl font-semibold mb-6">Actions rapides</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <a
            href="/admin/users/new"
            className="bg-blue-50 hover:bg-blue-100 p-4 rounded-lg text-center"
          >
            <div className="text-blue-600 font-semibold">Ajouter un utilisateur</div>
          </a>
          <a
            href="/admin/resources/new"
            className="bg-green-50 hover:bg-green-100 p-4 rounded-lg text-center"
          >
            <div className="text-green-600 font-semibold">Ajouter une ressource</div>
          </a>
          <a
            href="/admin/events/new"
            className="bg-purple-50 hover:bg-purple-100 p-4 rounded-lg text-center"
          >
            <div className="text-purple-600 font-semibold">Créer un événement</div>
          </a>
          <a
            href="/admin/settings"
            className="bg-yellow-50 hover:bg-yellow-100 p-4 rounded-lg text-center"
          >
            <div className="text-yellow-600 font-semibold">Paramètres système</div>
          </a>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;