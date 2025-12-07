import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { FaCheckCircle, FaTimesCircle, FaEye, FaSearch, FaFilter, FaCalendarAlt } from 'react-icons/fa';

const ManagerReservations = () => {
  const [reservations, setReservations] = useState([]);
  const [filteredReservations, setFilteredReservations] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState(null);

  useEffect(() => {
    fetchReservations();
  }, []);

  useEffect(() => {
    filterReservations();
  }, [searchTerm, selectedStatus, reservations]);

  const fetchReservations = async () => {
    try {
      setLoading(true);
      const response = await api.get('/reservations');
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
        reservation.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reservation.resource_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reservation.notes?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedStatus) {
      filtered = filtered.filter(reservation => reservation.status === selectedStatus);
    }

    setFilteredReservations(filtered);
  };

  const handleStatusChange = async (reservationId, status) => {
    try {
      await api.put(`/reservations/${reservationId}/status`, { status });
      fetchReservations(); // Rafraîchir la liste
    } catch (error) {
      console.error('Error updating reservation status:', error);
    }
  };

  const openDetailsModal = (reservation) => {
    setSelectedReservation(reservation);
    setShowDetailsModal(true);
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
        <div className="text-xl">Chargement des réservations...</div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Gestion des Réservations</h1>

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
              placeholder="Rechercher par client, ressource..."
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
          <p className="text-gray-600 text-sm">Rejetées</p>
          <p className="text-2xl font-bold text-red-600">
            {reservations.filter(r => r.status === 'rejected').length}
          </p>
        </div>
      </div>

      {/* Tableau des réservations */}
      <div className="card">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="table-header">Client</th>
                <th className="table-header">Ressource</th>
                <th className="table-header">Date de début</th>
                <th className="table-header">Date de fin</th>
                <th className="table-header">Statut</th>
                <th className="table-header">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredReservations.map((reservation) => (
                <tr key={reservation.id}>
                  <td className="table-cell">{reservation.user_name}</td>
                  <td className="table-cell">{reservation.resource_name}</td>
                  <td className="table-cell">{formatDate(reservation.start_date)}</td>
                  <td className="table-cell">{formatDate(reservation.end_date)}</td>
                  <td className="table-cell">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(reservation.status)}`}>
                      {reservation.status}
                    </span>
                  </td>
                  <td className="table-cell">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => openDetailsModal(reservation)}
                        className="text-blue-600 hover:text-blue-800"
                        title="Voir détails"
                      >
                        <FaEye />
                      </button>
                      
                      {reservation.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleStatusChange(reservation.id, 'confirmed')}
                            className="text-green-600 hover:text-green-800"
                            title="Accepter"
                          >
                            <FaCheckCircle />
                          </button>
                          <button
                            onClick={() => handleStatusChange(reservation.id, 'rejected')}
                            className="text-red-600 hover:text-red-800"
                            title="Refuser"
                          >
                            <FaTimesCircle />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Détails réservation */}
      {showDetailsModal && selectedReservation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
            <h2 className="text-xl font-bold mb-4">Détails de la réservation</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="font-semibold mb-3">Informations client</h3>
                <div className="space-y-2">
                  <div>
                    <p className="text-sm text-gray-600">Nom</p>
                    <p className="font-medium">{selectedReservation.user_name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Ressource</p>
                    <p className="font-medium">{selectedReservation.resource_name}</p>
                  </div>
                  {selectedReservation.event_title && (
                    <div>
                      <p className="text-sm text-gray-600">Événement associé</p>
                      <p className="font-medium">{selectedReservation.event_title}</p>
                    </div>
                  )}
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold mb-3">Dates</h3>
                <div className="space-y-2">
                  <div>
                    <p className="text-sm text-gray-600">Début</p>
                    <p className="font-medium">{formatDate(selectedReservation.start_date)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Fin</p>
                    <p className="font-medium">{formatDate(selectedReservation.end_date)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Statut</p>
                    <p className={`font-medium inline-block px-3 py-1 rounded-full ${getStatusColor(selectedReservation.status)}`}>
                      {selectedReservation.status}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {selectedReservation.notes && (
              <div className="mb-6">
                <h3 className="font-semibold mb-2">Notes</h3>
                <div className="bg-gray-50 p-4 rounded">
                  <p className="text-gray-700">{selectedReservation.notes}</p>
                </div>
              </div>
            )}
            
            {selectedReservation.status === 'pending' && (
              <div className="flex space-x-3 mb-6">
                <button
                  onClick={() => {
                    handleStatusChange(selectedReservation.id, 'confirmed');
                    setShowDetailsModal(false);
                  }}
                  className="btn-primary flex-1 flex items-center justify-center space-x-2"
                >
                  <FaCheckCircle />
                  <span>Accepter la réservation</span>
                </button>
                <button
                  onClick={() => {
                    handleStatusChange(selectedReservation.id, 'rejected');
                    setShowDetailsModal(false);
                  }}
                  className="btn-danger flex-1 flex items-center justify-center space-x-2"
                >
                  <FaTimesCircle />
                  <span>Refuser la réservation</span>
                </button>
              </div>
            )}
            
            <div className="flex justify-end">
              <button
                onClick={() => setShowDetailsModal(false)}
                className="btn-secondary"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagerReservations;