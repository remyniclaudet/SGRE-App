// frontend/src/pages/manager/DashboardManager.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaBuilding, 
  FaCalendarAlt, 
  FaClock,
  FaCheckCircle,
  FaExclamationTriangle,
  FaUsers
} from 'react-icons/fa';

const DashboardManager = () => {
  const [stats, setStats] = useState({
    totalResources: 0,
    activeEvents: 0,
    pendingReservations: 0,
    confirmedReservations: 0
  });

  const [pendingReservations, setPendingReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simuler le chargement des données
    setTimeout(() => {
      setStats({
        totalResources: 15,
        activeEvents: 8,
        pendingReservations: 5,
        confirmedReservations: 32
      });
      
      setPendingReservations([
        { id: 1, resource: 'Salle de conférence A', user: 'Jean Dupont', time: 'Demain 10h-12h' },
        { id: 2, resource: 'Projecteur HD', user: 'Marie Martin', time: 'Aujourd\'hui 14h-16h' },
        { id: 3, resource: 'Véhicule de service', user: 'Pierre Durand', time: 'Vendredi 9h-17h' },
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
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Manager</h1>
          <p className="text-gray-600 mt-2">
            Gestion des ressources, événements et réservations
          </p>
        </div>
        <div className="flex gap-3">
          <Link to="/manager/resources/new" className="btn btn-primary flex items-center gap-2">
            <FaBuilding />
            Nouvelle ressource
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card bg-blue-50 border-blue-200">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-700">Mes ressources</p>
                <p className="text-3xl font-bold mt-2 text-blue-900">{stats.totalResources}</p>
                <p className="text-sm text-blue-600 mt-1">3 en maintenance</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <FaBuilding className="text-2xl text-blue-600" />
              </div>
            </div>
            <Link to="/manager/resources" className="inline-block mt-4 text-sm text-blue-600 hover:text-blue-700 font-medium">
              Gérer les ressources →
            </Link>
          </div>
        </div>

        <div className="card bg-green-50 border-green-200">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-700">Événements actifs</p>
                <p className="text-3xl font-bold mt-2 text-green-900">{stats.activeEvents}</p>
                <p className="text-sm text-green-600 mt-1">2 aujourd'hui</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <FaCalendarAlt className="text-2xl text-green-600" />
              </div>
            </div>
            <Link to="/manager/events" className="inline-block mt-4 text-sm text-green-600 hover:text-green-700 font-medium">
              Gérer les événements →
            </Link>
          </div>
        </div>

        <div className="card bg-yellow-50 border-yellow-200">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-yellow-700">En attente</p>
                <p className="text-3xl font-bold mt-2 text-yellow-900">{stats.pendingReservations}</p>
                <p className="text-sm text-yellow-600 mt-1">Réservations à valider</p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-lg">
                <FaClock className="text-2xl text-yellow-600" />
              </div>
            </div>
            <Link to="/manager/approvals" className="inline-block mt-4 text-sm text-yellow-600 hover:text-yellow-700 font-medium">
              Valider les réservations →
            </Link>
          </div>
        </div>

        <div className="card bg-purple-50 border-purple-200">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-700">Confirmées</p>
                <p className="text-3xl font-bold mt-2 text-purple-900">{stats.confirmedReservations}</p>
                <p className="text-sm text-purple-600 mt-1">Ce mois</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <FaCheckCircle className="text-2xl text-purple-600" />
              </div>
            </div>
            <Link to="/manager/reservations" className="inline-block mt-4 text-sm text-purple-600 hover:text-purple-700 font-medium">
              Voir toutes →
            </Link>
          </div>
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Reservations */}
        <div className="card">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <FaExclamationTriangle className="text-yellow-500" />
                Réservations en attente
              </h3>
              <Link to="/manager/approvals" className="text-blue-600 hover:text-blue-700 text-sm">
                Voir toutes →
              </Link>
            </div>
            
            <div className="space-y-4">
              {pendingReservations.map((reservation) => (
                <div key={reservation.id} className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-semibold text-gray-900">{reservation.resource}</p>
                      <p className="text-sm text-gray-600">Demandé par: {reservation.user}</p>
                    </div>
                    <span className="badge badge-warning">À valider</span>
                  </div>
                  <p className="text-sm text-gray-700 mb-3">⏰ {reservation.time}</p>
                  <div className="flex gap-2">
                    <button className="btn bg-green-600 text-white hover:bg-green-700 text-sm px-3 py-1">
                      <FaCheckCircle className="mr-1" /> Accepter
                    </button>
                    <button className="btn bg-red-600 text-white hover:bg-red-700 text-sm px-3 py-1">
                      Refuser
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="card">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <FaCalendarAlt className="text-green-500" />
                Événements à venir
              </h3>
              <Link to="/manager/events" className="text-blue-600 hover:text-blue-700 text-sm">
                Voir tous →
              </Link>
            </div>
            
            <div className="space-y-4">
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-semibold text-gray-900">Conférence Annuelle</p>
                    <p className="text-sm text-gray-600">Organisateur: Admin Principal</p>
                  </div>
                  <span className="badge badge-success">Planifié</span>
                </div>
                <p className="text-sm text-gray-700 mb-2">📅 Demain, 9h-12h</p>
                <p className="text-sm text-gray-700 mb-3">📍 Salle de conférence A</p>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <FaUsers />
                  <span>25 participants confirmés</span>
                </div>
              </div>
              
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-semibold text-gray-900">Formation Management</p>
                    <p className="text-sm text-gray-600">Organisateur: Moi-même</p>
                  </div>
                  <span className="badge badge-success">Planifié</span>
                </div>
                <p className="text-sm text-gray-700 mb-2">📅 Vendredi, 14h-17h</p>
                <p className="text-sm text-gray-700 mb-3">📍 Salle de réunion B</p>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <FaUsers />
                  <span>12 participants confirmés</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardManager;