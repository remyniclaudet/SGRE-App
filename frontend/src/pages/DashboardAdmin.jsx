import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaUsers, 
  FaBuilding, 
  FaCalendarAlt, 
  FaChartBar,
  FaUserShield,
  FaHistory
} from 'react-icons/fa';
import { getUsers } from '../api/users';
import { getResources } from '../api/resources';
import { getEvents } from '../api/events';
import { getAuditLogs } from '../api/reports';

const DashboardAdmin = () => {
  const [stats, setStats] = useState({
    users: 0,
    resources: 0,
    events: 0,
    reservations: 0
  });
  const [recentUsers, setRecentUsers] = useState([]);
  const [recentLogs, setRecentLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Récupérer les statistiques
      const [usersRes, resourcesRes, eventsRes, logsRes] = await Promise.all([
        getUsers(),
        getResources(),
        getEvents(),
        getAuditLogs({ limit: 5 })
      ]);

      setStats({
        users: usersRes.count || 0,
        resources: resourcesRes.count || 0,
        events: eventsRes.count || 0,
        reservations: 0 // À implémenter si besoin
      });

      setRecentUsers(usersRes.users?.slice(0, 5) || []);
      setRecentLogs(logsRes.logs || []);
    } catch (error) {
      console.error('Erreur lors du chargement du dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'ADMIN': return 'bg-red-100 text-red-800';
      case 'MANAGER': return 'bg-blue-100 text-blue-800';
      case 'CLIENT': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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
        <h1 className="text-3xl font-bold text-gray-900">Tableau de bord Administrateur</h1>
        <p className="text-gray-600 mt-2">
          Gérez les utilisateurs, les ressources et surveillez l'activité du système
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Utilisateurs</p>
              <p className="text-2xl font-bold mt-2">{stats.users}</p>
            </div>
            <div className="p-3 bg-primary-100 rounded-lg">
              <FaUsers className="text-2xl text-primary-600" />
            </div>
          </div>
          <Link to="/admin/users" className="inline-block mt-4 text-sm text-primary-600 hover:text-primary-700">
            Voir tous →
          </Link>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Ressources</p>
              <p className="text-2xl font-bold mt-2">{stats.resources}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <FaBuilding className="text-2xl text-blue-600" />
            </div>
          </div>
          <Link to="/resources" className="inline-block mt-4 text-sm text-blue-600 hover:text-blue-700">
            Voir toutes →
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
            Voir tous →
          </Link>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Logs d'audit</p>
              <p className="text-2xl font-bold mt-2">{recentLogs.length}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <FaHistory className="text-2xl text-purple-600" />
            </div>
          </div>
          <Link to="/reports" className="inline-block mt-4 text-sm text-purple-600 hover:text-purple-700">
            Voir les logs →
          </Link>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card p-6">
        <h2 className="text-xl font-semibold mb-4">Actions rapides</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link 
            to="/admin/users/new" 
            className="btn btn-primary flex items-center justify-center gap-2"
          >
            <FaUserShield />
            Ajouter un utilisateur
          </Link>
          <Link 
            to="/resources/new" 
            className="btn btn-secondary flex items-center justify-center gap-2"
          >
            <FaBuilding />
            Ajouter une ressource
          </Link>
          <Link 
            to="/reports" 
            className="btn bg-purple-600 text-white hover:bg-purple-700 flex items-center justify-center gap-2"
          >
            <FaChartBar />
            Voir les rapports
          </Link>
        </div>
      </div>

      {/* Recent Users */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <h2 className="text-xl font-semibold mb-4">Utilisateurs récents</h2>
          <div className="space-y-4">
            {recentUsers.map(user => (
              <div key={user.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">{user.fullName}</p>
                  <p className="text-sm text-gray-600">{user.email}</p>
                </div>
                <span className={`badge ${getRoleColor(user.role)}`}>
                  {user.role}
                </span>
              </div>
            ))}
          </div>
          <Link to="/admin/users" className="inline-block mt-4 text-sm text-primary-600 hover:text-primary-700">
            Voir tous les utilisateurs →
          </Link>
        </div>

        {/* Recent Activity */}
        <div className="card p-6">
          <h2 className="text-xl font-semibold mb-4">Activité récente</h2>
          <div className="space-y-4">
            {recentLogs.map(log => (
              <div key={log.id} className="p-3 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">{log.action}</p>
                    <p className="text-sm text-gray-600">
                      {log.object_type} #{log.object_id}
                    </p>
                  </div>
                  <span className="text-xs text-gray-500">
                    {formatDate(log.created_at)}
                  </span>
                </div>
                {log.user_name && (
                  <p className="text-sm mt-2">
                    Par: {log.user_name} ({log.user_email})
                  </p>
                )}
              </div>
            ))}
          </div>
          <Link to="/reports" className="inline-block mt-4 text-sm text-primary-600 hover:text-primary-700">
            Voir toute l'activité →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DashboardAdmin;