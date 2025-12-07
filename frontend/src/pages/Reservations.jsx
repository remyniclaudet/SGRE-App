import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { getReservations, getUserReservations, createReservation } from '../api/reservations';
import { getResources } from '../api/resources';
import ReservationModal from '../components/ReservationModal';
import { FaPlus, FaFilter, FaCalendarAlt } from 'react-icons/fa';

const Reservations = () => {
  const { user } = useContext(AuthContext);
  const [reservations, setReservations] = useState([]);
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [filters, setFilters] = useState({
    status: '',
    start_date: '',
    end_date: ''
  });

  const isManagerOrAdmin = user?.role === 'MANAGER' || user?.role === 'ADMIN';

  useEffect(() => {
    fetchData();
  }, [filters]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      const [reservationsRes, resourcesRes] = await Promise.all([
        isManagerOrAdmin ? getReservations(filters) : getUserReservations(user.id),
        getResources()
      ]);

      setReservations(reservationsRes.reservations || []);
      setResources(resourcesRes.resources || []);
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleCreateReservation = async (reservationData) => {
    try {
      await createReservation(reservationData);
      fetchData();
      setShowModal(false);
    } catch (error) {
      console.error('Erreur lors de la création de la réservation:', error);
    }
  };

  const handleStatusChange = async (reservationId, newStatus) => {
    // À implémenter
    console.log('Changer statut:', reservationId, newStatus);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'CONFIRMED': return 'badge-success';
      case 'PENDING': return 'badge-warning';
      case 'REJECTED': return 'badge-danger';
      case 'CANCELLED': return 'badge-danger';
      default: return 'badge-info';
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
        <div className="text-lg text-gray-600">Chargement des réservations...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Réservations</h1>
          <p className="text-gray-600 mt-2">
            {isManagerOrAdmin ? 'Gérez toutes les réservations' : 'Mes réservations'}
          </p>
        </div>
        {user?.role === 'CLIENT' && (
          <button
            onClick={() => setShowModal(true)}
            className="btn btn-primary flex items-center gap-2"
          >
            <FaPlus />
            Nouvelle réservation
          </button>
        )}
      </div>

      {/* Filters */}
      {isManagerOrAdmin && (
        <div className="card p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <FaFilter />
            Filtres
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Statut
              </label>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="input"
              >
                <option value="">Tous les statuts</option>
                <option value="PENDING">En attente</option>
                <option value="CONFIRMED">Confirmé</option>
                <option value="REJECTED">Rejeté</option>
                <option value="CANCELLED">Annulé</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date de début
              </label>
              <input
                type="date"
                value={filters.start_date}
                onChange={(e) => handleFilterChange('start_date', e.target.value)}
                className="input"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date de fin
              </label>
              <input
                type="date"
                value={filters.end_date}
                onChange={(e) => handleFilterChange('end_date', e.target.value)}
                className="input"
              />
            </div>

            <div className="flex items-end">
              <button
                onClick={() => setFilters({ status: '', start_date: '', end_date: '' })}
                className="btn btn-outline w-full"
              >
                Réinitialiser
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reservations List */}
      <div className="space-y-4">
        {reservations.length === 0 ? (
          <div className="text-center py-12">
            <FaCalendarAlt className="text-4xl text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {isManagerOrAdmin ? 'Aucune réservation trouvée' : 'Vous n\'avez aucune réservation'}
            </h3>
            <p className="text-gray-500">
              {isManagerOrAdmin 
                ? 'Aucune réservation ne correspond à vos critères'
                : 'Commencez par réserver une ressource'
              }
            </p>
            {user?.role === 'CLIENT' && (
              <button
                onClick={() => setShowModal(true)}
                className="inline-block mt-4 btn btn-primary"
              >
                Faire ma première réservation
              </button>
            )}
          </div>
        ) : (
          reservations.map(reservation => (
            <div key={reservation.id} className="card p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold">{reservation.resource_name}</h3>
                  <p className="text-gray-600">
                    {reservation.resource_type} • {reservation.resource_location}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`badge ${getStatusColor(reservation.status)}`}>
                    {reservation.status}
                  </span>
                  {isManagerOrAdmin && reservation.status === 'PENDING' && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleStatusChange(reservation.id, 'CONFIRMED')}
                        className="btn bg-green-600 text-white hover:bg-green-700 text-sm px-3 py-1"
                      >
                        Confirmer
                      </button>
                      <button
                        onClick={() => handleStatusChange(reservation.id, 'REJECTED')}
                        className="btn bg-red-600 text-white hover:bg-red-700 text-sm px-3 py-1"
                      >
                        Rejeter
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <p className="text-sm font-medium text-gray-700">Date de début</p>
                  <p className="text-gray-900">{formatDate(reservation.start_at)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Date de fin</p>
                  <p className="text-gray-900">{formatDate(reservation.end_at)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Demandé par</p>
                  <p className="text-gray-900">{reservation.user_name || 'Utilisateur'}</p>
                </div>
              </div>

              {reservation.event_title && (
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm font-medium text-blue-700">Événement associé</p>
                  <p className="text-blue-900">{reservation.event_title}</p>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {['PENDING', 'CONFIRMED', 'REJECTED', 'CANCELLED'].map(status => {
          const count = reservations.filter(r => r.status === status).length;
          return (
            <div key={status} className="card p-6 text-center">
              <span className={`badge ${getStatusColor(status)} mb-2`}>
                {status}
              </span>
              <p className="text-2xl font-bold mt-2">{count}</p>
            </div>
          );
        })}
      </div>

      {/* Create Reservation Modal */}
      {showModal && (
        <ReservationModal
          resources={resources}
          onClose={() => setShowModal(false)}
          onSubmit={handleCreateReservation}
          userId={user?.id}
        />
      )}
    </div>
  );
};

export default Reservations;