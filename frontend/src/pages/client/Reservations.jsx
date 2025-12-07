import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { FaTrash, FaSearch, FaFilter, FaCalendarAlt, FaClock, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

const ClientReservations = () => {
  const [reservations, setReservations] = useState([]);
  const [filteredReservations, setFilteredReservations] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [reservationToCancel, setReservationToCancel] = useState(null);

  useEffect(() => {
    fetchReservations();
  }, []);

  useEffect(() => {
    filterReservations();
  }, [searchTerm, selectedStatus, reservations]);

  const fetchReservations = async () => {
    try {
      setLoading(true);
      const response = await api.get('/reservations/my-reservations');
      setReservations(response.data.reservations);
      setFilteredReservations(response.data.reservations);
    } catch (error) {
      console.error('Error fetching reservations:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterReservations = () => {
    let filtered = reservations;

    if (searchTerm) {
      filtered = filtered.filter(reservation =>
        reservation.resource_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reservation.notes?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedStatus) {
      filtered = filtered.filter(reservation => reservation.status === selectedStatus);
    }

    setFilteredReservations(filtered);
  };

  const handleCancelReservation = async () => {
    try {
      await api.put(`/reservations/${reservationToCancel.id}/cancel`);
      setShowCancelModal(false);
      setReservationToCancel(null);
      fetchReservations(); // Rafraîchir la liste
    } catch (error) {
      console.error('Error cancelling reservation:', error);
    }
  };

  const openCancelModal = (reservation) => {
    setReservationToCancel(reservation);
    setShowCancelModal(true);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedStatus('');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'cancelled': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed': return <FaCheckCircle className="text-green-500" />;
      case 'pending': return <FaClock className="text-yellow-500" />;
      case 'rejected': return <FaTimesCircle className="text-red-500" />;
      case 'cancelled': return <FaTimesCircle className="text-gray-500" />;
      default: return <FaClock className="text-gray-500" />;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-xl">Chargement de vos réservations...</div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Mes Réservations</h1>

      {/* Filtres */}
      <div className="card mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <div className="flex items-center">
                <FaSearch className="mr-2" />
                Recherche
              </div>
            </label>
            <input
              type="text"
              placeholder="Rechercher par ressource..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <div className="flex items-center">
                <FaFilter className="mr-2" />
                Statut
              </div>
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="input-field"
            >
              <option value="">Tous les statuts</option>
              <option value="pending">En attente</option>
              <option value="confirmed">Confirmé</option>
              <option value="rejected">Rejeté</option>
              <option value="cancelled">Annulé</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={clearFilters}
              className="btn-secondary w-full"
            >
              Réinitialiser les filtres
            </button>
          </div>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="card text-center">
          <p className="text-gray-600 text-sm">Total</p>
          <p className="text-2xl font-bold">{reservations.length}</p>
        </div>
        <div className="card text-center">
          <p className="text-gray-600 text-sm">En attente</p>
          <p className="text-2xl font-bold text-yellow-600">
            {reservations.filter(r => r.status === 'pending').length}
          </p>
        </div>
        <div className="card text-center">
          <p className="text-gray-600 text-sm">Confirmées</p>
          <p className="text-2xl font-bold text-green-600">
            {reservations.filter(r => r.status === 'confirmed').length}
          </p>
        </div>
        <div className="card text-center">
          <p className="text-gray-600 text-sm">Annulées</p>
          <p className="text-2xl font-bold text-gray-600">
            {reservations.filter(r => r.status === 'cancelled').length}
          </p>
        </div>
      </div>

      {/* Liste des réservations */}
      {filteredReservations.length > 0 ? (
        <div className="space-y-4">
          {filteredReservations.map((reservation) => (
            <div key={reservation.id} className="card">
              <div className="flex flex-col md:flex-row md:items-center justify-between">
                <div className="mb-4 md:mb-0 md:flex-1">
                  <div className="flex items-start mb-3">
                    <div className="mr-3 mt-1">
                      {getStatusIcon(reservation.status)}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">{reservation.resource_name}</h3>
                      {reservation.event_title && (
                        <p className="text-gray-600 text-sm">Événement: {reservation.event_title}</p>
                      )}
                      <p className="text-gray-600 text-sm">
                        <FaCalendarAlt className="inline mr-1" />
                        {formatDate(reservation.start_date)} - {formatDate(reservation.end_date)}
                      </p>
                    </div>
                  </div>
                  
                  {reservation.notes && (
                    <div className="mt-2">
                      <p className="text-sm text-gray-600">Notes:</p>
                      <p className="text-gray-700">{reservation.notes}</p>
                    </div>
                  )}
                </div>
                
                <div className="flex flex-col items-end space-y-3">
                  <div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(reservation.status)}`}>
                      {reservation.status}
                    </span>
                  </div>
                  
                  <div className="flex space-x-2">
                    {reservation.status === 'pending' && (
                      <button
                        onClick={() => openCancelModal(reservation)}
                        className="text-red-600 hover:text-red-800 flex items-center space-x-1"
                      >
                        <FaTrash />
                        <span>Annuler</span>
                      </button>
                    )}
                    
                    {reservation.status === 'confirmed' && (
                      <a
                        href={`/client/reservations/${reservation.id}/details`}
                        className="text-primary-600 hover:text-primary-800 text-sm"
                      >
                        Voir détails
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card text-center py-12">
          <FaCalendarAlt className="text-gray-400 text-4xl mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Aucune réservation trouvée</h3>
          <p className="text-gray-600 mb-6">
            {reservations.length === 0
              ? "Vous n'avez pas encore de réservation. Parcourez le catalogue pour réserver une ressource."
              : "Aucune réservation ne correspond à vos critères de recherche."}
          </p>
          <div className="space-x-4">
            <a
              href="/client/catalog"
              className="btn-primary inline-block"
            >
              Parcourir le catalogue
            </a>
            <button
              onClick={clearFilters}
              className="btn-secondary inline-block"
            >
              Réinitialiser les filtres
            </button>
          </div>
        </div>
      )}

      {/* Modal Annulation */}
      {showCancelModal && reservationToCancel && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Confirmer l'annulation</h2>
            <p className="text-gray-600 mb-6">
              Êtes-vous sûr de vouloir annuler votre réservation pour <strong>{reservationToCancel.resource_name}</strong> ?
            </p>
            <div className="space-y-4 mb-6">
              <div className="bg-yellow-50 border border-yellow-200 rounded p-4">
                <p className="text-sm text-yellow-700">
                  <strong>Note:</strong> L'annulation de réservations confirmées peut être soumise à des conditions particulières.
                </p>
              </div>
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowCancelModal(false)}
                className="btn-secondary"
              >
                Garder la réservation
              </button>
              <button
                onClick={handleCancelReservation}
                className="btn-danger flex items-center space-x-2"
              >
                <FaTrash />
                <span>Annuler la réservation</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientReservations;