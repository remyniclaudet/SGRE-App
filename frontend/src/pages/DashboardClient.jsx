// frontend/src/pages/client/DashboardClient.jsx
import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { 
  FaCalendarAlt, 
  FaClock,
  FaCheckCircle,
  FaBell,
  FaHistory,
  FaCalendarPlus
} from 'react-icons/fa';

const DashboardClient = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState({
    upcomingReservations: 0,
    totalReservations: 0,
    pendingReservations: 0,
    unreadNotifications: 0
  });

  const [upcomingReservations, setUpcomingReservations] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simuler le chargement des données
    setTimeout(() => {
      setStats({
        upcomingReservations: 3,
        totalReservations: 15,
        pendingReservations: 1,
        unreadNotifications: 2
      });
      
      setUpcomingReservations([
        { id: 1, resource: 'Salle de réunion B', date: 'Demain, 10h-12h', status: 'confirmée' },
        { id: 2, resource: 'Projecteur HD', date: 'Vendredi, 14h-16h', status: 'confirmée' },
        { id: 3, resource: 'Kit vidéoconférence', date: 'Lundi, 9h-11h', status: 'en attente' },
      ]);
      
      setRecentActivity([
        { id: 1, action: 'Réservation confirmée', resource: 'Salle de conférence A', time: 'Il y a 2 jours' },
        { id: 2, action: 'Notification reçue', message: 'Votre événement a été modifié', time: 'Il y a 3 jours' },
        { id: 3, action: 'Réservation annulée', resource: 'Véhicule de service', time: 'Il y a 1 semaine' },
      ]);
      
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-600">Chargement de votre espace...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Message */}
      <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl p-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Bonjour, {user?.fullName} 👋</h1>
            <p className="mt-2 opacity-90">
              Bienvenue dans votre espace client. Gérez vos réservations et restez informé.
            </p>
          </div>
          <div className="hidden md:block">
            <Link 
              to="/client/reservations/new" 
              className="btn bg-white text-green-600 hover:bg-gray-100 flex items-center gap-2"
            >
              <FaCalendarPlus />
              Nouvelle réservation
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card bg-green-50 border-green-200">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-700">À venir</p>
                <p className="text-3xl font-bold mt-2 text-green-900">{stats.upcomingReservations}</p>
                <p className="text-sm text-green-600 mt-1">Réservations</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <FaCalendarAlt className="text-2xl text-green-600" />
              </div>
            </div>
            <Link to="/client/reservations" className="inline-block mt-4 text-sm text-green-600 hover:text-green-700 font-medium">
              Voir mes réservations →
            </Link>
          </div>
        </div>

        <div className="card bg-blue-50 border-blue-200">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-700">Total</p>
                <p className="text-3xl font-bold mt-2 text-blue-900">{stats.totalReservations}</p>
                <p className="text-sm text-blue-600 mt-1">Réservations</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <FaHistory className="text-2xl text-blue-600" />
              </div>
            </div>
            <Link to="/client/history" className="inline-block mt-4 text-sm text-blue-600 hover:text-blue-700 font-medium">
              Voir l'historique →
            </Link>
          </div>
        </div>

        <div className="card bg-yellow-50 border-yellow-200">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-yellow-700">En attente</p>
                <p className="text-3xl font-bold mt-2 text-yellow-900">{stats.pendingReservations}</p>
                <p className="text-sm text-yellow-600 mt-1">Validation</p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-lg">
                <FaClock className="text-2xl text-yellow-600" />
              </div>
            </div>
            <Link to="/client/reservations?status=pending" className="inline-block mt-4 text-sm text-yellow-600 hover:text-yellow-700 font-medium">
              Voir les détails →
            </Link>
          </div>
        </div>

        <div className="card bg-purple-50 border-purple-200">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-700">Notifications</p>
                <p className="text-3xl font-bold mt-2 text-purple-900">{stats.unreadNotifications}</p>
                <p className="text-sm text-purple-600 mt-1">Non lues</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <FaBell className="text-2xl text-purple-600" />
              </div>
            </div>
            <Link to="/client/notifications" className="inline-block mt-4 text-sm text-purple-600 hover:text-purple-700 font-medium">
              Voir mes notifications →
            </Link>
          </div>
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Reservations */}
        <div className="card">
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-6">Mes prochaines réservations</h3>
            
            <div className="space-y-4">
              {upcomingReservations.map((reservation) => (
                <div key={reservation.id} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-semibold text-gray-900">{reservation.resource}</p>
                    </div>
                    <span className={`badge ${
                      reservation.status === 'confirmée' ? 'badge-success' : 'badge-warning'
                    }`}>
                      {reservation.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 mb-2">📅 {reservation.date}</p>
                  <div className="flex gap-2 mt-3">
                    <button className="text-sm text-blue-600 hover:text-blue-700">
                      Voir détails
                    </button>
                    {reservation.status === 'confirmée' && (
                      <button className="text-sm text-red-600 hover:text-red-700 ml-4">
                        Annuler
                      </button>
                    )}
                  </div>
                </div>
              ))}
              
              {upcomingReservations.length === 0 && (
                <div className="text-center py-8">
                  <FaCalendarAlt className="text-4xl text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">Aucune réservation à venir</p>
                  <Link to="/client/resources" className="inline-block mt-2 text-green-600 hover:text-green-700">
                    Réserver une ressource →
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="card">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold">Activité récente</h3>
              <Link to="/client/history" className="text-blue-600 hover:text-blue-700 text-sm">
                Voir tout l'historique →
              </Link>
            </div>
            
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded ${
                      activity.action.includes('confirmée') ? 'bg-green-100' :
                      activity.action.includes('annulée') ? 'bg-red-100' : 'bg-blue-100'
                    }`}>
                      {activity.action.includes('confirmée') && <FaCheckCircle className="text-green-600" />}
                      {activity.action.includes('annulée') && <FaClock className="text-red-600" />}
                      {activity.action.includes('Notification') && <FaBell className="text-blue-600" />}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{activity.action}</p>
                      {activity.resource && (
                        <p className="text-sm text-gray-600">{activity.resource}</p>
                      )}
                      {activity.message && (
                        <p className="text-sm text-gray-600">{activity.message}</p>
                      )}
                    </div>
                    <span className="text-sm text-gray-500 whitespace-nowrap">{activity.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link 
          to="/client/resources" 
          className="card hover:shadow-lg transition-shadow p-6 text-center"
        >
          <div className="p-3 bg-green-100 rounded-lg inline-block mb-4">
            <FaCalendarAlt className="text-2xl text-green-600" />
          </div>
          <h4 className="font-semibold text-gray-900 mb-2">Réserver une ressource</h4>
          <p className="text-sm text-gray-600">
            Consultez et réservez nos ressources disponibles
          </p>
        </Link>
        
        <Link 
          to="/client/events" 
          className="card hover:shadow-lg transition-shadow p-6 text-center"
        >
          <div className="p-3 bg-blue-100 rounded-lg inline-block mb-4">
            <FaCalendarAlt className="text-2xl text-blue-600" />
          </div>
          <h4 className="font-semibold text-gray-900 mb-2">Voir les événements</h4>
          <p className="text-sm text-gray-600">
            Découvrez et participez aux événements à venir
          </p>
        </Link>
        
        <Link 
          to="/client/profile" 
          className="card hover:shadow-lg transition-shadow p-6 text-center"
        >
          <div className="p-3 bg-purple-100 rounded-lg inline-block mb-4">
            <FaBell className="text-2xl text-purple-600" />
          </div>
          <h4 className="font-semibold text-gray-900 mb-2">Gérer mes préférences</h4>
          <p className="text-sm text-gray-600">
            Modifiez votre profil et vos notifications
          </p>
        </Link>
      </div>
    </div>
  );
};

export default DashboardClient;