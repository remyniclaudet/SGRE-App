// frontend/src/pages/admin/DashboardAdmin.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaUsers, 
  FaBuilding, 
  FaCalendarAlt, 
  FaChartBar,
  FaUserPlus,
  FaHistory,
  FaCog
} from 'react-icons/fa';

const DashboardAdmin = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalResources: 0,
    totalEvents: 0,
    activeReservations: 0
  });

  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simuler le chargement des données
    setTimeout(() => {
      setStats({
        totalUsers: 156,
        totalResources: 42,
        totalEvents: 28,
        activeReservations: 89
      });
      
      setRecentActivity([
        { id: 1, user: 'Manager 1', action: 'a créé une ressource', time: '10 min', type: 'resource' },
        { id: 2, user: 'Client 5', action: 'a fait une réservation', time: '25 min', type: 'reservation' },
        { id: 3, user: 'Admin', action: 'a ajouté un manager', time: '1 heure', type: 'user' },
        { id: 4, user: 'Client 12', action: 'a annulé une réservation', time: '2 heures', type: 'reservation' },
      ]);
      
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-600">Chargement du tableau de bord...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Administrateur</h1>
          <p className="text-gray-600 mt-2">
            Vue d'ensemble complète du système
          </p>
        </div>
        <div className="flex gap-3">
          <Link to="/admin/settings" className="btn btn-outline flex items-center gap-2">
            <FaCog />
            Paramètres
          </Link>
          <Link to="/admin/users/new" className="btn btn-primary flex items-center gap-2">
            <FaUserPlus />
            Ajouter un manager
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card bg-primary-50 border-primary-200">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-primary-700">Utilisateurs</p>
                <p className="text-3xl font-bold mt-2 text-primary-900">{stats.totalUsers}</p>
                <p className="text-sm text-primary-600 mt-1">+5 ce mois</p>
              </div>
              <div className="p-3 bg-primary-100 rounded-lg">
                <FaUsers className="text-2xl text-primary-600" />
              </div>
            </div>
            <Link to="/admin/users" className="inline-block mt-4 text-sm text-primary-600 hover:text-primary-700 font-medium">
              Gérer les utilisateurs →
            </Link>
          </div>
        </div>

        <div className="card bg-blue-50 border-blue-200">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-700">Ressources</p>
                <p className="text-3xl font-bold mt-2 text-blue-900">{stats.totalResources}</p>
                <p className="text-sm text-blue-600 mt-1">12 disponibles</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <FaBuilding className="text-2xl text-blue-600" />
              </div>
            </div>
            <Link to="/admin/resources" className="inline-block mt-4 text-sm text-blue-600 hover:text-blue-700 font-medium">
              Gérer les ressources →
            </Link>
          </div>
        </div>

        <div className="card bg-green-50 border-green-200">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-700">Événements</p>
                <p className="text-3xl font-bold mt-2 text-green-900">{stats.totalEvents}</p>
                <p className="text-sm text-green-600 mt-1">5 à venir</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <FaCalendarAlt className="text-2xl text-green-600" />
              </div>
            </div>
            <Link to="/admin/events" className="inline-block mt-4 text-sm text-green-600 hover:text-green-700 font-medium">
              Gérer les événements →
            </Link>
          </div>
        </div>

        <div className="card bg-purple-50 border-purple-200">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-700">Réservations actives</p>
                <p className="text-3xl font-bold mt-2 text-purple-900">{stats.activeReservations}</p>
                <p className="text-sm text-purple-600 mt-1">8 en attente</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <FaChartBar className="text-2xl text-purple-600" />
              </div>
            </div>
            <Link to="/admin/reservations" className="inline-block mt-4 text-sm text-purple-600 hover:text-purple-700 font-medium">
              Voir les réservations →
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4">Actions rapides</h3>
            <div className="space-y-3">
              <Link to="/admin/users/new" className="btn btn-outline w-full flex items-center justify-between">
                <span>Ajouter un manager</span>
                <FaUserPlus />
              </Link>
              <Link to="/admin/resources/new" className="btn btn-outline w-full flex items-center justify-between">
                <span>Créer une ressource</span>
                <FaBuilding />
              </Link>
              <Link to="/admin/events/new" className="btn btn-outline w-full flex items-center justify-between">
                <span>Planifier un événement</span>
                <FaCalendarAlt />
              </Link>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="card md:col-span-2">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold">Activité récente</h3>
              <Link to="/admin/audit" className="text-primary-600 hover:text-primary-700 text-sm flex items-center gap-2">
                <FaHistory />
                Voir tous les logs
              </Link>
            </div>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded ${
                      activity.type === 'user' ? 'bg-blue-100' :
                      activity.type === 'resource' ? 'bg-green-100' : 'bg-purple-100'
                    }`}>
                      {activity.type === 'user' && <FaUsers className="text-blue-600" />}
                      {activity.type === 'resource' && <FaBuilding className="text-green-600" />}
                      {activity.type === 'reservation' && <FaCalendarAlt className="text-purple-600" />}
                    </div>
                    <div>
                      <p className="font-medium">{activity.user}</p>
                      <p className="text-sm text-gray-600">{activity.action}</p>
                    </div>
                  </div>
                  <span className="text-sm text-gray-500">{activity.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardAdmin;